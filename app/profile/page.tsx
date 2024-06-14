"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react"; // NextAuth.jsのセッションフックをインポート
import { CustomSession } from "@/types/customSession"; // カスタムセッション型をインポート
import profileDefault from "@/assets/images/profile.png"; // デフォルトのプロファイル画像のパスをインポート
import Spinner from "@/components/Spinner";
import { FaClock } from "react-icons/fa";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Event } from "@/types/event"; // Event型をインポート

const ProfilePage = () => {
  const { data: session } = useSession() as { data: CustomSession | null }; // ログインセッションからデータを取得。
  const profileImage = session?.user?.image; // セッションデータからユーザーの画像URLを取得。
  const profileName = session?.user?.name; // セッションデータからユーザー名を取得。
  const profileEmail = session?.user?.email; // セッションデータからユーザーのメールアドレスを取得。

  const [events, setEvents] = useState<Event[]>([]); // ユーザーのイベントリストを管理するstate。
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を管理するstate。

  // console.log(session);

  // コンポーネントマウント時に実行されるように。
  useEffect(() => {
    // ユーザーIDに基づいてイベントを取得する関数。
    const fetchUserEvents = async (userId: string) => {
      if (!userId) {
        // ユーザーIDが無効な場合は何もしない。
        return;
      }

      try {
        const res = await fetch(`/api/events/user/${userId}`); // ユーザーIDに基づいてイベントデータを取得するAPIを呼び出す。

        if (res.status === 200) {
          // レスポンスが成功した場合。
          const data = await res.json(); // レスポンスのJSONを解析。
          setEvents(data); //イベントstateに設定。
        }
      } catch (error) {
        // APIリクエスト中にエラーが発生した場合。
        console.log(error);
      } finally {
        // 最終的に必ず実行されるブロック。
        setLoading(false);
      }
    };

    // セッションが有効な場合に、定義したfetchUserEvents関数を実行してユーザーのイベントを取得する。
    if (session?.user?.id) {
      fetchUserEvents(session.user.id);
    }
  }, [session]);

  const handleDeleteEvent = (eventId: string) => {
    console.log(`Deleting event: ${eventId}`);
  };

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">プロフィール</h1>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mx-20 mt-10">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={profileImage || profileDefault} // プロファイル画像またはデフォルト画像を表示。
                  width={200}
                  height={200}
                  alt="User"
                />
              </div>
              <h2 className="text-2xl mb-4">
                <span className="font-bold block">Name: </span> {profileName}
              </h2>
              <h2 className="text-2xl">
                <span className="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>

            <div className="md:w-3/4 md:pl-4">
              <h2 className="text-xl font-semibold mb-4">登録したイベント</h2>
              {!loading && events.length === 0 && (
                <p>登録したイベントはございません。</p>
              )}
              {loading ? (
                <Spinner loading={loading} />
              ) : (
                events.map((event) => (
                  <div key={event._id} className="mb-10">
                    <Link href={`/events/${event._id}`}>
                      <Image
                        className="h-32 w-full rounded-md object-cover"
                        src={event.images[0]}
                        alt=""
                        width={500}
                        height={100}
                        priority={true}
                      />
                    </Link>
                    <div className="mt-2">
                      <p className="text-lg font-semibold">{event.name}</p>
                      <FaClock className="inline mr-2" />
                      {format(
                        new Date(event.date_time.start),
                        "yyyy年M月d日H:mm",
                        {
                          locale: ja,
                        }
                      )}
                      〜
                      {format(
                        new Date(event.date_time.end),
                        "yyyy年M月d日H:mm",
                        {
                          locale: ja,
                        }
                      )}
                    </div>
                    <div className="mt-2">
                      <Link
                        href={`/events/${event._id}/edit`}
                        className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProfilePage;
