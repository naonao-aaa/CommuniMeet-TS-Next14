import Link from "next/link";
import Image from "next/image";
import { FaClock, FaMapMarker } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Event } from "../types/event";

// Propsの型を定義。
interface FeaturedEventCardProps {
  event: Event;
}

const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md relative flex flex-col md:flex-row">
      <Image
        src={event.images[0]}
        alt="イベント画像"
        width={0}
        height={0}
        sizes="100vw"
        className="object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl w-full md:w-2/5"
      />

      <div className="p-6 flex-1 text-center">
        <h3 className="text-xl font-bold text-center">{event.name}</h3>
        <div className="text-gray-600 mb-4 text-center">{event.type}</div>
        <h3 className="absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-cyan-500 font-bold text-right md:text-center lg:text-right">
          ¥{event.ticket_info.price}
        </h3>
        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p className="text-gray-500 mb-1 text-center">
            <FaClock className="inline mr-2" />
            <br />
            {format(new Date(event.date_time.start), "yyyy年M月d日H:mm", {
              locale: ja,
            })}
            <br />
            〜
            <br />
            {format(new Date(event.date_time.end), "yyyy年M月d日H:mm", {
              locale: ja,
            })}
          </p>
        </div>

        <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
          <p>
            <FaPerson className="inline mr-2" />
            {event.attendee_limits.min}〜{event.attendee_limits.max}
          </p>
        </div>

        <div className="border border-gray-200 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 lg:mb-0 flex-grow min-w-0 ">
            <div className="flex items-center gap-2 mb-4 lg:mb-0 flex-grow min-w-0">
              <span className="text-orange-700 flex-grow overflow-hidden">
                <FaMapMarker className="inline" style={{ marginTop: "-3px" }} />{" "}
                {event.location.city} {event.location.state}
              </span>
            </div>
          </div>
          <Link
            href={`/events/${event._id}`}
            className="h-[36px] bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-center text-sm"
            style={{ flexShrink: 0 }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEventCard;
