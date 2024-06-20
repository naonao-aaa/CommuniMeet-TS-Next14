"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Contextの型定義：未読メッセージの数と、その数を設定する関数
interface UnreadMessagesContextType {
  unreadCount: number; // 未読メッセージの数
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>; // 関数型アップデートに対応するような型。現在の状態に基づいて次の状態を計算するために関数を引数として渡すことができます（これを関数型アップデートと呼びます）
}

// 未読メッセージ数のコンテキストを作成。初期値はundefined。
const UnreadMessagesContext = createContext<
  UnreadMessagesContextType | undefined
>(undefined);

// 未読メッセージの状態を提供するコンポーネント
export const UnreadMessagesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0); // 未読メッセージ数をstateで管理（グローバルに共有したいstateとset関数を用意。）

  // コンテキストプロバイダーを通じて未読メッセージの数と更新関数を子コンポーネントに渡す
  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

// 未読メッセージのコンテキストを使用するカスタムフック
export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext); // コンテキストから未読メッセージの数を取得
  if (context === undefined) {
    // コンテキストが未設定の場合はエラー
    throw new Error(
      "useUnreadMessages must be used within a UnreadMessagesProvider"
    );
  }
  return context; // 未読メッセージの状態を返す
};
