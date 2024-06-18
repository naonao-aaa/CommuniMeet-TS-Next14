"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Next-authのセッション管理フック
import { toast } from "react-toastify";
import { FaMessage } from "react-icons/fa6";
import { Event } from "../types/event";
import { CustomSession } from "@/types/customSession"; // カスタムセッション型をインポート
import { useRouter } from "next/navigation";

// Propsの型を定義。
interface ButtonForTransitionToMessageProps {
  event: Event;
}

//個別メッセージ画面に遷移させるためのボタンのコンポーネントを定義
const ButtonForTransitionToMessage: React.FC<
  ButtonForTransitionToMessageProps
> = ({ event }) => {
  const { data: session } = useSession() as { data: CustomSession | null }; // セッション情報を取得
  const userId = session?.user?.id; // セッションからユーザーIDを取得

  const router = useRouter(); // Next.jsのルーターインスタンスを取得。

  // console.log(event);

  // ボタンクリック時に走る関数
  const handleClick = async () => {
    // ユーザーがログインしていない場合はエラーメッセージを表示
    if (!userId) {
      toast.error(
        "イベントオーナーにメッセージするためには、サインインする必要があります。"
      );
      return;
    }

    // 送信するデータを確認
    // console.log("Sending data:", { eventId: event._id, ownerId: event.owner });

    try {
      // Conversations新規作成用のAPIエンドポイントに、POSTリクエストを送信。（Conversationsが既に作成されていたら、新たに会話(メッセージのコンテナ)を作成せずに、既存の会話(メッセージのコンテナ)情報が返される。）
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id, // 該当イベントIDを、リクエストボディに含める
          ownerId: event.owner, // 該当イベントオーナーIDを、リクエストボディに含める
        }),
      });

      const data = await res.json(); // レスポンスをJSON形式で解析する

      if (res.status === 200) {
        // 成功したら、個別メッセージページに遷移
        router.push(`/messages/${data.conversationId}`);
      } else {
        // ステータスコード200以外の時は、サーバーからのエラーメッセージを表示
        toast.error(data.error || "未知のエラーが発生しました。");
      }
    } catch (error) {
      // エラーハンドリング
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaMessage className="mr-2" /> イベントオーナーへのお問合せ
    </button>
  );
};
export default ButtonForTransitionToMessage;
