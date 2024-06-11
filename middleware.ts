export { default } from "next-auth/middleware"; // デフォルトのNextAuthミドルウェアをエクスポート

// ミドルウェアの設定を定義
export const config = {
  matcher: ["/events/add", "/profile", "/events/saved", "/messages"],
};
