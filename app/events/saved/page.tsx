"use client";
import { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { Event } from "@/types/event"; // Event型をインポート

// 保存されたイベント一覧のページ用の関数コンポーネント
const SavedEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]); // イベント情報を保存するためのstate
  const [loading, setLoading] = useState(true); // ローディング状態を管理するためのstate

  // コンポーネントがマウントされた時に実行されるように。
  useEffect(() => {
    // 保存されたイベントを取得する非同期関数
    const fetchSavedEvents = async () => {
      try {
        const res = await fetch("/api/bookmarks"); // APIエンドポイントから、イベントデータを取得

        if (res.status === 200) {
          // レスポンスが200（成功）の場合
          const data = await res.json(); // レスポンスのJSONを解析
          setEvents(data);
        } else {
          // レスポンスが失敗した場合
          console.log(res.statusText);
          toast.error("Failed to fetch saved events");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch saved events");
      } finally {
        setLoading(false); // ローディング状態を解除
      }
    };

    fetchSavedEvents(); // 実際に、関数を実行してイベントデータを取得
  }, []);

  return loading ? ( // ローディング中の場合
    <Spinner loading={loading} />
  ) : (
    // ローディングが終了したら、内容を表示
    <section className="px-4 py-6">
      <h1 className="text-2xl mb-4">ブックマークされたイベント</h1>
      <div className="container-xl lg:container m-auto px-4 py-6">
        {events.length === 0 ? (
          <p>ブックマークされたイベントはございません。</p>
        ) : (
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
export default SavedEventsPage;
