import { Schema, model, models } from "mongoose";

// User スキーマを定義
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"], // ユニーク制約を設定し、重複を防ぐ
      required: [true, "Email is required"], // 必須フィールドであることを指定
    },
    username: {
      type: String,
      required: [true, "Username is required"], // 必須フィールドであることを指定
    },
    image: {
      type: String, // データタイプは文字列（ユーザー画像のURLを保存する）
    },
    //bookmarks フィールドは、ユーザーがブックマークした物件を参照するための配列。
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event", //ref キーを使用して Event モデルを参照し、MongoDB の ObjectId を用いて関連付けを行う。
      },
    ],
  },
  //timestamps オプションを true に設定することで、createdAt と updatedAt フィールドが自動的に生成され、ドキュメントの作成日時と更新日時が記録される。
  {
    timestamps: true,
  }
);

// User モデルを定義または既存のモデルを再利用。（目的は、同じモデルを複数回作成してエラーを引き起こすことを避けること。）
const User = models.User || model("User", UserSchema);

// User モデルをエクスポート
export default User;
