import { fetchFeaturedEvents } from "@/utils/requests"; //注目イベントを取得する関数をインポート
import FeaturedEventCard from "./FeaturedEventCard";

const FeaturedEvents: React.FC = async () => {
  // 注目イベント(is_featuredがtrueのイベント)を取得する。
  const events = await fetchFeaturedEvents();

  return (
    <>
      {events.length === 0 ? null : (
        <section className="bg-cyan-50 px-4 pt-6 pb-10">
          <div className="container-xl lg:container m-auto">
            <h2 className="text-3xl font-bold text-cyan-500 mb-6 text-center">
              注目のイベント
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <FeaturedEventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FeaturedEvents;
