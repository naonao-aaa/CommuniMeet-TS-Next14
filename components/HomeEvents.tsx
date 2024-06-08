import Link from "next/link";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/event"; // Event 型定義のインポート

// eventデータをAPIから非同期に取得する関数
async function fetchEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/events`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return []; // エラーが発生した場合は空の配列を返す
  }
}

const HomeEvents: React.FC = async () => {
  const events = await fetchEvents(); // eventデータを取得

  // イベントをランダムに3つ選択(訪問するたびに異なるイベントが表示されるように。)
  const recentEvents: Event[] = events
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);

  return (
    <>
      {/* 最近のイベントを表示するセクション */}
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-emerald-500 mb-6 text-center">
            Recent Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEvents.length === 0 ? (
              <p>No Events Found</p>
            ) : (
              recentEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 「全てのイベントを見る」リンクのセクション */}
      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/events"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Events
        </Link>
      </section>
    </>
  );
};
export default HomeEvents;
