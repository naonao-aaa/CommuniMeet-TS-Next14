import connectDB from "@/config/database";
import Message from "@/models/Message"; // Messageモデルをインポート
import { getSessionUser } from "@/utils/getSessionUser"; // セッションユーザー取得用の関数をインポート

export const dynamic = "force-dynamic"; //キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

// URLパラメーターの型定義
interface Params {
  messageId: string;
}

// PUT /api/messages/read/:messageId
// メッセージを既読状態に更新するエンドポイント
export const PUT = async (request: Request, { params }: { params: Params }) => {
  try {
    await connectDB(); // データベースに接続

    const { messageId } = params; // リクエストからメッセージIDを取得

    if (!messageId) {
      return new Response(JSON.stringify({ error: "Message ID is required" }), {
        status: 400,
      });
    }

    const message = await Message.findById(messageId); // DBから、メッセージIDに基づいてメッセージを検索

    if (!message) return new Response("Message Not Found", { status: 404 }); // メッセージが見つからない場合、404エラーを返す

    // セッションからユーザー情報を取得。
    const sessionUser = await getSessionUser();

    // ログインユーザーが受信者ではないメッセージは、既読フラグをtrueにしたくないので、ここでreturnする。
    //（フロント側で、ログインユーザーが受信者で未読となっているメッセージのIDのみがリクエストされるようにしているが、念の為サーバー側でもバリデーションしておく。）
    if (message.recipientId.toString() !== sessionUser?.userId?.toString()) {
      return new Response(
        JSON.stringify({ error: "ログインユーザーは、受信者ではありません。" }),
        { status: 403 }
      );
    }

    // メッセージの既読フラグをtrueにする。（既読にする。）
    message.read = true;

    await message.save(); // 更新されたメッセージを、DBに保存

    return new Response(JSON.stringify(message), { status: 200 }); // 更新後のメッセージをレスポンスとして返す
  } catch (error) {
    console.error("Error updating message read status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
