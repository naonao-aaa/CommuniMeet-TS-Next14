import connectDB from "@/config/database";
import Message from "@/models/Message"; // Messageモデルをインポート
import Conversation from "@/models/Conversation"; // Conversationモデルをインポート
import { getSessionUser } from "@/utils/getSessionUser"; // セッションユーザーを取得するための関数をインポート

export const dynamic = "force-dynamic"; //キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

// URLパラメーターの型定義
interface Params {
  conversationId: string;
}

// GET /api/messages/[conversationId]
// conversationIdに基づいたメッセージ一覧を取得するためのエンドポイント。
export const GET = async (request: Request, { params }: { params: Params }) => {
  try {
    await connectDB(); // データベースに接続

    // 指定されたconversationIdに基づいてメッセージを取得
    const messages = await Message.find({
      conversationId: params.conversationId, //URLパラメーターの「conversationId」を条件にする。
    }).populate("senderId", "username");

    // 検索したメッセージをJSON形式でクライアントに返送
    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // エラーが出た場合
    console.error("Error fetching messages:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

// POST /api/messages/[conversationId]
// メッセージを新規登録するためのエンドポイント。
export const POST = async (
  request: Request,
  { params }: { params: Params }
) => {
  try {
    await connectDB(); // データベースに接続

    const sessionUser = await getSessionUser(); // セッションユーザーを取得
    const { body } = await request.json(); // リクエストからbody(メッセージ本文)を取得

    // セッションユーザーが存在しない場合、認証されていないと判断して401エラーを返送
    if (!sessionUser || !sessionUser.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 該当の会話(メッセージのコンテナ)を取得。
    const conversation = await Conversation.findById(params.conversationId);

    // 該当の会話(メッセージのコンテナ)が無い場合は、エラーを返す。
    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    // 受け手の情報を設定。(ログインユーザーとこの会話のイベントオーナーが一致していたら、受け手を一般ユーザーとする。一致していなかったら、受け手をイベントオーナーとする。）
    const recipientId =
      sessionUser.user.id?.toString() === conversation.ownerId.toString()
        ? conversation.userId
        : conversation.ownerId;
    // イベントIDを設定。
    const eventId = conversation.eventId;

    // 新しいMessageオブジェクトを作成
    const newMessage = new Message({
      conversationId: params.conversationId, //URLパラメーターの「conversationId」を設定。
      senderId: sessionUser.user.id,
      recipientId,
      eventId,
      body,
    });

    // データベースに、新しいメッセージを保存
    await newMessage.save();

    // 該当の会話(メッセージのコンテナ)の、lastMessageIdフィールドを更新する。
    conversation.lastMessageId = newMessage._id;
    await conversation.save();

    // senderIdをpopulateして、返却するnewMessageにusernameも含める
    await newMessage.populate("senderId", "username");

    // 新しいメッセージをJSON形式でクライアントに返送
    return new Response(JSON.stringify(newMessage), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // エラーが出た場合
    console.error("Error posting message:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
