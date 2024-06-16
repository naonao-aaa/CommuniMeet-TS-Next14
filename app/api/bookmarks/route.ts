import connectDB from "@/config/database"; // データベース設定をインポート
import User from "@/models/User"; // Userモデルをインポート
import Event from "@/models/Event"; // Eventモデルをインポート
import { getSessionUser } from "@/utils/getSessionUser"; // セッションユーザー取得用の関数をインポート

export const dynamic = "force-dynamic"; ////キャッシュを利用せずに、リクエスト毎に最新のデータを取得するための記述。

//イベントのブックマークを、追加または削除するためのAPIエンドポイント
export const POST = async (request: Request) => {
  try {
    await connectDB(); // データベースに接続。

    const { eventId } = await request.json(); // リクエストボディからeventIdを抽出

    const sessionUser = await getSessionUser(); // セッションユーザーを取得。

    // 「セッションユーザーが存在しない場合」または「userIdがない場合」
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser; // セッションユーザーからuserIdを取得。

    // データベースから、userIdに基づいてユーザーを取得
    const user = await User.findOne({ _id: userId });

    // 既にブックマークされているかどうかをチェック
    let isBookmarked = user.bookmarks.includes(eventId);

    let message; // レスポンスで返すメッセージを格納する変数

    if (isBookmarked) {
      // すでにブックマークされている場合
      user.bookmarks.pull(eventId); // ブックマークリストから該当のイベントIDを削除
      message = "ブックマークは、正常に削除されました"; // 削除成功メッセージを設定
      isBookmarked = false; // ブックマーク状態を更新
    } else {
      // ブックマークされていない場合
      user.bookmarks.push(eventId); // ブックマークリストにイベントIDを追加。
      message = "ブックマークが、正常に追加されました"; // 追加成功メッセージを設定
      isBookmarked = true; // ブックマーク状態を更新
    }

    await user.save(); // ユーザー情報の更新をデータベースに保存

    // 成功のレスポンス
    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    // エラーハンドリング
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
