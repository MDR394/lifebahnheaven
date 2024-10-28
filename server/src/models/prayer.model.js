import mongoose, { Schema } from "mongoose";

const prayerSchema = new Schema(
  {
    prayerText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Prayer = mongoose.model("Prayer", prayerSchema);
