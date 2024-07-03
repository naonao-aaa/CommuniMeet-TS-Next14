import connectDB from "@/config/database"; // MongoDBへの接続設定をインポート
import User from "@/models/User"; // Userモデルをインポート
import GoogleProvider from "next-auth/providers/google"; // Google認証プロバイダをインポート
import { NextAuthOptions, User as NextAuthUser, Profile } from "next-auth"; //NextAuth.jsを設定する際に使用されるオプションオブジェクトの型をインポート

// Googleのプロファイルオブジェクトにpictureプロパティを追加するカスタム型
interface GoogleProfile extends Profile {
  picture?: string;
}

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
      // カスタム型としてGoogleProfileを使用
      const googleProfile = profile as GoogleProfile;

      // データベースに接続
      await connectDB();
      // ユーザーが存在するか確認
      const userExists = await User.findOne({ email: googleProfile?.email });
      // 存在しない場合はデータベースにユーザーを追加
      if (!userExists) {
        const username = googleProfile?.name?.slice(0, 20); // ユーザー名が長すぎる場合は、切り捨て

        await User.create({
          email: googleProfile?.email,
          username,
          image: googleProfile?.picture,
        });
      }
      // trueを返してサインインを許可
      return true;
    },
    // セッションオブジェクトを変更するための関数
    async session({ session }) {
      // データベースからユーザーを取得
      const user = await User.findOne({ email: session.user?.email });
      // セッションにユーザーIDを割り当て
      if (user) {
        (session.user as NextAuthUser & { id: string }).id =
          user._id.toString();
      }
      // session.user.id = user._id.toString();
      // 変更したセッションを返す
      return session;
    },
  },
};
