import { FaClock, FaMoneyBill, FaCheck, FaMapMarker } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { format } from "date-fns";
// import { ja } from "date-fns/locale";
import { Event } from "@/types/event"; // Event 型定義のインポート

// EventDetailsProps 型定義
interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <main>
      <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
        <div className="text-gray-500 mb-4">{event.type}</div>
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
          <FaMapMarker className="text-lg text-orange-700 mr-2" />
          <p className="text-orange-700">
            {event.location.street}, {event.location.city}{" "}
            {event.location.state}
          </p>
        </div>

        {/* 日時セクション */}
        <div className="mb-6 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-bold mb-2 bg-gray-800 text-white text-center">
            日時
          </h4>
          <p className="flex items-center justify-center">
            <FaClock className="mr-2" />
            {format(new Date(event.date_time.start), "yyyy/MM/dd HH:mm")}
            {" 〜 "}
            {format(new Date(event.date_time.end), "yyyy/MM/dd HH:mm")}
          </p>
        </div>

        {/* 料金と募集人数のセクション */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 料金 */}
          <div className="p-4 shadow-md rounded-lg">
            <h4 className="text-lg font-bold mb-2 bg-gray-800 text-white text-center">
              料金
            </h4>
            <p className="flex items-center justify-center">
              <FaMoneyBill className="mr-2" />
              {event.ticket_info.price}円
            </p>
          </div>
          {/* 募集人数 */}
          <div className="p-4 shadow-md rounded-lg">
            <h4 className="text-lg font-bold mb-2 bg-gray-800 text-white text-center">
              募集人数
            </h4>
            <p className="flex items-center justify-center">
              <FaPerson className="mr-2" />
              {event.attendee_limits.min}〜{event.attendee_limits.max}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">概要説明</h3>
        <div className="flex justify-center gap-4 text-emerald-500 mb-4 text-xl space-x-9"></div>
        <p className="text-gray-500 mb-4 text-center">{event.description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">募集要項</h3>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
          {event.conditions.map((condition, index) => (
            <li key={index}>
              <FaCheck className="inline-block text-green-600 mr-2" />{" "}
              {condition}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};
export default EventDetails;
