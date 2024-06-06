import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="bg-emerald-700 py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Find Event！
          </h1>
          <p className="my-4 text-xl text-white">
            条件検索でイベントを探してみましょう!
          </p>
        </div>
        {/* 検索フォーム */}
        <form className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center">
          {/* ロケーション入力フィールド */}
          <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
            <label htmlFor="location" className="sr-only">
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="場所や地域を入力してください（市区町村、郵便番号など）"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-emerald-500"
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
      </div>
    </section>
  );
};

export default Hero;
