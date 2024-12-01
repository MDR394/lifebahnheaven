import mongoose, { Schema } from "mongoose";

const prayerSchema = new Schema(
  {
    prayerText: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post", // Assuming your RIP schema is named "Post"
      required: true,
    },
  },
  { timestamps: true }
);

export const Prayer = mongoose.model("Prayer", prayerSchema);
