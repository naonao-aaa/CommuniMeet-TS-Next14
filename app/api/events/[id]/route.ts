import connectDB from "@/config/database";
import Event from "@/models/Event";
import { getSessionUser } from "@/utils/getSessionUser";

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

// DELETE /api/events/:id
export const DELETE = async (
  request: Request,
  { params }: { params: Params }
) => {
  try {
    const eventId = params.id; // リクエストから、イベントIDを取得。

    const sessionUser = await getSessionUser(); // セッションユーザーを取得する関数を非同期で呼び出す。

    // セッション確認
    if (!sessionUser || !sessionUser.userId) {
      // 「セッションユーザーが存在しない場合」または「ユーザーIDが存在しない場合」
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser; // セッションユーザーからユーザーIDを抽出。

    await connectDB(); // データベースに接続。

    const event = await Event.findById(eventId); // MongoDBから、指定されたIDでイベントを検索。

    if (!event) return new Response("Event Not Found", { status: 404 }); // イベントが存在しない場合は404エラーを返す。

    // 所有権の検証
    if (event.owner.toString() !== userId) {
      // イベントの所有者がセッションのユーザーIDと一致しない場合
      return new Response("Unauthorized", { status: 401 });
    }

    await event.deleteOne(); // イベントのドキュメントを削除。

    // 成功レスポンス
    return new Response("Event Deleted", {
      status: 200,
    });
  } catch (error) {
    // エラーが発生した場合
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
