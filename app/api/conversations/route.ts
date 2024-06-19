import connectDB from "@/config/database"; // データベース接続設定をインポート
import Conversation from "@/models/Conversation"; // Conversationモデルをインポート
import Message from "@/models/Message";
import User from "@/models/User";
import Event from "@/models/Event";
import { getSessionUser } from "@/utils/getSessionUser"; // セッションユーザーを取得するための関数をインポート

export const dynamic = "force-dynamic"; //キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

// GET /api/conversations
// 自分が参加しているConversation(会話)の一覧を取得するためのGETエンドポイント。
export const GET = async (request: Request) => {
  try {
    await connectDB(); // データベースに接続

    const sessionUser = await getSessionUser(); // セッションユーザーを取得

    // セッションユーザーが存在しない場合、認証されていないと判断して401エラーを返送
    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // ユーザーが参加している会話(メッセージのコンテナ)をすべて取得
    const conversations = await Conversation.find({
      $or: [{ ownerId: sessionUser.user.id }, { userId: sessionUser.user.id }],
    })
      .populate("eventId", "name") // イベント情報をIDからイベント名に置換して取得
      .populate("ownerId", "username") // オーナー情報をIDからユーザー名に置換して取得
      .populate("userId", "username") // ユーザー情報をIDからユーザー名に置換して取得
      .populate({
        path: "lastMessageId",
        select: "body createdAt", // ここで必要なフィールドだけを指定。（最後に交換されたメッセージの本文と作成日時を指定）
        populate: {
          path: "senderId",
          select: "username", // メッセージの送信者のユーザー名を取得
        },
      });

    // 成功した場合、会話(メッセージコンテナ)情報のリストを、JSON形式でクライアントに返送
    return new Response(JSON.stringify(conversations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to load conversations:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// POST /api/conversations
// 会話(メッセージのコンテナ)を新規作成するためのエンドポイント。
// 既に会話(メッセージのコンテナ)が存在していたら、新たに会話(メッセージのコンテナ)を作成する代わりに、既存の会話(メッセージのコンテナ)情報を返す。
export const POST = async (request: Request) => {
  try {
    await connectDB(); // データベースに接続

    // リクエストから、イベントIDとオーナーIDを抽出
    const { eventId, ownerId } = await request.json();

    // eventIdとownerIdが、正しい形で受け取れているかのチェック。
    if (!eventId || !ownerId) {
      console.error("Invalid request data: ", { eventId, ownerId });
      return new Response(
        JSON.stringify({ error: "Event ID and Owner ID are required." }),
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser(); // セッションユーザーを取得

    // ユーザーがログインしていない場合は、401ステータスでエラーメッセージを返す
    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({
          error: "You must be logged in to create a conversation",
        }),
        { status: 401 }
      );
    }

    const { user } = sessionUser; // セッションからユーザーオブジェクトを抽出

    // 自分がオーナーになっているものには、会話(メッセージのコンテナ)を作成しないようにする。（自分とのやり取りとなってしまうので。）
    if (user.id === ownerId) {
      return new Response(
        JSON.stringify({
          error:
            "自分がオーナーになっているイベントに対してはお問合せできません。",
        }),
        { status: 400 }
      );
    }

    // 既に会話(メッセージのコンテナ)が存在するかを検索
    const existingConversation = await Conversation.findOne({
      eventId: eventId,
      ownerId: ownerId,
      userId: user.id,
    });

    // 既に会話(メッセージのコンテナ)が存在していたら、新たに会話(メッセージのコンテナ)を作成する代わりに、既存の会話(メッセージのコンテナ)情報を返す。
    if (existingConversation) {
      return new Response(
        JSON.stringify({
          message: "Conversation already exists",
          conversationId: existingConversation._id,
        }),
        { status: 200 }
      );
    }

    // DBに該当の会話(メッセージのコンテナ)が存在していなかったら、新しい会話(メッセージのコンテナ)オブジェクトを作成
    const newConversation = new Conversation({
      eventId: eventId, // イベントID
      ownerId: ownerId, // イベントオーナーのID
      userId: user.id, // イベントに興味を持つ一般ユーザーのID
    });

    await newConversation.save(); // 会話(メッセージのコンテナ)を、データベースに保存

    // 新規の会話(メッセージのコンテナ)作成が成功したら、新規作成した会話(メッセージのコンテナ)の情報を返す。
    return new Response(
      JSON.stringify({
        message: "Conversation Created",
        conversationId: newConversation._id,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    //エラーが発生した場合
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
