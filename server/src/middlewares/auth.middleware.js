// import jwt from "jsonwebtoken";
// import ApiError from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       throw new ApiError(401, "Unauthorized Request");
//     }

//     // Verify the token
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
//       if (err && err.name === "TokenExpiredError") {
//         // If token has expired, inform client to refresh the token
//         throw new ApiError(
//           401,
//           "Access token expired, please refresh your token"
//         );
//       } else if (err) {
//         throw new ApiError(401, "Invalid Access Token");
//       }

//       req.user = decodedToken; // Attach decoded token data to request
//       next(); // Proceed to the next middleware
//     });
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// });

import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    const refreshToken = req.cookies?.refreshToken; // Assuming you store the refresh token in cookies.

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized Request");
    }

    // Verify the access token
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          if (err.name === "TokenExpiredError" && refreshToken) {
            // Try refreshing the token
            try {
              const newAccessToken = await refreshAccessToken(refreshToken);
              if (newAccessToken) {
                res.cookie("accessToken", newAccessToken, {
                  httpOnly: true,
                  secure: true,
                });
                req.user = jwt.decode(newAccessToken); // Decode and attach new token data
                return next(); // Proceed to the next middleware
              }
            } catch (refreshError) {
              throw new ApiError(401, "Session expired. Please log in again.");
            }
          } else {
            throw new ApiError(401, "Invalid Access Token");
          }
        } else {
          req.user = decodedToken; // Attach decoded token data
          next(); // Proceed to the next middleware
        }
      }
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized");
  }
});

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the user exists and the refresh token matches
    const user = await User.findById(decoded._id);
    if (user && user.refreshToken === refreshToken) {
      // Generate a new access token
      return jwt.sign(
        {
          _id: user._id,
          email: user.email,
          username: user.userName,
          fullname: user.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
    }
    throw new Error("Invalid refresh token");
  } catch (error) {
    throw new Error("Failed to refresh access token");
  }
};
