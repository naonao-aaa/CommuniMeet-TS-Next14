import EventCard from "@/components/EventCard";
import EventSearchForm from "@/components/EventSearchForm";
import { fetchEvents } from "@/utils/requests";

const EventsPage: React.FC = async () => {
  const events = await fetchEvents(); // eventデータを取得

  // 取得したイベントを、作成日で降順にソート
  events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <section className="bg-emerald-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          {/* 検索フォーム */}
          <EventSearchForm />
        </div>
      </section>

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
    </>
  );
};

export default EventsPage;
