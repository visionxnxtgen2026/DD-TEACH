/**
 * ========================
 * ❌ NOT FOUND MIDDLEWARE
 * Handles invalid routes (404)
 * ========================
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error directly to the errorHandler below
};

/**
 * ========================
 * ⚠️ GLOBAL ERROR HANDLER
 * Catches and formats all server errors
 * ========================
 */
export const errorHandler = (err, req, res, next) => {
  // 🔧 If the status code is still 200, force it to 500 (Internal Server Error)
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  // 🔥 MONGOOSE BAD OBJECT ID (Fallback just in case it bypasses controller checks)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400; // 400 Bad Request is slightly more accurate here than 404
    message = "Resource not found (Invalid ID format)";
  }

  // 🔥 MONGOOSE DUPLICATE KEY ERROR (e.g., trying to create two items with the exact same unique field)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0]; // Finds which field caused the duplicate error
    message = `Duplicate value entered for '${field}'. Please use a different value.`;
  }

  // 🔥 MONGOOSE VALIDATION ERROR (e.g., missing required fields defined in schema)
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Maps over all validation errors and joins them into a single readable string
    const errors = Object.values(err.errors).map((val) => val.message);
    message = `Validation Error: ${errors.join(", ")}`;
  }

  // 📤 Send the standardized response
  res.status(statusCode).json({
    success: false,
    message: message,
    // 🔍 Show stack trace only in development mode for security
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};