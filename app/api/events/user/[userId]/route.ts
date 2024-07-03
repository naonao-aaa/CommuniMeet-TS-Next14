import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/config/database"; // データベース接続設定をインポート
import Event from "@/models/Event"; // MongooseのEventモデルをインポート

//paramsの型定義。
interface RequestParams {
  userId: string; // パラメーター 'userId' の型を定義
}

// GET /api/events/user/:userId
export const GET = async (
  request: NextApiRequest,
  { params }: { params: RequestParams }
) => {
  try {
    await connectDB(); // データベースに接続

    const userId = params.userId; // リクエストからuserIdを抽出

    if (!userId) {
      // userIdが存在しない場合
      return new Response("User ID is required", { status: 400 }); // 400ステータスとエラーメッセージを返す
    }

    const events = await Event.find({ owner: userId }); // userIdに基づいてイベントを検索

    return new Response(JSON.stringify(events), {
      // 検索結果をJSON形式でクライアントに返す
      status: 200,
    });
  } catch (error) {
    // エラーが発生した場合
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 }); // 500ステータスとエラーメッセージを返す
  }
};
