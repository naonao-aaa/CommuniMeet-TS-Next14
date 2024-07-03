"use client";
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { useUnreadMessages } from "@/context/UnreadMessagesContext"; // グローバルコンテキストからのフックをインポート

interface UnreadMessageCountProps {
  session: Session | null;
}

// ログインユーザーの未読メッセージ数を表示するコンポーネント
const UnreadMessageCount: React.FC<UnreadMessageCountProps> = ({ session }) => {
  // const [unreadCount, setUnreadCount] = useState(0); // 未読メッセージ数を管理するstateを定義。初期値は0。
  const { unreadCount, setUnreadCount } = useUnreadMessages(); // コンテキストから、グローバルstateのunreadCount(未読メッセージ数)を更新する関数を取得

  useEffect(() => {
    if (!session) return; // セッションがなければ何もせずにreturnする。

    // 全会話合計での未読メッセージ数を取得する非同期関数を定義。
    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch("/api/messages/unread-count");

        if (res.status === 200) {
          const data = await res.json();
          setUnreadCount(data.unreadCount); // グローバルstateの「unreadCount」に、全会話合計での未読メッセージ数をセット。
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUnreadMessages(); //実際に、定義したfetchUnreadMessages関数を実行。
  }, [session]);

  return (
    unreadCount > 0 && ( //未読メッセージが0の時には、通知アイコンに数字が出力されないようにする。
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {/* 未読メッセージの数を表示 */}
        {unreadCount}
      </span>
    )
  );
};
export default UnreadMessageCount;
