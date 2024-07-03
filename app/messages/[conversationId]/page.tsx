"use client";
import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner"; // ローディングスピナーのコンポーネントをインポート
import { useSession } from "next-auth/react"; // NextAuth.jsの機能をインポート
import { CustomSession } from "@/types/customSession"; // カスタムセッション型をインポート
import { useUnreadMessages } from "@/context/UnreadMessagesContext"; // グローバルコンテキストからのフックをインポート

// イベント情報の型定義
interface Event {
  _id: string;
  name: string;
}

// ユーザー情報の型定義
interface User {
  _id: string;
  username: string; //ユーザー名
}

// メッセージ情報の型定義
interface Message {
  _id: string;
  senderId: User;
  recipientId: string;
  body: string;
  createdAt: Date;
  read: boolean; // メッセージが既読かどうかを表すプロパティ
}

const ConversationPage = () => {
  const { conversationId } = useParams(); // URLパラメータから、会話(メッセージコンテナ)IDを取得。
  const [messages, setMessages] = useState<Message[]>([]); // この会話(メッセージコンテナ)のメッセージ一覧を管理するためのstate。
  const [newMessage, setNewMessage] = useState(""); //新規メッセージ入力内容を管理するためのstate。
  const [event, setEvent] = useState<Event>(); //この会話(メッセージコンテナ)のイベント情報を管理するためのstate。
  const [loading, setLoading] = useState(true); // ローディング状態を追跡するためのstate

  const { data: session } = useSession() as { data: CustomSession | null }; // ログインセッションからデータを取得。
  const currentUserId = session?.user?.id; // 現在のログインユーザーのIDを取得。

  const { setUnreadCount } = useUnreadMessages(); // コンテキストから、グローバルstateのunreadCount(未読メッセージ数)を更新する関数を取得

  useEffect(() => {
    // この会話(メッセージコンテナ)のメッセージ一覧を取得する関数を定義。
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages.");
      const data = await res.json();
      setMessages(data.messages);

      // 未読メッセージのIDを抽出
      const unreadMessageIds = data.messages
        .filter(
          (msg: Message) =>
            !msg.read && String(msg.recipientId) === String(currentUserId)
        ) // 「msg.readがfalse（つまり未読）」かつ「ログインユーザーが受信者になっている」メッセージのみを抽出。
        .map((msg: Message) => msg._id); // フィルタリングしたメッセージの「_id」のみを抽出して、新しい配列を作成。

      // 未読メッセージがあれば、既読に更新するAPIを呼び出す
      if (unreadMessageIds.length > 0) {
        await Promise.all(
          unreadMessageIds.map((messageId: string) =>
            fetch(`/api/messages/read/${messageId}`, {
              method: "PUT",
            })
          )
        );
      }
      return data;
    };

    // 今回の会話(メッセージのコンテナ)IDから、イベント情報を取得するための関数を定義。
    const fetchEvent = async () => {
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch event.");
      const data = await res.json();
      setEvent(data.eventId);
      return data;
    };

    if (!session) return; // セッションがなければ何もせずにreturnする。

    // 全会話合計での未読メッセージ数を取得する非同期関数を定義。
    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch("/api/messages/unread-count");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount); // グローバルstateの「unreadCount」に、全会話合計での未読メッセージ数をセット。
        }
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };

    // 同時に実行し、両方のデータを取得
    Promise.all([fetchMessages(), fetchEvent()])
      .then(() => {
        fetchUnreadMessages(); // fetchUnreadMessages関数を実行。
      })
      .catch((error) => {
        console.error("Failed to load data:", error);
      })
      .finally(() => {
        // 最後に必ず実行。
        setLoading(false); // 全てのデータロードが完了した後にローディング状態を解除
      });
  }, [conversationId, setUnreadCount]);

  // 新規メッセージを送信する関数を定義。
  const sendMessage = async () => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newMessage }),
      });
      if (!res.ok) throw new Error("Failed to send message.");
      const newMsg = await res.json();
      setMessages([...messages, newMsg]); // 新規登録されたメッセージを、「messages」stateに追加。
      setNewMessage(""); // 入力フィールドをクリア
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // メッセージ送信フォームのsubmitハンドラ
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* ローディング中はスピナーを表示 */}
      {loading && <Spinner loading={loading} />}

      {/* ローディングが終了したら、内容を表示 */}
      {!loading && (
        <div className="p-4">
          <h1 className="text-lg font-bold mb-4">
            Conversation ID: {conversationId}
          </h1>
          <h1 className="text-lg font-bold mb-4">イベント名: {event?.name}</h1>
          <ul className="space-y-2 mb-4">
            {messages.map((msg) => (
              <li key={msg._id} className="bg-gray-100 p-2 rounded shadow">
                <strong>{msg.senderId.username}</strong>: <br />
                {msg.body} <br />({new Date(msg.createdAt).toLocaleString()})
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Send Message
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ConversationPage;
