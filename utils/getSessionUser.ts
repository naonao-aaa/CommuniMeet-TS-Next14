import { getServerSession } from "next-auth/next"; // next-auth のサーバーサイド用のセッション取得メソッドをインポート
import { authOptions } from "@/utils/authOptions"; // 認証設定を定義した authOptions をインポート
import { Session } from "next-auth"; //next-authライブラリからSession型をインポート（Session型は、next-authがユーザーの認証セッション情報を表現するために使用する標準型）

// ユーザー型を定義
interface ExtendedUser {
  id?: string; // IDを追加
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Session型を拡張（元々Session型にあったuserプロパティを除外して、カスタムで用意したuserプロパティをSession型に組み込んだ型）
interface ExtendedSession extends Omit<Session, "user"> {
  user?: ExtendedUser;
}

export const getSessionUser = async () => {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession; // getServerSessionで、現在のセッション情報を取得。型アサーションを使用して拡張したSession型を利用。

    // 「セッションが存在しない場合」または「ユーザー情報が含まれていない場合」は、null を返す
    if (!session || !session.user) {
      return null;
    }

    // セッションからユーザー情報を取り出し、それを含むオブジェクトを返す
    return {
      user: session.user, // ユーザーオブジェクト自体
      userId: session.user.id, // ユーザーのID
    };
  } catch (error) {
    // エラーが発生した場合は、コンソールにエラーを表示し、null を返す
    console.error(error);
    return null;
  }
};
