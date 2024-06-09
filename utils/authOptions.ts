import GoogleProvider from "next-auth/providers/google"; // Google認証プロバイダをインポート
import { NextAuthOptions } from "next-auth"; //NextAuth.jsを設定する際に使用されるオプションオブジェクトの型をインポート

export const authOptions: NextAuthOptions = {
  // 認証プロバイダの配列
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // GoogleのOAuthクライアントID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // GoogleのOAuthクライアントシークレット
      authorization: {
        // 認証時に使用する追加のパラメータ
        params: {
          prompt: "consent", // ユーザーに許可を強制的に尋ねる
          access_type: "offline", // オフラインアクセスを可能にし、リフレッシュトークンを取得
          response_type: "code", // OAuth 2.0認証コードフローを使用
        },
      },
    }),
  ],
  callbacks: {
    // ユーザーが成功裏にサインインしたときに呼ばれる
    async signIn({ profile }) {
      // データベースに接続
      // ユーザーが存在するか確認
      // 存在しない場合はデータベースにユーザーを追加
      // trueを返してサインインを許可
      return true;
    },
    // セッションオブジェクトを変更するための関数
    async session({ session }) {
      // データベースからユーザーを取得
      // セッションにユーザーIDを割り当て
      // 変更したセッションを返す
      return session;
    },
  },
};
