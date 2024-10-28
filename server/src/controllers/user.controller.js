import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  // deleteFromCloudinary,
} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt, { decode } from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // to add refresh token in mongodb
    await user.save({ validateBeforeSave: false }); // don't do validation here because there's no need

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Refressh and Acess Token"
    );
  }
};

// const registerUser = asyncHandler(async (req, res) => {
//   // get user details from frontend
//   // validataion  - is empty
//   // check if the user already exist
//   // check for images, check for avatar
//   // upload them to cloudinary, avatar
//   // create user object - create entry in db
//   // remove password and refress token from responce
//   // check for user creation
//   // return res

//   //getting the user details.
//   const { fullName, email, userName, password } = req.body;

//   if (
//     [fullName, email, userName, password].some(
//       (fields) => fields?.trim() === ""
//     )
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }

//   // Checking @ in email

//   const emailValidate = email.includes("@");
//   if (!emailValidate) {
//     throw new ApiError(400, "email is not correct");
//   }

//   // Validation for already exited user

//   const UserNameExist = await User.findOne({ userName });
//   const UserEmailExist = await User.findOne({ email });

//   if (UserEmailExist) {
//     throw new ApiError(408, "Email Already Exist");
//   }

//   if (UserNameExist) {
//     throw new ApiError(409, "Username Already Exist");
//   }

//   // Checking the avatar image
//   const avatarLocalPath = req.files?.avatar[0]?.path;
//   // const coverImageLocalPath = req.files?.coverImage[0]?.path;

//   // let coverImageLocalPath;
//   // if (
//   //   req.files &&
//   //   Array.isArray(req.files.coverImage) &&
//   //   req.files.coverImage.length > 0
//   // ) {
//   //   coverImageLocalPath = req.files.coverImage[0].path;
//   // }

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar is required");
//   }

//   // uploading the avatar and coverImage to the cloudinary
//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

//   if (!avatar) {
//     throw new ApiError(400, "Avatar is required");
//   }

//   // adding details in db

//   const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     // coverImage: coverImage?.url || "",
//     email,
//     password,
//     userName: userName.toLowerCase(),
//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering a user");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
// });

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const emailValidate = email.includes("@");
  if (!emailValidate) {
    throw new ApiError(400, "Email is not correct");
  }

  const UserNameExist = await User.findOne({ userName });
  const UserEmailExist = await User.findOne({ email });

  if (UserEmailExist) {
    throw new ApiError(408, "Email Already Exists");
  }

  if (UserNameExist) {
    throw new ApiError(409, "Username Already Exists");
  }

  // Check for avatar image and upload to Cloudinary
  const avatarBuffer = req.files?.avatar[0]?.buffer;

  if (!avatarBuffer) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarBuffer);

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details
  // username or email
  // find user
  // password check
  // access and refresh token
  // send cookie

  const { email, password, userName } = req.body;

  if (!(userName || email)) {
    throw new ApiError(400, "username or email is required");
  }

  // console.log(req.body);
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  // console.log("user ======== ", user);

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credientials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Loggin Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this will remove the user details
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "anAuthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid refreshToken");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200),
        { accessToken, refreshToken: newRefreshToken },
        "Access Token Refreshed Successfully"
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!(newPassword === confirmNewPassword)) {
    throw new ApiError(401, "Confirm password doesn't match");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user Fetched Seccessfullly"));
});

const getAllNormalUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ roles: "normal_user" }).select(
    "fullName _id"
  );
  res.status(200).json(new ApiResponse(200, users, "Normal users fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName, // same as fullName : fullName
        email: email, // same as email, of es6 syntax
      },
    },
    { new: true }
  ).select(" -password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserRoleToSponsor = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Assuming the user is authenticated and the user ID is in the token

  // Update the user's role to 'sponsor'
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { roles: "sponsor" },
    { new: true, runValidators: true } // new: true returns the updated user
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User role updated to sponsor"));
});

const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { roles } = req.body; // This should contain 'contributor'

  if (!userId || !roles) {
    return res.status(400).json({ message: "User ID and role are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.roles = roles; // Update role to 'contributor'
    await user.save();

    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user role", error });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  // updateUserAvatar,
  updateUserRoleToSponsor,
  getAllNormalUsers,
  updateUserRole,
};
