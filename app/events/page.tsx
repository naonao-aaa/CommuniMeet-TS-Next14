import events from "@/events.json";
import EventCard from "@/components/EventCard";

const EventsPage: React.FC = () => {
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
