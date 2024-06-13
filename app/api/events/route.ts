import connectDB from "@/config/database";
import Event from "@/models/Event";
import { getSessionUser } from "@/utils/getSessionUser"; //セッション情報からユーザー情報を取得する関数をインポート
import cloudinary from "@/config/cloudinary";
import Busboy from "busboy";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";

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

// POST /api/events
// POSTリクエストを処理してイベント情報をデータベースに追加
export const POST = async (request: Request) => {
  try {
    await connectDB(); // データベースに接続

    const sessionUser = await getSessionUser(); // セッションユーザー情報を取得

    // 「セッションユーザーが存在しない場合」または「ユーザーIDが取得できない場合」は、エラーレスポンスを返す
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser; // ユーザーIDをセッションから取得

    const formData = await request.formData(); // リクエストからFormDataを取得
    const body = await request.json(); // JSONデータも受け取る

    // FormDataからconditionsの全ての値を取得
    const conditions = formData.getAll("conditions");

    // JSONボディから画像URLを取得
    const imageUrls = body.images || [];

    // FormDataからimagesの全ての値を取得し、空でないファイル名のものだけをフィルター
    // const images = formData
    //   .getAll("images")
    //   .filter((item): item is File => item instanceof File && item.name !== "");

    // データベースに保存するためのオブジェクトを構築
    const eventData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        venue: formData.get("location.venue"),
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      date_time: {
        start: formData.get("date_time.start"),
        end: formData.get("date_time.end"),
      },
      attendee_limits: {
        min: formData.get("attendee_limits.min"),
        max: formData.get("attendee_limits.max"),
      },
      ticket_info: {
        price: formData.get("ticket_info.price"),
      },
      conditions,
      responsible_info: {
        name: formData.get("responsible_info.name"),
        email: formData.get("responsible_info.email"),
        phone: formData.get("responsible_info.phone"),
      },
      owner: userId,
      images: imageUrls, // 画像URLをイベントデータに含める
    };

    // 新しいイベントを、データベースに保存
    const newEvent = new Event(eventData);
    await newEvent.save();

    // 成功時のレスポンス、イベントが正常に保存された後、そのイベントの詳細ページにリダイレクト
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/events/${newEvent._id}`
    );
  } catch (error) {
    // エラー時のレスポンス
    console.error("Error during POST /api/events:", error);
    return new Response("Failed to add event", { status: 500 });
  }
};
