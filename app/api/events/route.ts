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

// POST /api/events
// POSTリクエストを処理してイベント情報をデータベースに追加
export const POST = async (request: Request) => {
  try {
    const formData = await request.formData(); // リクエストからFormDataを取得

    // FormDataからconditionsの全ての値を取得
    const conditions = formData.getAll("conditions");

    // FormDataからimagesの全ての値を取得し、空でないファイル名のものだけをフィルター
    //（以下の部分があるとエラーになってしまうので、一先ずコメントアウトしておく。画像アップロード処理の時に再度試行する予定。）
    // const images = formData
    //   .getAll("images")
    //   .filter((image) => image.name !== "");

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
      // images,
    };

    console.log(eventData);

    // 成功時のレスポンス
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (error) {
    // エラー時のレスポンス
    console.error("Error during POST /api/events:", error);
    return new Response("Failed to add event", { status: 500 });
  }
};
