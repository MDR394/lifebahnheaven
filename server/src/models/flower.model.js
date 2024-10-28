import mongoose, { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const flowerSchema = new Schema(
  {
    flowerImg: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// flowerSchema.plugin(mongooseAggregatePaginate);
export const Flower = mongoose.model("Flower", flowerSchema);
