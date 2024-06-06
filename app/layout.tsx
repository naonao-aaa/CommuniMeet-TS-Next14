import React from "react";

import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="ja">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default MainLayout;
