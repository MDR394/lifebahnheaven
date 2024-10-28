// import jwt from "jsonwebtoken";
// import ApiError from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";

// export const verifyJWT = asyncHandler(async (req, _, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     // console.log("ACCESS TOKEN",token)

//     if (!token) {
//       throw new ApiError(401, "Unautorized Request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(401, "Invalid Access Token");
//     }

//     req.user = user;
//     next();
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
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err && err.name === "TokenExpiredError") {
        // If token has expired, inform client to refresh the token
        throw new ApiError(
          401,
          "Access token expired, please refresh your token"
        );
      } else if (err) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = decodedToken; // Attach decoded token data to request
      next(); // Proceed to the next middleware
    });
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
