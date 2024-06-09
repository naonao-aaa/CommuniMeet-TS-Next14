import connectDB from "@/config/database";
import Event from "@/models/Event";

// URLパラメーターの型定義
interface Params {
  id: string;
}

// GET /api/events/:id
export const GET = async (request: Request, { params }: { params: Params }) => {
  try {
    await connectDB(); // データベースへの接続を確立

    const event = await Event.findById(params.id); // URLパラメータからeventのidを取得して、該当するeventを検索

    if (!event) return new Response("Event Not Found", { status: 404 }); // eventが見つからない場合、404ステータスコードと共にレスポンスを返す

    // eventが見つかった場合、event情報をJSON形式でレスポンス
    return new Response(JSON.stringify(event), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
