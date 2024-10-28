import mongoose, { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllPostById = asyncHandler(async (req, res) => {
  // Todo- Get all post by userID
  const { userId } = req.params;
  // console.log(userId);
  // 667069c207c28a1763dc109c

  if (!isValidObjectId(userId)) {
    throw new ApiError(401, "invalid UserId");
  }

  const post = await Post.find({ owner: userId });

  if (!post.length) {
    throw new ApiError(401, "No post found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, post, "All post have been fetched successfully")
    );
});

const getAllPost = asyncHandler(async (req, res) => {
  // Fetch all posts
  const posts = await Post.find({});
  console.log("Found posts: ", posts);

  if (!posts.length) {
    throw new ApiError(401, "No posts found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, posts, "All posts have been fetched successfully")
    );
});

const createPost = asyncHandler(async (req, res) => {
  // Create post

  const {
    title,
    description,
    reactions,
    dateOfBirth,
    birthPlace,
    burial,
    plot,
    deathDate,
  } = req.body;

  console.log(
    "Req. body ===== ",
    title,
    description,
    reactions,
    dateOfBirth,
    birthPlace,
    burial,
    plot,
    deathDate
  );

  if (
    !title ||
    !description ||
    !reactions ||
    !dateOfBirth ||
    !birthPlace ||
    !plot ||
    !deathDate
  ) {
    throw new ApiError(401, "title and description are required");
  }

  const postImgLocalPath = req.files?.postImg[0]?.path;

  if (!postImgLocalPath) {
    throw new ApiError(401, "postImg is required");
  }

  // uploading the postImg to the cloudinary

  const postImg = await uploadOnCloudinary(postImgLocalPath);
  if (!postImg) {
    throw new ApiError(401, "Error while uploading the postImg to cloudinary");
  }

  const post = await Post.create({
    title: title,
    description: description,
    owner: req.user._id,
    reactions: reactions,
    birthPlace: birthPlace,
    burial: burial,
    plot: plot,
    dateOfBirth: dateOfBirth,
    deathDate: deathDate,
    postImg: postImg.url,
  });

  if (!post) {
    throw new ApiError(401, "Error while creating a post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "The post has been created Successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  // update post

  const { postId } = req.params;
  const { title, description } = req.body;
  const { postImgLocalPath } = req.file?.path;
  // console.log("post img local path"postImgLocalPath);

  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid postId");
  }

  if (!postImgLocalPath) {
    throw new ApiError(401, "postImg file is missing");
  }

  const oldPostImgUrl = req.post.url;
  console.log(oldPostImgUrl);

  const postImg = await uploadOnCloudinary(postImgLocalPath);
  if (!postImg.url) {
    throw new ApiError(401, "Error while uploading the postimg on cloudinary");
  }

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      title,
      postDescription: description,
      postImg: postImg.url,
    },
    {
      new: true,
    }
  );

  if (!post) {
    throw new ApiError(401, "Error while updating the post");
  }
  if (oldPostImgUrl) {
    await deleteFromCloudinary(oldPostImgUrl);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post has been updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  // delete post
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid postId");
  }

  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    throw new ApiError(401, "No post found with this id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post has been deleted Successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Validate the postId
  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid postId");
  }

  // Fetch the post by its ID
  const post = await Post.findById(postId);

  // If no post is found, return an error
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Send the post data as a response
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post has been fetched successfully"));
});

export {
  getAllPost,
  createPost,
  deletePost,
  updatePost,
  getAllPostById,
  getPostById,
};
