"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Next.js の useRouter の新しい形式で、URLパラメータを取得するためのもの。
import { fetchEvent } from "@/utils/requests";
import { Event } from "@/types/event";

const EventPage: React.FC = () => {
  // URLからイベントIDを取得
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // idが配列の場合、最初の要素を取得する

  // イベント情報とローディング状態を管理するstate
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // コンポーネントのマウント時と、id,eventが変更された時に実行されるuseffect
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return; // IDがない場合は処理を中断
      try {
        const event = await fetchEvent(id); // APIからイベントデータを取得
        setEvent(event); // 取得したイベントデータをstateにセット
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false); // ローディング状態の更新
      }
    };

    // イベントデータが未取得の場合、定義したfetchEventData関数を呼び出す
    if (event === null) {
      fetchEventData();
    }
  }, [id, event]);

  return <div>EventPage</div>;
};

export default EventPage;
