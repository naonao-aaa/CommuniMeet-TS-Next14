"use client";
import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

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
}

const ConversationPage = () => {
  const { conversationId } = useParams(); // URLパラメータから、会話(メッセージコンテナ)IDを取得。
  const [messages, setMessages] = useState<Message[]>([]); // この会話(メッセージコンテナ)のメッセージ一覧を管理するためのstate。
  const [newMessage, setNewMessage] = useState(""); //新規メッセージ入力内容を管理するためのstate。
  const [event, setEvent] = useState<Event>(); //この会話(メッセージコンテナ)のイベント情報を管理するためのstate。

  useEffect(() => {
    // この会話(メッセージコンテナ)のメッセージ一覧を取得する関数を定義。
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${conversationId}`);
        if (!res.ok) throw new Error("Failed to fetch messages.");
        const data = await res.json();
        setMessages(data.messages); // 「messages」stateにセット。
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    fetchMessages(); //実際に、fetchMessages関数を実行。

    // 今回の会話(メッセージのコンテナ)IDから、イベント情報を取得するための関数を定義。
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}`);
        if (!res.ok) throw new Error("Failed to fetch event.");
        const data = await res.json();
        setEvent(data.eventId); // イベント情報をセット。
      } catch (error) {
        console.error("Failed to load event:", error);
      }
    };
    fetchEvent(); //実際に、fetchEvent関数を実行。
  }, [conversationId]);

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
  );
};

export default ConversationPage;
