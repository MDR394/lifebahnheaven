import mongoose, { isValidObjectId } from "mongoose";
import { Photo } from "../models/photo.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllPhotoById = asyncHandler(async (req, res) => {
  // Todo- Get all post by userID
  const { userId } = req.params;
  // console.log(userId);
  // 667069c207c28a1763dc109c

  if (!isValidObjectId(userId)) {
    throw new ApiError(401, "invalid UserId");
  }

  const photo = await Photo.find({ owner: userId });

  if (!photo.length) {
    throw new ApiError(401, "No photo found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, photo, "All photo have been fetched successfully")
    );
});

const getPhotosByRipId = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  // console.log(postId);
  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid RIP ID");
  }

  const photos = await Photo.find({ post: postId });
  if (!photos.length) {
    throw new ApiError(404, "No photos found for this RIP");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, photos, "photos fetched successfully"));
});

const getAllPhoto = asyncHandler(async (req, res) => {
  // Fetch all posts
  const photos = await Photo.find({});
  // console.log("Found posts: ", flowers);

  if (!photos.length) {
    throw new ApiError(401, "No flowers found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, photos, "All photos have been fetched successfully")
    );
});

const createPhoto = asyncHandler(async (req, res) => {
  // Create Photo

  const { postId } = req.body;
  console.log(postId);

  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid postId");
  }
  // Check for avatar image and upload to Cloudinary
  // const avatarBuffer = req.files?.avatar[0]?.buffer;
  const photoBuffer = req.files?.photoImg[0]?.buffer;

  if (!photoBuffer) {
    throw new ApiError(401, "Photo img is required");
  }

  // uploading the flowerImg to the cloudinary

  const photoImg = await uploadOnCloudinary(photoBuffer);
  if (!photoImg) {
    throw new ApiError(401, "Error while uploading the photoImg to cloudinary");
  }

  const photo = await Photo.create({
    owner: req.user._id,
    photoImg: photoImg.url,
    post: postId,
  });

  if (!photo) {
    throw new ApiError(401, "Error while creating a photo");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, photo, "The photo has been added Successfully"));
});

// const getPhotosByRipId = asyncHandler(async (req, res) => {
//   const { postId } = req.params;
//   // console.log(postId);
//   if (!isValidObjectId(postId)) {
//     throw new ApiError(401, "Invalid RIP ID");
//   }

//   const photos = await Photo.find({ post: postId });
//   if (!photos.length) {
//     throw new ApiError(404, "No photos found for this RIP");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, photos, "photos fetched successfully"));
// });

// const deleteFlower = asyncHandler(async (req, res) => {
//   // delete post
//   const { flowerId } = req.params;

//   if (!isValidObjectId(flowerId)) {
//     throw new ApiError(401, "Invalid postId");
//   }

//   const flower = await Flower.findByIdAndDelete(flowerId);

//   if (!flower) {
//     throw new ApiError(401, "No flower found with this id");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, flower, "flower has been deleted Successfully"));
// });

export {
  getAllPhotoById,
  getAllPhoto,
  createPhoto,
  // deleteFlower,
  getPhotosByRipId,
};
