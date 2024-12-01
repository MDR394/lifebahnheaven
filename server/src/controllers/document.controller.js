import mongoose, { isValidObjectId } from "mongoose";
import { Document } from "../models/document.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

const getAllDocumentsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(401, "Invalid User ID");
  }

  const documents = await Document.find({ owner: userId });

  if (!documents.length) {
    throw new ApiError(404, "No documents found for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        documents,
        "All documents have been fetched successfully"
      )
    );
});

const getAllDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({});

  if (!documents.length) {
    throw new ApiError(404, "No documents found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        documents,
        "All documents have been fetched successfully"
      )
    );
});

// const createDocument = asyncHandler(async (req, res) => {
//   console.log("Files received:", req.files);
//   console.log("Body received:", req.body);
//   const { postId } = req.body;

//   if (!isValidObjectId(postId)) {
//     throw new ApiError(401, "Invalid Post ID");
//   }

//   // Check if the post exists
//   const postExists = await Post.findById(postId);
//   if (!postExists) {
//     throw new ApiError(404, "Post not found");
//   }

//   // Validate document upload
//   // const documentBuffer = req.files?.documentFile[0]?.buffer;
//   const documentBuffer = req.files?.documentFile[0]?.buffer;

//   if (!documentBuffer) {
//     throw new ApiError(400, "Document file is required");
//   }

//   if (req.files.document[0].size > 5 * 1024 * 1024) {
//     // Limit to 5MB
//     throw new ApiError(400, "File size exceeds the 5MB limit");
//   }

//   // Upload to Cloudinary
//   const documentUpload = await uploadOnCloudinary(documentBuffer, {
//     resource_type: "raw",
//   });

//   if (!documentUpload) {
//     throw new ApiError(500, "Error uploading the document to Cloudinary");
//   }

//   const document = await Document.create({
//     owner: req.user._id,
//     documentFile: documentUpload.url,
//     post: postId,
//   });

//   if (!document) {
//     throw new ApiError(500, "Error creating document entry");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         document,
//         "The document has been created successfully"
//       )
//     );
// });

const createDocument = asyncHandler(async (req, res) => {
  console.log("File received:", req.file); // Check file data
  console.log("Body received:", req.body);

  const { postId } = req.body;

  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid Post ID");
  }

  const postExists = await Post.findById(postId);
  if (!postExists) {
    throw new ApiError(404, "Post not found");
  }

  // Get document file buffer from req.file (since we're using .single())
  const documentBuffer = req.file.buffer;
  // const documentBuffer = req.file?.documentFile[0]?.buffer;

  if (!documentBuffer) {
    throw new ApiError(400, "Document file is required");
  }

  // Check if the file size exceeds the limit
  if (req.file.size > 5 * 1024 * 1024) {
    throw new ApiError(400, "File size exceeds the 5MB limit");
  }

  // Upload to Cloudinary
  const documentUpload = await uploadOnCloudinary(documentBuffer, {
    resource_type: "raw", // Make sure this matches your document type
  });

  if (!documentUpload) {
    throw new ApiError(500, "Error uploading the document to Cloudinary");
  }

  const document = await Document.create({
    owner: req.user._id,
    documentFile: documentUpload.url,
    post: postId,
  });

  if (!document) {
    throw new ApiError(500, "Error creating document entry");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        document,
        "The document has been created successfully"
      )
    );
});

const getDocumentsByPostId = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(401, "Invalid Post ID");
  }

  const documents = await Document.find({ post: postId });

  if (!documents.length) {
    throw new ApiError(404, "No documents found for this post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, documents, "Documents fetched successfully"));
});

const deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  if (!isValidObjectId(documentId)) {
    throw new ApiError(401, "Invalid Document ID");
  }

  const document = await Document.findByIdAndDelete(documentId);

  if (!document) {
    throw new ApiError(404, "No document found with this ID");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, document, "Document has been deleted successfully")
    );
});

export {
  getAllDocumentsByUserId,
  getAllDocuments,
  createDocument,
  deleteDocument,
  getDocumentsByPostId,
};
