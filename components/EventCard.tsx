import Image from "next/image";
import Link from "next/link";
import { FaClock, FaMapMarker } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import { Event } from "../types/event";

// Propsの型を定義。
interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="rounded-xl shadow-md relative">
      <Image
        src={`/images/events/${event.images[0]}`}
        alt="イベントの説明"
        height={0}
        width={0}
        sizes="100vw"
        className="w-full h-auto rounded-t-xl"
      />
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-2">
          <div className="text-gray-600">{event.type}</div>
          <h3 className="text-xl font-bold">{event.name}</h3>
        </div>
        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          ¥{event.ticket_info.price}
        </h3>

        <div className="flex justify-center gap-4 text-gray-500">
          <p className="text-gray-500 mb-4 text-center">
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

        <div className="flex justify-center gap-4 text-gray-500 mb-2">
          <p>
            <FaPerson className="inline mr-2" />
            {event.attendee_limits.min}〜{event.attendee_limits.max}
          </p>
        </div>

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-2">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaMapMarker className="text-orange-700 mt-1" />
            <span className="text-orange-700">
              {" "}
              {event.location.city} {event.location.state}{" "}
            </span>
          </div>
          <Link
            href={`/events/${event._id}`}
            className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
export default EventCard;
