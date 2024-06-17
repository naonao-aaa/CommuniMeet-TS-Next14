import connectDB from "@/config/database";
import Event from "@/models/Event";

// queryの型を拡張
interface QueryType {
  $or: Array<{ [key: string]: RegExp }>;
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

    //keyword文字列を基に、正規表現パターンを作成（大文字小文字を区別しない）
    const keywordPattern = keyword ? new RegExp(keyword, "i") : null;

    // データベース内の複数フィールドにマッチするクエリを構築
    // ユーザーが入力したキーワードに基づいて、様々なフィールド内で一致するデータを見つけるクエリを構築
    // keywordPattern が null でない場合、イベントの name, description, location.venue, location.street, location.city, location.state, location.zipcode の各フィールドに対して指定されたパターン（正規表現）が含まれているかどうかを検証する。
    // $or 配列にこれらの条件を追加することで、これらのどれか一つでも条件を満たすドキュメントが検索結果として返されるようになる。
    let query: QueryType = {
      $or: [
        ...(keywordPattern
          ? [
              { name: keywordPattern },
              { description: keywordPattern },
              { "location.venue": keywordPattern },
              { "location.street": keywordPattern },
              { "location.city": keywordPattern },
              { "location.state": keywordPattern },
              { "location.zipcode": keywordPattern },
            ]
          : []),
      ],
    };

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
