import { Schema, model, models } from "mongoose";

// MessageSchema の定義
const MessageSchema = new Schema(
  {
    // 送信者のID
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 受信者のID
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 関連するイベントのID
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    // メッセージ本文
    body: {
      type: String,
    },
    // 既読を管理するフラグ
    read: {
      type: Boolean,
      default: false, // デフォルトは「未読」
    },
  },
  // 作成日時と更新日時のタイムスタンプを自動的に追加
  {
    timestamps: true,
  }
);

// Messageモデルを定義または既存のモデルを再利用。（目的は、同じモデルを複数回作成してエラーを引き起こすことを避けること。）
const Message = models.Message || model("Message", MessageSchema);

// Messageモデルをエクスポート
export default Message;
