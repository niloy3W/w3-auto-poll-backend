import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "./user.model";

// create user
const createUserIntoDB = async (userData) => {
  const isUserExistsInDB = await User.findOne({ email: userData.email });

  if (isUserExistsInDB) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const result = await User.create(userData);
  return result;
};

export const UserService = { createUserIntoDB };
