"use client";
import { useState, FormEvent } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Event } from "../types/event";

// Propsの型を定義。
interface EventContactFormProps {
  event: Event;
}

//イベント責任者に連絡を取るためのフォームを提供するコンポーネント
const EventContactForm: React.FC<EventContactFormProps> = ({ event }) => {
  const [name, setName] = useState(""); // 送信者の名前を管理するためのstate
  const [email, setEmail] = useState(""); // 送信者のemailを管理するためのstate
  const [message, setMessage] = useState(""); // メッセージ本文を管理するためのstate
  const [phone, setPhone] = useState(""); // 送信者の電話番号を管理するためのstate
  const [wasSubmitted, setWasSubmitted] = useState(false); // フォームが送信されたかどうかを管理するstate

  // フォーム送信時のイベントハンドラー
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 送信するデータのオブジェクトを構築
    const data = {
      name,
      email,
      phone,
      message,
      recipient: event.owner,
      event: event._id,
    };

    console.log(data);

    setWasSubmitted(true); // 送信フラグをtrueに設定
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6">イベントオーナーへのお問合せ</h3>
      {wasSubmitted ? (
        <p className="text-green-500 mb-4">
          メッセージは、正常に送信されました！
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              名前:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              電話番号:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
              type="submit"
            >
              <FaPaperPlane className="mr-2" /> 送信
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default EventContactForm;
