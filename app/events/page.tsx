import EventCard from "@/components/EventCard";
import EventSearchForm from "@/components/EventSearchForm";
import Events from "@/components/Events";

const EventsPage: React.FC = async () => {
  return (
    <>
      <section className="bg-emerald-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          {/* 検索フォーム */}
          <EventSearchForm />
        </div>
      </section>

      {/* イベント一覧 */}
      <Events />
    </>
  );
};

export default EventsPage;
