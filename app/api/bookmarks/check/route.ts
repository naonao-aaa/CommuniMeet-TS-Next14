import connectDB from "@/config/database"; // データベース接続用のモジュールをインポート
import User from "@/models/User"; // Userモデルをインポート
import { getSessionUser } from "@/utils/getSessionUser"; // セッションユーザーを取得するための関数をインポート

export const dynamic = "force-dynamic"; // キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

//ログインしているユーザーのセッション情報を基に、指定されたイベントがそのユーザーによってブックマークされているかどうかをチェックし、その結果をクライアントに返すAPI。
export const POST = async (request: Request) => {
  try {
    await connectDB(); // データベースに接続

    const { eventId } = await request.json(); // リクエストボディからeventIdを取得

    const sessionUser = await getSessionUser(); // セッションユーザーを取得

    // 「セッションユーザーが存在しない場合」または「ユーザーIDがない場合」
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser; // セッションユーザーからuserIdを取得

    // データベースからユーザーを検索
    const user = await User.findOne({ _id: userId });

    // イベントがブックマークされているか確認
    let isBookmarked = user.bookmarks.includes(eventId);

    // ブックマーク状態を返す
    return new Response(JSON.stringify({ isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    //エラーハンドリング
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
