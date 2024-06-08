import connectDB from "@/config/database";

export const GET = async (request: Request) => {
  try {
    await connectDB(); // connectDB関数を呼び出してデータベースに接続を試みる。

    // データベース接続後、クライアントに対して JSON 形式のレスポンスを送る。
    return new Response(JSON.stringify({ message: "Hello World" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    // エラー時は、ステータスコード 500 のレスポンスを返す。
    return new Response("Something Went Wrong", { status: 500 });
  }
};
