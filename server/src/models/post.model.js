import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postImg: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    birthPlace: {
      type: String,
      required: true,
    },
    burial: {
      type: String,
      required: true,
    },
    plot: {
      type: String,
      required: true,
    },
    reactions: {
      type: Number,
      default: 0,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    deathDate: {
      type: Date,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongooseAggregatePaginate);
export const Post = mongoose.model("Post", postSchema);
