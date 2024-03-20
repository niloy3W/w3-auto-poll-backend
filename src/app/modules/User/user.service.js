import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "./user.model";

// Function to find the next available parent user
const findParentUser = async () => {
  const users = await User.find();
  for (const user of users) {
    const childrenCount = await User.countDocuments({ parent: user._id });
    if (childrenCount < 3) {
      return user._id;
    }
  }
  return null;
};

// Create user
const createUserIntoDB = async (userData) => {
  const isUserExistsInDB = await User.findOne({ email: userData.email });

  if (isUserExistsInDB) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  let role = "user"; // Default role

  // Checking if there are any users in the database
  const usersCount = await User.countDocuments();
  let parent = null;

  if (usersCount > 0) {
    // If there are existing users, find the next available parent user
    parent = await findParentUser();
    if (!parent) {
      throw new AppError(httpStatus.BAD_REQUEST, "No available parent found");
    }
  } else {
    // First user becomes the root user
    role = "admin";
  }

  // Create a new user
  const newUser = new User({
    email: userData.email,
    password: userData.password,
    role: role,
  });

  await newUser.save();

  return newUser;
};

// get all user
const getAllUsersFromDB = async () => {
  const result = await User.find().populate("children");
  return result;
};

// get specific user
const getSpecificUsersFromDB = async (id) => {
  const result = await User.findById(id).populate("children");
  return result;
};

// assign parent
const assignParent = async ({ userId, parentId }) => {
  const MAX_CHILDREN = 3;

  // Check if the parent already has a user assigned to them
  const isAssigned = await User.findOne({ _id: userId, assigned: true });

  if (isAssigned) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This User already has a user assigned to them"
    );
  }

  // Check if userId is equal to parentId
  if (userId === parentId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't use your own id as the parent id"
    );
  }

  // Find the parent user
  const parentUser = await User.findById(parentId);

  if (!parentUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Parent id does not exist");
  }

  // Check if the parent has reached the maximum number of children
  if (parentUser.children.length >= MAX_CHILDREN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Not enough slots available for children"
    );
  }

  // Check if userId already exists in parentUser's children array
  if (parentUser.children.includes(userId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This user is already assigned as a child to the specified parent"
    );
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { assigned: true },
    { new: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Push the userId into the children array using $addToSet to avoid duplicates
  const update = {
    $addToSet: { children: userId },
  };

  // Using upsert: true ensures that if the parentUser document doesn't exist, it will be created
  const options = { upsert: true };

  // Update the parentUser document
  await User.findByIdAndUpdate(parentId, update, options);

  return result;
};

export const UserService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSpecificUsersFromDB,
  assignParent,
};
