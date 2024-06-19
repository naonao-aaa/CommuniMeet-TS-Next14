"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner"; // ローディングスピナーのコンポーネントをインポート

// 会話に関するデータ構造を定義するinterface
interface Conversation {
  _id: string;
  eventId: { name: string };
  ownerId: { username: string };
  userId: { username: string };
  lastMessageId?: {
    body: string;
    createdAt: Date;
    senderId: {
      username: string;
    };
  };
}

// 会話(メッセージのコンテナ)のリストを表示するためのページコンポーネント「お問合せ一覧ページ」
const ConversationsPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]); // 会話(メッセージのコンテナ)のリストを管理するためのstate。
  const [loading, setLoading] = useState(true); // ローディング状態を追跡するためのstate

  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations"); // APIから、会話(メッセージのコンテナ)のリストを取得
        if (!res.ok) throw new Error("Failed to fetch conversations"); // レスポンスが正常でない場合にエラーを投げる
        const data = await res.json(); // レスポンスのJSONを解析
        setConversations(data); //「conversations」stateに、会話(メッセージのコンテナ)のリストをセット。
      } catch (error) {
        // エラーが発生した場合
        console.error("Failed to fetch conversations:", error);
      } finally {
        // 最後に必ず実行。
        setLoading(false); // ローディング状態をfalseにする。
      }
    };

    fetchConversations(); // fetchConversations関数を実行
  }, []);

  // 特定の会話IDに対応するメッセージページへの遷移を処理する関数
  const transitionToIndividualConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`); // 該当する会話IDの会話(メッセージコンテナ)ページに遷移する
  };

  return (
    <>
      {/* ローディング中はスピナーを表示 */}
      {loading && <Spinner loading={loading} />}

      {/* ローディングが終了したら、内容を表示 */}
      {!loading && (
        <div className="p-4 bg-sky-100 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">お問合せ一覧</h1>
          {conversations.length > 0 ? (
            // 会話(メッセージのコンテナ)がある場合の表示
            <ul className="space-y-4">
              {conversations.map((conv) => (
                <li
                  key={conv._id}
                  className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => transitionToIndividualConversation(conv._id)}
                >
                  <p className="text-lg font-semibold">
                    イベント名: {conv.eventId.name}
                  </p>
                  <p className="text-gray-600">
                    オーナー: {conv.ownerId.username}
                  </p>
                  <p className="text-gray-600">
                    ユーザー: {conv.userId.username}
                  </p>
                  {conv.lastMessageId && (
                    <div className="mt-2 text-gray-800">
                      <p>Last Message: {conv.lastMessageId.body}</p>
                      <p>
                        from {conv.lastMessageId.senderId.username} <br />(
                        {new Date(
                          conv.lastMessageId.createdAt
                        ).toLocaleString()}
                        )
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            // 会話(メッセージのコンテナ)がない場合の表示
            <div className="text-center text-gray-600 text-lg">
              お問合せはございません。
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ConversationsPage;
