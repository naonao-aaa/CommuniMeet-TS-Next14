import connectDB from "@/config/database";
import Conversation from "@/models/Conversation"; // Conversationモデルをインポート

export const dynamic = "force-dynamic"; //キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

// URLパラメーターの型定義
interface Params {
  conversationId: string;
}

// GET /api/conversations/[conversationId]
// 該当conversationIdに基づいて、イベント情報を取得するためのエンドポイント。
export const GET = async (request: Request, { params }: { params: Params }) => {
  try {
    await connectDB(); // データベースに接続

    // 指定されたconversationIdに基づいて会話(メッセージのコンテナ)を検索し、関連するイベント名も取得
    const conversation = await Conversation.findById(
      params.conversationId
    ).populate("eventId", "name"); //関連するイベント名も取得。

    // 該当のconversationがなければ、エラーを返す。
    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    // 検索した会話(メッセージのコンテナ)をJSON形式でクライアントに返送
    return new Response(JSON.stringify(conversation), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
