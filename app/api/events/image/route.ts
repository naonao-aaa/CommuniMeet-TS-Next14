import Busboy from "busboy";
import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/config/cloudinary"; // Cloudinaryの設定をインポート

// POST /api/events/image
//Cloudinaryへの画像アップ処理
export const POST = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  console.log(response.status);

  try {
    if (
      !request.headers["content-type"] ||
      !request.headers["content-type"].startsWith("multipart/form-data")
    ) {
      return response
        .status(400)
        .json({ error: "Invalid content-type. Expected multipart/form-data." });
    }

    // リクエストヘッダーを用いてBusboyを初期化し、フォームデータを解析。
    const busboy = Busboy({ headers: request.headers });

    // ファイルイベントをリッスン。ファイルが受信されると発生する。
    busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
      // 受信したファイルが画像かどうかをフィールド名とMIMEタイプでチェック。
      if (fieldname === "image" && mimetype.startsWith("image/") && filename) {
        const buffers = []; // ファイルデータのチャンクを保持するための配列
        // ファイルデータを非同期に読み取る。
        for await (const chunk of file) {
          buffers.push(chunk); // 各チャンクを配列に追加
        }
        const imageBuffer = Buffer.concat(buffers); // すべてのチャンクを単一のバッファに連結
        const imageBase64 = imageBuffer.toString("base64"); // バッファをBase64文字列に変換

        // Base64データを使用してCloudinaryに画像をアップロードし、アップロードフォルダを指定
        const uploadResult = await cloudinary.uploader.upload(
          `data:${mimetype};base64,${imageBase64}`,
          {
            folder: "ts_communimeeting",
          }
        );

        // アップロードが成功した場合、200 HTTPステータスコードと画像URLをJSONで送信
        response.status(200).json({ imageUrl: uploadResult.secure_url });
      }
    });

    // 'finish'イベントをリッスン。これはすべてのデータが処理された後に発生する。
    busboy.on("finish", () => {
      response.end(); // HTTPレスポンスを終了
    });

    // 受信HTTPリクエストをBusboyにパイプする。これにより、フォームデータが解析される。
    request.pipe(busboy);
  } catch (error) {
    console.error("Error in POST /api/events/image:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};
