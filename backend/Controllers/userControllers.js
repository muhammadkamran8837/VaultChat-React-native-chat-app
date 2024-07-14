const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken");

/*********************** logic for user registeration **********************/

const registerUser = asyncHandler(async (request, response) => {
  //destructuring the properties of the user submitted data from request body of http request for posting data
  const { name, email, password, picture } = request.body;
  if (!name || !email || !password) {
    response.status(400);
    throw new Error("please enter all fields");
    return;
  }
  //checking if the user is already registered,using mongoDB findOne Querry
  const userExists = await User.findOne({ email });
  if (userExists) {
    response.status(400);
    throw new Error("user already exists");
    return;
  }
  // creating a new user in mongoDb using create querry
  const newuser = await User.create({
    name,
    email,
    password,
    picture,
  });

  // Sending Response:
  if (newuser) {
    response.status(201).json({
      _id: newuser.id,
      name: newuser.name,
      email: newuser.email,
      picture: newuser.picture,
      token: generateToken(newuser._id),
    });
  } else {
    response.status(400);
    throw new Error("failed to create user");
  }
});

/********************* logic for user authentication/Login *********************************/

const authUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  const userExists = await User.findOne({ email });
  if (userExists && (await userExists.passwordMatched(password))) {
    response.json({
      _id: userExists.id,
      name: userExists.name,
      email: userExists.email,
      picture: userExists.picture,
      token: generateToken(userExists._id),
    });
  } else {
    response.status(401).json({ message: "Invalid email or password" });
  }
});

/**********************Logic for search User**************/
// /api/user?search=kamran here the search is params and kamran is value overall this is querry

const allUsers = asyncHandler(async (request, response) => {
  const keyword = request.query.search // taking querry from api url
    ? {
        $or: [
          { name: { $regex: request.query.search, $options: "i" } }, //checks if the 'name' field matches a regular expression.
          { email: { $regex: request.query.search, $options: "i" } },
        ],
      }
    : {};

  const findUsers = await User.find(keyword).find({
    _id: { $ne: request.user.id },
  });
  response.send(findUsers);
});

const getAllUsers = asyncHandler(async (request, response) => {
  try {
    const allUsers = await User.find(); // Fetch all users from the database
    response.status(200).json(allUsers); // Send the list of users as JSON response
  } catch (error) {
    console.error("Error retrieving user data:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

/*********************** logic for user update **********************/
const updateUserProfile = asyncHandler(async (request, response) => {
  const userId = request.user._id;
  const { name } = request.body;

  const user = await User.findById(userId);

  if (user) {
    user.name = name || user.name;
    const updatedUser = await user.save();

    response.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      picture: updatedUser.picture,
      token: generateToken(updatedUser._id),
    });
  } else {
    response.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  getAllUsers,
  updateUserProfile,
};
