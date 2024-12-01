import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    documentFile: {
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

export const Document = mongoose.model("Document", documentSchema);
