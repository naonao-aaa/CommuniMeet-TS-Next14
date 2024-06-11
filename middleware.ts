import { NextResponse, NextRequest } from "next/server"; // next-authのJWTトークン取得関数をインポート
import { getToken } from "next-auth/jwt"; // next-authのJWTトークン取得関数をインポート

// ミドルウェア関数を非同期で定義。
//引数で、リクエストオブジェクトを受け取る
export async function middleware(req: NextRequest) {
  // JWTトークンを取得。リクエストと環境変数に保存されたシークレットを使用
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // リクエストされたURLのパス名を取得
  const { pathname } = req.nextUrl;

  // 特定のパスにアクセスがあった場合の条件を設定
  if (
    pathname.startsWith("/events/add") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/events/saved") ||
    pathname.startsWith("/messages")
  ) {
    // JWTトークンが存在しない場合（ユーザーが未認証の場合）
    if (!token) {
      // ユーザーが未認証の場合、ホームページへリダイレクト
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // どの条件にも当てはまらない場合、通常のレスポンスを返す
  return NextResponse.next();
}

// ミドルウェアの適用範囲を指定。特定のルートにのみミドルウェアを適用
export const config = {
  matcher: ["/events/add", "/profile", "/events/saved", "/messages"],
};
