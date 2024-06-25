import React from "react";

import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";
import "react-toastify/dist/ReactToastify.css";
import "photoswipe/dist/photoswipe.css"; // PhotoSwipeライブラリのスタイリングをアプリケーションに適用。

export const metadata = {
  title: "CommuniMeeting",
  description: "楽しいイベントを見つけて参加しましょう！",
  keywords: "イベント, 地元, 友達",
};

// Propsの型を定義。
interface MainLayoutProps {
  children: React.ReactNode; // childrenの型をReact.ReactNodeと明示
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <UnreadMessagesProvider>
      <AuthProvider>
        <html lang="ja">
          <body>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </UnreadMessagesProvider>
  );
};

export default MainLayout;
