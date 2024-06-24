import connectDB from "@/config/database";
import Event from "@/models/Event";
import { getSessionUser } from "@/utils/getSessionUser"; //セッション情報からユーザー情報を取得する関数をインポート
import cloudinary from "@/config/cloudinary";

// GET /api/events
export const GET = async (request) => {
  try {
    await connectDB(); // connectDB関数を呼び出してデータベースに接続を試みる。

    // const events = await Event.find({}); //Eventモデルを使用して、MongoDB からすべてのイベントデータを取得

    // リクエストからページ番号を取得。デフォルトは1ページ目としている。
    const page = request.nextUrl.searchParams.get("page") || 1;
    // リクエストからページサイズを取得。デフォルトは24項目としている。
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 24;

    const skip = (page - 1) * pageSize; // ページに応じて、スキップするドキュメントの数を計算。

    const total = await Event.countDocuments({}); // DBのEventドキュメントの総数を取得。
    const events = await Event.find({}).skip(skip).limit(pageSize); // ページネーションを適用して、DBからイベントを取得。

    const result = {
      total, // Eventドキュメントの総数
      events, // 現在のページのイベントデータ一覧
    };

    return new Response(JSON.stringify(result), {
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
export const POST = async (request) => {
  try {
    await connectDB(); // データベースに接続

    const sessionUser = await getSessionUser(); // セッションユーザー情報を取得

    // 「セッションユーザーが存在しない場合」または「ユーザーIDが取得できない場合」は、エラーレスポンスを返す
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser; // ユーザーIDをセッションから取得

    const formData = await request.formData(); // リクエストからFormDataを取得

    // FormDataからconditionsの全ての値を取得
    const conditions = formData.getAll("conditions");

    // FormDataからimagesの全ての値を取得し、空でないファイル名のものだけをフィルター
    const images = formData
      .getAll("images")
      .filter((image) => image.name !== "");

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
      // images,
    };

    // 画像をCloudinaryにアップロードするためのプロミス配列
    const imageUploadPromises = [];

    // 画像ファイルごとにループ
    for (const image of images) {
      const imageBuffer = await image.arrayBuffer(); // 画像データをバッファとして読み込む
      const imageArray = Array.from(new Uint8Array(imageBuffer)); // バッファからUint8Arrayを生成し、配列に変換
      const imageData = Buffer.from(imageArray); // Node.jsのBufferに変換

      // 画像データをBase64形式に変換
      const imageBase64 = imageData.toString("base64");

      // Cloudinaryに画像をアップロードし、結果をプロミス配列に追加
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "ts_communimeeting",
        }
      );

      imageUploadPromises.push(result.secure_url);

      // すべての画像のアップロードが完了するのを待つ
      const uploadedImages = await Promise.all(imageUploadPromises);
      // アップロードされた画像のURLを、イベントデータに追加
      eventData.images = uploadedImages;
    }

    // console.log(eventData);

    // 新しいイベントを、データベースに保存
    const newEvent = new Event(eventData);
    await newEvent.save();

    // 成功時のレスポンス
    // イベントが正常に保存された後、そのイベントの詳細ページにリダイレクト
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/events/${newEvent._id}`
    );
  } catch (error) {
    // エラー時のレスポンス
    console.error("Error during POST /api/events:", error);
    return new Response("Failed to add event", { status: 500 });
  }
};
