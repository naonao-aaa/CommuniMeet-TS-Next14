import { v2 as cloudinary } from "cloudinary"; // CloudinaryのNode.js SDKをインポートする。`v2` はバージョン2を用いたいから。

// Cloudinaryライブラリに対して設定を行う。
// これにより、以後のAPI呼び出しでこれらの設定を使用することができる。
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // `cloud_name` は自分のCloudinaryアカウントの一意のクラウド名。
  api_key: process.env.CLOUDINARY_API_KEY, // `api_key` はCloudinary APIを利用するためのAPIキー。
  api_secret: process.env.CLOUDINARY_API_SECRET, // `api_secret` はCloudinary APIを利用するための秘密キー。
});

// 設定済みのcloudinaryオブジェクトをエクスポート。
// これにより、他のファイルからこのオブジェクトをインポートして直接使用することができる。
export default cloudinary;
