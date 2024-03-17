import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { createToken } from "./auth.utils";
import config from "../../config";

// login user
const loginAUser = async (payload) => {
  // checking if the user is exist

  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // checking if the password matched or not

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");
  }

  // create token and sent to the  client

  const jwtPayload = {
    name: user.name,
    email: user.email,
    role: user.role,
    id: user._id,
  };

  // create a access token

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  // create refresh token

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  // Exclude password field from the user object

  const userWithoutPassword = {
    email: user.email,
    role: user.role,
  };

  const result = {
    userWithoutPassword,
    accessToken,
    refreshToken,
  };

  return result;
};

// create refresh token

const refreshToken = async (token) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret);

  const { userId } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return {
    accessToken,
  };
};
export const AuthServices = {
  loginAUser,
  refreshToken,
};
