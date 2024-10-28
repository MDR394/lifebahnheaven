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
  console.log("Found posts: ", flowers);

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

  const { name } = req.body;

  if (!name) {
    throw new ApiError(401, "Name is required");
  }

  const flowerImageLocalPath = req.files?.flowerImg[0]?.path;

  if (!flowerImageLocalPath) {
    throw new ApiError(401, "postImg is required");
  }

  // uploading the flowerImg to the cloudinary

  const flowerImg = await uploadOnCloudinary(flowerImageLocalPath);
  if (!flowerImg) {
    throw new ApiError(401, "Error while uploading the postImg to cloudinary");
  }

  const flower = await Flower.create({
    owner: req.user._id,
    name: name,
    flowerImg: flowerImg.url,
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

// const updatePost = asyncHandler(async (req, res) => {
//   // update post

//   const { postId } = req.params;
//   const { title, description } = req.body;
//   const { postImgLocalPath } = req.file?.path;
//   // console.log("post img local path"postImgLocalPath);

//   if (!isValidObjectId(postId)) {
//     throw new ApiError(401, "Invalid postId");
//   }

//   if (!postImgLocalPath) {
//     throw new ApiError(401, "postImg file is missing");
//   }

//   const oldPostImgUrl = req.post.url;
//   console.log(oldPostImgUrl);

//   const postImg = await uploadOnCloudinary(postImgLocalPath);
//   if (!postImg.url) {
//     throw new ApiError(401, "Error while uploading the postimg on cloudinary");
//   }

//   const post = await Post.findByIdAndUpdate(
//     postId,
//     {
//       title,
//       postDescription: description,
//       postImg: postImg.url,
//     },
//     {
//       new: true,
//     }
//   );

//   if (!post) {
//     throw new ApiError(401, "Error while updating the post");
//   }
//   if (oldPostImgUrl) {
//     await deleteFromCloudinary(oldPostImgUrl);
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, post, "Post has been updated successfully"));
// });

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

// const getPostById = asyncHandler(async (req, res) => {
//   const { postId } = req.params;

//   // Validate the postId
//   if (!isValidObjectId(postId)) {
//     throw new ApiError(401, "Invalid postId");
//   }

//   // Fetch the post by its ID
//   const post = await Post.findById(postId);

//   // If no post is found, return an error
//   if (!post) {
//     throw new ApiError(404, "Post not found");
//   }

//   // Send the post data as a response
//   return res
//     .status(200)
//     .json(new ApiResponse(200, post, "Post has been fetched successfully"));
// });

export { getAllFlowerById, getAllFlower, createFlower, deleteFlower };
