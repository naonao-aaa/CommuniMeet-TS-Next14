"use client";
import { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import Spinner from "@/components/Spinner";
import { Event } from "@/types/event"; // Event型をインポート

// イベント一覧を表示するための、クライアントサイドのEventsコンポーネントを定義。
const Events = () => {
  const [events, setEvents] = useState<Event[]>([]); // イベントのリストを管理するためのstateを定義。
  const [loading, setLoading] = useState(true); // データの読み込み状態を管理するためのstateを定義。

  useEffect(() => {
    // イベントデータをフェッチする非同期関数を定義。
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events"); // イベントデータ一覧を取得。

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json(); // レスポンスからJSONデータを抽出
        setEvents(data); // 取得したデータをstateにセット
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents(); // 実際に、定義したfetchEvents関数を実行する。
  }, []);

  return loading ? ( // ローディング中はSpinnerコンポーネントを表示。
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {events.length === 0 ? ( // イベントが0件の場合
          <p>No events found</p>
        ) : (
          // イベントが1件以上の場合
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
