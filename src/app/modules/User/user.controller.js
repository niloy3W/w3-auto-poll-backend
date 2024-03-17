import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

// create user into db
const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});
// get all user
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users fetched successfully",
    data: result,
  });
});

// get all user
const getSpecificUsers = catchAsync(async (req, res) => {
  const result = await UserService.getSpecificUsersFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data fetched successfully",
    data: result,
  });
});
// assign parent
const assignParent = catchAsync(async (req, res) => {
  const data = { userId: req.params.id, parentId: req.body.parentId };
  const result = await UserService.assignParent(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parent assign successful",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSpecificUsers,
  assignParent,
};
