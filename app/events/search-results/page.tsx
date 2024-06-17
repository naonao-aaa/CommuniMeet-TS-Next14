"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Next.jsのURL検索パラメータフックをインポート
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import EventCard from "@/components/EventCard";
import Spinner from "@/components/Spinner";
import EventSearchForm from "@/components/EventSearchForm";
import { Event } from "@/types/event"; // Event型をインポート

const SearchResultsPage = () => {
  const searchParams = useSearchParams(); // 検索パラメータを取得

  const [events, setEvents] = useState<Event[]>([]); // 検索結果のイベントを格納するためのstate
  const [loading, setLoading] = useState(true); // ローディング状態管理のstate

  const keyword = searchParams.get("keyword"); // URLからkeywordパラメータを取得
  const eventType = searchParams.get("eventType"); // URLからeventTypeパラメータを取得

  useEffect(() => {
    // 検索結果を取得する非同期関数を定義。
    const fetchSearchResults = async () => {
      try {
        // APIから検索結果をフェッチ
        const res = await fetch(
          `/api/events/search?keyword=${keyword}&eventType=${eventType}`
        );

        if (res.status === 200) {
          // レスポンスが成功した場合
          const data = await res.json(); // JSONデータを解析
          setEvents(data); // stateにイベントデータを格納
        } else {
          setEvents([]); // 失敗した場合は、イベントリストを空にする
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // ローディング状態を解除
      }
    };

    fetchSearchResults(); //実際に、fetchSearchResults関数を実行する。
  }, [keyword, eventType]);

  return (
    <>
      <section className="bg-emerald-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          {/* イベント検索フォームを表示 */}
          <EventSearchForm />
        </div>
      </section>

      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <section className="px-4 py-6">
          <div className="container-xl lg:container m-auto px-4 py-6">
            <Link
              href="/events"
              className="flex items-center text-emerald-500 hover:underline mb-3"
            >
              <FaArrowAltCircleLeft className="mr-2 mb-1" /> Event一覧に戻る
            </Link>
            <h1 className="text-2xl mb-4">検索結果</h1>
            {events.length === 0 ? (
              <p>No search results found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};
export default SearchResultsPage;
