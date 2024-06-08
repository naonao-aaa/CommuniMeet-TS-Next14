import { Schema, model, models } from "mongoose";

// Event スキーマを定義
const EventSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      venue: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
    },
    date_time: {
      start: {
        type: Date,
        required: [true, "Start date and time are required"],
      },
      end: {
        type: Date,
        required: [true, "End date and time are required"],
      },
    },
    attendee_limits: {
      min: Number,
      max: Number,
    },
    ticket_info: {
      price: {
        type: Number,
        required: [true, "Price is required"],
      },
      availability: {
        type: Boolean,
        default: true,
      },
    },
    conditions: [
      {
        type: String,
      },
    ],
    responsible_info: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  //timestamps オプションを true に設定することで、createdAt と updatedAt フィールドが自動的に生成され、ドキュメントの作成日時と更新日時が記録される。
  {
    timestamps: true,
  }
);

// Event モデルを定義または既存のモデルを再利用。（目的は、同じモデルを複数回作成してエラーを引き起こすことを避けること。）
const Event = models.Event || model("Event", EventSchema);

// Event モデルをエクスポート
export default Event;
