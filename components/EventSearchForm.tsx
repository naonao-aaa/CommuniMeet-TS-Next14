"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const EventSearchForm = () => {
  // 検索フォームの状態管理用のstate
  const [keyword, setKeyword] = useState<string>("");
  const [eventType, setEventType] = useState<string>("All");

  const router = useRouter();

  // フォーム送信時の処理
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //フォームが持つデフォルトの動作を防ぐ。

    if (keyword === "" && eventType === "All") {
      router.push("/events"); // フィルターなしで全イベントを表示
    } else {
      const query = `?keyword=${keyword}&eventType=${eventType}`; // クエリパラメータを生成

      router.push(`/events/search-results${query}`); // クエリパラメータを使用して検索結果ページに遷移
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // 上で定義したhandleSubmit関数を、送信ハンドラーとして設定
      className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
    >
      {/* キーワード入力フィールド */}
      <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
        <label htmlFor="keyword" className="sr-only">
          Keyword
        </label>
        <input
          type="text"
          id="keyword"
          placeholder="キーワードや場所を入力してください"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-emerald-500"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      {/* イベントタイプ選択 */}
      <div className="w-full md:w-2/5 md:pl-2">
        <label htmlFor="event-type" className="sr-only">
          Event Type
        </label>
        <select
          id="event-type"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-emerald-500"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Outdoor">アウトドア</option>
          <option value="Lunch">ランチ</option>
          <option value="Maticon">街コン</option>
          <option value="Otakatu">オタ活</option>
          <option value="ThemePark">テーマパーク</option>
          <option value="Sport">スポーツ</option>
          <option value="Other">その他</option>
        </select>
      </div>
      {/* 検索ボタン */}
      <button
        type="submit"
        className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 focus:outline-none focus:ring focus:ring-emerald-500"
      >
        Search
      </button>
    </form>
  );
};
export default EventSearchForm;
