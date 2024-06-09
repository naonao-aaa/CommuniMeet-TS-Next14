"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Next.js の useRouter の新しい形式で、URLパラメータを取得するためのもの。
import Link from "next/link";
import { fetchEvent } from "@/utils/requests";
import { Event } from "@/types/event";
import EventHeaderImage from "@/components/EventHeaderImage";
import EventDetails from "@/components/EventDetails";
import Spinner from "@/components/Spinner";
import { FaArrowLeft } from "react-icons/fa";

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

  // イベントが見つからなかった場合の処理
  if (!event && !loading) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">Event Not Found</h1>
    );
  }

  return (
    <>
      {loading && <Spinner loading={loading} />}

      {!loading &&
        event && ( // ローディングが完了し、プロパティデータがある場合のみ内容を表示
          <>
            <EventHeaderImage image={event.images[0]} />
            <section>
              <div className="container m-auto py-6 px-6">
                <Link
                  href="/events"
                  className="text-emerald-500 hover:text-emerald-600 flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Event一覧に戻る
                </Link>
              </div>
            </section>

            <section className="bg-emerald-50">
              <div className="container m-auto py-10 px-6">
                <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
                  <EventDetails event={event} />
                  <aside className="space-y-4">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
                      <i className="fas fa-bookmark mr-2"></i> Bookmark Event
                    </button>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
                      <i className="fas fa-share mr-2"></i> Share Event
                    </button>

                    {/* お問い合わせフォーム */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold mb-6">
                        Contact Event Manager
                      </h3>
                      <form>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="name"
                          >
                            Name:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                          >
                            Email:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="phone"
                          >
                            Phone:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="phone"
                            type="text"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="message"
                          >
                            Message:
                          </label>
                          <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
                            id="message"
                            placeholder="Enter your message"
                          ></textarea>
                        </div>
                        <div>
                          <button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
                            type="submit"
                          >
                            <i className="fas fa-paper-plane mr-2"></i> Send
                            Message
                          </button>
                        </div>
                      </form>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </>
        )}
    </>
  );
};

export default EventPage;
