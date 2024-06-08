import connectDB from "@/config/database";
import Event from "@/models/Event";

// GET /api/events
export const GET = async (request: Request) => {
  try {
    await connectDB(); // connectDB関数を呼び出してデータベースに接続を試みる。

    const events = await Event.find({}); //Event モデルを使用して、MongoDB からすべての物件データを取得

    return new Response(JSON.stringify(events), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    // エラー時は、ステータスコード 500 のレスポンスを返す。
    return new Response("Something Went Wrong", { status: 500 });
  }
};
