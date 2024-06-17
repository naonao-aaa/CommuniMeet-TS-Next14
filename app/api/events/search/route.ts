import connectDB from "@/config/database";
import Event from "@/models/Event";

// queryの型を拡張
interface QueryType {
  $or?: Array<{ [key: string]: RegExp }>;
  type?: RegExp;
}

//クエリパラメータに基づいてイベントを検索するためのエンドポイント
// GET /api/events/search
export const GET = async (request: Request) => {
  try {
    await connectDB(); // データベースへの接続を確立

    // リクエストURLから、検索パラメータを抽出
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");
    const eventType = searchParams.get("eventType");

    // MongoDBに送信されるクエリの条件を格納する変数。空のオブジェクトで初期化している。
    let query: QueryType = {};
    // 検索キーワードに基づいて、動的に条件を格納するための配列。
    const conditions = [];

    // keywordパラメータが存在する場合
    if (keyword) {
      const keywordPattern = new RegExp(keyword, "i"); //keyword文字列を基に、正規表現パターンを作成（大文字小文字を区別しない）
      // keywordPatternに一致するかを調べる各フィールド（イベント名、説明、会場名など）に対して、検索条件を追加。
      // このconditions配列は、後ほど$orクエリに組み込まれ、入力されたキーワードがこれらのどのフィールドかに一致するイベントを検索するために用いる。
      conditions.push(
        { name: keywordPattern },
        { description: keywordPattern },
        { "location.venue": keywordPattern },
        { "location.street": keywordPattern },
        { "location.city": keywordPattern },
        { "location.state": keywordPattern },
        { "location.zipcode": keywordPattern }
      );
    }

    // conditions配列に何らかの条件が追加されていれば、queryオブジェクトに$orプロパティを設定し、その値としてconditions配列を割り当てる。
    if (conditions.length > 0) {
      query.$or = conditions;
    }

    // eventTypeが'All'でなければ、そのタイプでさらにフィルタリング。
    if (eventType && eventType !== "All") {
      const typePattern = new RegExp(eventType, "i"); //eventType文字列を基に、正規表現パターンを作成（大文字小文字を区別しない）
      query.type = typePattern; // クエリに、イベントタイプ条件を追加
    }

    // 構築したクエリに基づき、イベントデータを検索
    const events = await Event.find(query);

    // 検索結果をJSON形式で返却
    return new Response(JSON.stringify(events), {
      status: 200,
    });
  } catch (error) {
    // エラーが発生した場合
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
