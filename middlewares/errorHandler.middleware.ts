// src/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";

export interface ErrorResponse {
  statusCode: number;
  status: string;
  message: string;
  stack?: any;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    status = "fail";
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    status = "fail";
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    status = "fail";
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    status = "fail";
    message = "Your token has expired. Please log in again.";
  }

  // Ensure status is a string and convert to lowercase
  const finalStatus =
    typeof status === "string" ? status.toLowerCase() : "error";
  const finalMessage =
    typeof message === "string" ? message : "An error occurred";

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      statusCode,
      status: finalStatus,
      message: finalMessage,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    status: finalStatus,
    message: finalMessage,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
