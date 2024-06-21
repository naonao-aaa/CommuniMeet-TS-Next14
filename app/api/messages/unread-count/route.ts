import connectDB from "@/config/database"; // データベース接続用の関数をインポート
import Message from "@/models/Message"; // Messageモデルをインポート
import { getSessionUser } from "@/utils/getSessionUser"; // セッションユーザーを取得する関数をインポート

export const dynamic = "force-dynamic"; // キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

// ログイン中のユーザーの未読メッセージ数を取得するGET API
// GET /api/messages/unread-count
export const GET = async (request: Request) => {
  try {
    await connectDB(); // データベースへの接続を確立

    const sessionUser = await getSessionUser(); // ログイン中のユーザーのセッションを取得

    // 「セッションが存在しない場合」または「ユーザー情報が存在しない場合」は、エラーを返す。
    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { userId } = sessionUser; // セッションからuserIdを抽出

    // ログインユーザーの未読メッセージ数を数える
    const count = await Message.countDocuments({
      recipientId: userId,
      read: false,
    });

    // 未読メッセージの数をレスポンスとして返す
    return new Response(JSON.stringify({ unreadCount: count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    //エラーが発生した場合
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
