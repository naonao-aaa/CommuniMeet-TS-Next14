import { Schema, model, models } from "mongoose";

// ConversationSchema の定義
const ConversationSchema = new Schema(
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
      // ref: "Message",  //コメントアウト。
      // Messageモデルを遅延ロード。循環参照（MessageモデルでConversationモデルを参照していて、ConversationモデルでMessageモデルを参照している）でエラーが出るので、その対策。
      // ref: () => require("./Message").default は、Conversationスキーマの lastMessageIdフィールドの型定義に使われるが、これは Conversationモデル自体が定義される時には直接実行されない。
      // この関数（遅延参照）は、実際に Conversationモデルを使ってデータベース操作を行い、その中で lastMessageId を参照する処理が行われる際に呼び出される。
      ref: () => require("./Message").default,
      required: false, // 最初のメッセージ時には、最後に交換されたメッセージのIDがないから。
      default: null, //デフォルト値をnullとする。これを用意しないと、conversationの新規作成時に、DBのドキュメントにlastMessageIdフィールドが保存されない。
    },
  },
  // 作成日時と更新日時のタイムスタンプを自動的に追加
  {
    timestamps: true,
  }
);

// Conversationモデルを定義または既存のモデルを再利用。（目的は、同じモデルを複数回作成してエラーを引き起こすことを避けること。）
const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);

// Conversationモデルをエクスポート
export default Conversation;
