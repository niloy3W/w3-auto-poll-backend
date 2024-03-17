import mongoose from "mongoose";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import { handleMongooseError } from "../errors/handleValidationError";
import { handleCastError } from "../errors/handleCastError";
import pkg from "jsonwebtoken";
const { JsonWebTokenError } = pkg;

const handleGlobalError = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessage = "";

  if (error instanceof ZodError) {
    const response = handleZodError(error);
    statusCode = response.statusCode;
    message = response.message;
    errorMessage = response.errorMessage;
  } else if (error instanceof mongoose.Error.ValidationError) {
    const response = handleMongooseError(error);
    statusCode = response.statusCode;
    message = response.message;
    errorMessage = response.errorMessage;
  } else if (error instanceof mongoose.Error.CastError) {
    const response = handleCastError(error);
    statusCode = response.statusCode;
    message = response.message;
    errorMessage = response.errorMessage;
  } else if (error.code === 11000) {
    const response = handleDuplicateError(error);
    statusCode = response.statusCode;
    message = response.message;
    errorMessage = response.errorMessage;
  } else if (error instanceof JsonWebTokenError) {
    message = "Unauthorized Access";
    errorMessage = error.message;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    // message = error.message;
    errorMessage = error.message;
  } else if (error instanceof Error) {
    message = error.message;
    errorMessage = error.message;
  }
  res.status(statusCode).send({
    success: false,
    message,
    errorMessage,
    errorDetails:
      error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
        ? null
        : error,
    stack:
      error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
        ? null
        : error?.stack,
  });
};
export default handleGlobalError;
