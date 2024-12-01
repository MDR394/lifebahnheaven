import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  // Check if it's an instance of `ApiError`
  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      success: false,
      message: message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Fallback for other errors
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
