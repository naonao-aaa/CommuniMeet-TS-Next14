import connectDB from "@/config/database";
import Event from "@/models/Event"; // Eventモデルをインポート

export const dynamic = "force-dynamic"; // キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

// GET /api/events/featured
// 注目のイベント（is_featuredがtrueのイベント）をデータベースから取得するAPI
export const GET = async (request: Request) => {
  try {
    await connectDB(); // データベースに接続

    // 注目のイベントをデータベースから検索
    const events = await Event.find({
      is_featured: true, // is_featuredフィールドがtrueのドキュメントのみを検索
    });

    // 検索結果をJSON形式でクライアントに返す
    return new Response(JSON.stringify(events), {
      status: 200,
    });
  } catch (error) {
    // エラーが出た場合
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
