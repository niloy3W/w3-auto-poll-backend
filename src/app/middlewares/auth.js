import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { User } from "../modules/User/user.model";
import config from "../config";

const auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret);
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!");
    }
    const { role, email } = decoded;

    // checking if the user is exist
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
    }

    req.user = decoded;
    next();
  });
};

export default auth;
