"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Next-authのセッション管理フック
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa"; // react-iconsライブラリからFaBookmarkアイコンをインポート
import { Event } from "../types/event";
import { CustomSession } from "@/types/customSession"; // カスタムセッション型をインポート

// Propsの型を定義。
interface BookmarkButtonProps {
  event: Event;
}

//ブックマーク（お気に入り登録）できるボタンを提供するコンポーネントを定義
const BookmarkButton: React.FC<BookmarkButtonProps> = ({ event }) => {
  const { data: session } = useSession() as { data: CustomSession | null }; // セッション情報を取得
  const userId = session?.user?.id; // セッションからユーザーIDを取得

  const [isBookmarked, setIsBookmarked] = useState(false); // ブックマークされているかの状態を管理
  const [loading, setLoading] = useState(true); // ローディング状態を管理するstate

  useEffect(() => {
    // ユーザーIDがなければ
    if (!userId) {
      setLoading(false); // ローディングを終了
      return; // 処理を中断
    }

    // ブックマーク状態を確認する関数を定義。
    const checkBookmarkStatus = async () => {
      try {
        // ブックマーク確認APIにリクエスト
        const res = await fetch("/api/bookmarks/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: event._id, // イベントIDを、JSON形式で送信
          }),
        });

        // レスポンスが200(成功)の場合
        if (res.status === 200) {
          const data = await res.json(); // レスポンスデータをJSONとしてパース
          setIsBookmarked(data.isBookmarked); // ブックマーク状態を更新
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus(); // 実際に、ブックマーク状態確認関数を実行
  }, [event._id, userId]);

  // Bookmarkボタンクリック時に走る関数
  const handleClick = async () => {
    // ユーザーがログインしていない場合はエラーメッセージを表示
    if (!userId) {
      toast.error(
        "イベントをブックマークするためには、サインインする必要があります。"
      );
      return;
    }

    try {
      // Bookmark用のAPIエンドポイントに、POSTリクエストを送信
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id, // ブックマークしたいイベントIDを、リクエストボディに含める
        }),
      });

      //成功
      if (res.status === 200) {
        const data = await res.json(); // レスポンスからJSONデータを取得
        toast.success(data.message); // 成功メッセージを表示
        setIsBookmarked(data.isBookmarked); // ブックマーク状態を更新
      }
    } catch (error) {
      // エラーハンドリング
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return isBookmarked ? (
    // ブックマーク済みの場合のボタン
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" /> ブックマーク解除
    </button>
  ) : (
    // 未ブックマークの場合のボタン
    <button
      onClick={handleClick}
      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" /> ブックマーク
    </button>
  );
};
export default BookmarkButton;
