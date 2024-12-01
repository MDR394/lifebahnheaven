import mongoose, { isValidObjectId } from "mongoose";
import { Flower } from "../models/flower.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllFlowerById = asyncHandler(async (req, res) => {
  // Todo- Get all post by userID
  const { userId } = req.params;
  // console.log(userId);
  // 667069c207c28a1763dc109c

  if (!isValidObjectId(userId)) {
    throw new ApiError(401, "invalid UserId");
  }

  const flower = await Flower.find({ owner: userId });

  if (!flower.length) {
    throw new ApiError(401, "No flower found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, flower, "All flower have been fetched successfully")
    );
});

const getAllFlower = asyncHandler(async (req, res) => {
  // Fetch all posts
  const flowers = await Flower.find({});
  // console.log("Found posts: ", flowers);

  if (!flowers.length) {
    throw new ApiError(401, "No flowers found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        flowers,
        "All flowers have been fetched successfully"
      )
    );
});

const createFlower = asyncHandler(async (req, res) => {
  // Create post

  const { postId } = req.body;
  console.log(postId);

  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid postId");
  }
  // Check for avatar image and upload to Cloudinary
  // const avatarBuffer = req.files?.avatar[0]?.buffer;
  const flowerBuffer = req.files?.flowerImg[0]?.buffer;

  if (!flowerBuffer) {
    throw new ApiError(401, "Flower img is required");
  }

  // uploading the flowerImg to the cloudinary

  const flowerImg = await uploadOnCloudinary(flowerBuffer);
  if (!flowerImg) {
    throw new ApiError(401, "Error while uploading the postImg to cloudinary");
  }

  const flower = await Flower.create({
    owner: req.user._id,
    flowerImg: flowerImg.url,
    post: postId,
  });

  if (!flower) {
    throw new ApiError(401, "Error while creating a flower");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, flower, "The flower has been created Successfully")
    );
});

const getFlowersByRipId = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  // console.log(postId);
  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid RIP ID");
  }

  const flowers = await Flower.find({ post: postId });
  if (!flowers.length) {
    throw new ApiError(404, "No flowers found for this RIP");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, flowers, "Flowers fetched successfully"));
});

const deleteFlower = asyncHandler(async (req, res) => {
  // delete post
  const { flowerId } = req.params;

  if (!isValidObjectId(flowerId)) {
    throw new ApiError(401, "Invalid postId");
  }

  const flower = await Flower.findByIdAndDelete(flowerId);

  if (!flower) {
    throw new ApiError(401, "No flower found with this id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, flower, "flower has been deleted Successfully"));
});

export {
  getAllFlowerById,
  getAllFlower,
  createFlower,
  deleteFlower,
  getFlowersByRipId,
};
