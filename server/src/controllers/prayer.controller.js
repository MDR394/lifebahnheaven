import mongoose, { isValidObjectId } from "mongoose";
import { Prayer } from "../models/prayer.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllPrayerById = asyncHandler(async (req, res) => {
  // Todo- Get all post by userID
  const { userId } = req.params;
  // console.log(userId);
  // 667069c207c28a1763dc109c

  if (!isValidObjectId(userId)) {
    throw new ApiError(401, "invalid UserId");
  }

  const prayer = await Prayer.find({ owner: userId });

  if (!prayer.length) {
    throw new ApiError(401, "No prayer found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, prayer, "All prayer have been fetched successfully")
    );
});

const getAllPrayer = asyncHandler(async (req, res) => {
  // Fetch all posts
  const prayer = await Prayer.find({});
  console.log("Found prayer: ", prayer);

  if (!prayer.length) {
    throw new ApiError(401, "No prayer found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, prayer, "All prayers have been fetched successfully")
    );
});

const createPrayer = asyncHandler(async (req, res) => {
  // Create post

  const { prayerText, postId } = req.body;

  console.log("Prayer text", prayerText);
  console.log("postid ", postId);

  if (!prayerText || !postId) {
    throw new ApiError(401, "Prayer text and post id are required!");
  }

  const prayer = await Prayer.create({
    owner: req.user._id,
    prayerText: prayerText,
    post: postId,
  });

  if (!prayer) {
    throw new ApiError(401, "Error while creating a prayer");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, prayer, "The prayer has been created Successfully")
    );
});

const getyPrayerByRipId = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "INVALID RIP ID ");
  }

  const prayer = await Prayer.find({ post: postId });

  if (!prayer.length) {
    throw new ApiError(404, "No prayer found for this rip");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, prayer, "prayer has been fetched successfully"));
});

const deletePrayer = asyncHandler(async (req, res) => {
  // delete post
  const { prayerId } = req.params;

  if (!isValidObjectId(prayerId)) {
    throw new ApiError(401, "Invalid prayerId");
  }

  const prayer = await Prayer.findByIdAndDelete(prayerId);

  if (!prayer) {
    throw new ApiError(401, "No prayer found with this id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, prayer, "prayer has been deleted Successfully"));
});

export {
  getAllPrayerById,
  getAllPrayer,
  createPrayer,
  deletePrayer,
  getyPrayerByRipId,
};
