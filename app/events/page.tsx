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

const EventsPage: React.FC = async () => {
  const events = await fetchEvents(); // eventデータを取得

  // 取得したイベントを、作成日で降順にソート
  events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {events.length === 0 ? (
          <p>No events found</p>
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

export default EventsPage;
