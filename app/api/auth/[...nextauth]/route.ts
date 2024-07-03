import { authOptions } from "@/utils/authOptions"; // 認証設定を含むオブジェクトをインポート
import NextAuth from "next-auth/next"; // NextAuthライブラリのインポート

const handler = NextAuth(authOptions); // NextAuthに認証設定を渡してハンドラーを生成

export { handler as GET, handler as POST }; // GETおよびPOSTリクエストで同じハンドラーを使用するようにエクスポート
