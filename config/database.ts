import mongoose from "mongoose";

// connected 変数を使用してデータベースの接続状態を追跡(MongoDB への接続が既に行われているかどうかを追跡。)
// 接続が一度確立されたら再接続を避けることでリソースの無駄遣いを防ぐ。
let connected = false;

// connectDB という非同期関数を定義
const connectDB = async () => {
  // MongoDB の strictQuery モードを有効に設定
  mongoose.set("strictQuery", true);

  // すでにデータベースに接続している場合は、再接続を避ける
  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }

  // MongoDB に接続を試みる
  try {
    // 環境変数から MongoDB の URI を取得して接続
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not defined. Check your environment variables."
      );
    }
    await mongoose.connect(uri);
    // 接続に成功した場合、変数connected を true に設定
    connected = true;
    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
