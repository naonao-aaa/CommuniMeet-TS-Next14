import { Event } from "@/types/event"; // Event 型定義のインポート

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null; // 環境変数からAPIのドメインを取得し、設定されていない場合はnullを返す。

// ページネーションを適用するためのレスポンス型を定義。
interface EventsResponseForPagination {
  total: number;
  events: Event[];
}

// Event一覧データを非同期に取得する関数を定義。
async function fetchEvents(): Promise<EventsResponseForPagination> {
  try {
    // APIドメインが未設定の場合は、空の配列を返してreturnして処理を終わる。
    if (!apiDomain) {
      return { total: 0, events: [] };
    }

    // APIからEvent一覧データを取得するためのfetchリクエストを実行。
    const res = await fetch(`${apiDomain}/events`, { cache: "no-store" });

    // レスポンスが正常でない場合はエラーを投げる。
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json(); // レスポンスのJSONを解析して返す。
  } catch (error) {
    console.log(error);
    return { total: 0, events: [] }; // エラーがあった場合は空の配列を返す
  }
}

// 単一のEventを取得するための関数
async function fetchEvent(id: string): Promise<Event | null> {
  try {
    // APIドメインが未設定の場合は、空の配列を返してreturnして処理を終わる。
    if (!apiDomain) {
      return null;
    }

    // 指定されたIDを持つイベントの詳細情報を取得するためのリクエストを実行。
    const res = await fetch(`${apiDomain}/events/${id}`);

    // レスポンスが正常でない場合はエラーを投げる。
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json(); // レスポンスのJSONを解析して返す。
  } catch (error) {
    console.log(error);
    return null;
  }
}

// 注目Event一覧データを非同期に取得する関数を定義。
async function fetchFeaturedEvents(): Promise<Event[]> {
  try {
    // APIドメインが未設定の場合は、空の配列を返してreturnして処理を終わる。
    if (!apiDomain) {
      return [];
    }

    // APIから、注目Event一覧データを取得するためのfetchリクエストを実行。
    const res = await fetch(`${apiDomain}/events/featured`, {
      cache: "no-store",
    });

    // レスポンスが正常でない場合はエラーを投げる。
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json(); // レスポンスのJSONを解析して返す。
  } catch (error) {
    console.log(error);
    return []; // エラーがあった場合は空の配列を返す
  }
}

// エクスポート
export { fetchEvents, fetchEvent, fetchFeaturedEvents };
