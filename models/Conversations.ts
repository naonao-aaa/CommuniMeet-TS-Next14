import { Schema, model, models } from "mongoose";

// ConversationsSchema の定義
const ConversationsSchema = new Schema(
  {
    // 関連するイベントのID
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    // イベントオーナーのID
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // イベントに興味を持つ一般ユーザーのID
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 会話内で最後に交換されたメッセージのID。
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: false, // 最初のメッセージ時には、最後に交換されたメッセージのIDがないから。
    },
  },
  // 作成日時と更新日時のタイムスタンプを自動的に追加
  {
    timestamps: true,
  }
);

// Conversationsモデルを定義または既存のモデルを再利用。（目的は、同じモデルを複数回作成してエラーを引き起こすことを避けること。）
const Conversations =
  models.Conversations || model("Conversations", ConversationsSchema);

// Conversationsモデルをエクスポート
export default Conversations;
