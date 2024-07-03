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

// PUT /api/events/:id
//イベント更新処理
export const PUT = async (request: Request, { params }: { params: Params }) => {
  try {
    await connectDB(); // データベースに接続

    const sessionUser = await getSessionUser(); // セッションユーザー情報を取得

    // 「セッションユーザーが存在しない場合」または「ユーザーIDが取得できない場合」は、エラーレスポンスを返す
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params; // リクエストから、イベントIDを取得。
    const { userId } = sessionUser; // ユーザーIDをセッションから取得

    const formData = await request.formData(); // リクエストからFormDataを取得

    // FormDataからconditionsの全ての値を取得
    const conditions = formData.getAll("conditions");

    // 更新するためのイベントを、IDで検索。
    const existingEvent = await Event.findById(id);

    // イベントが見つからない場合。
    if (!existingEvent) {
      return new Response("Event does not exist", { status: 404 });
    }

    // イベントの所有者が、ログイン中のユーザーと異なる場合。
    if (existingEvent.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

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
    };

    // イベントを更新。
    const updatedEvent = await Event.findByIdAndUpdate(id, eventData);

    // 成功時のレスポンス
    return new Response(JSON.stringify(updatedEvent), {
      status: 200,
    });
  } catch (error) {
    // エラー時のレスポンス
    return new Response("Failed to add event", { status: 500 });
  }
};
