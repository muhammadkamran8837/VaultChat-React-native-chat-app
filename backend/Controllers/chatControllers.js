const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

/************************************************************************************** */
/************accessing a chat or creating a new one if it doesn't exist.******************/
/************************************************************************************** */

const accessChat = asyncHandler(async (request, response) => {
  const { userId } = request.body; //current user will send us this id
  //checks if user id is present in request body
  if (!userId) {
    console.log("userid param not sent with request");
    return response.sendStatus(400);
  }
  /****** Querying for Existing Chat Room*********/
  var existingChat = await Chat.find({
    isGroupChat: false,
    /**If request.user._id is "userA" and userId is "userB,"
     the query would find a chat room where both "userA" 
     and "userB" are participants in the users array */
    $and: [
      {
        //request.user is authorized and authenticated user that wants to create a chat with someone
        users: { $elemMatch: { $eq: request.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  existingChat = await User.populate(existingChat, {
    path: "latestMessage.sender", //populate the "sender" field within the "latestMessage" field
    select: "name pic email",
  });
  /**Checking if Chat Room Exists */
  if (existingChat.length > 0) {
    response.status(200).json(existingChat[0]);
  } else {
    var newChatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [request.user._id, userId],
    };
  }
  /***Creating New Chat ********/
  try {
    const newCeatedChat = await Chat.create(newChatData);
    const fullChat = await Chat.findOne({ _id: newCeatedChat._id }).populate(
      "users",
      "-password"
    );
    response.status(200).send(fullChat);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

/************************************************************************************** */
/****************************Logic for Fetch Chats***************************************/
/************************************************************************************** */
const fetchChats = asyncHandler(async (request, response) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: request.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        // results = await User.populate(results, {
        //   path: "latestMessage.sender",
        //   select: "name pic email",
        // });

        response.status(200).send(results);
      });
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

/************************************************************************************** */
/****************************Logic for Create Group Chat********************************/
/************************************************************************************** */

const createGroupChat = asyncHandler(async (request, response) => {
  if (!request.body.users || !request.body.name) {
    return response
      .status(400)
      .send({ message: "please fill all the fields required" });
  }
  var users = JSON.parse(request.body.users); // converting json string to javascript object
  if (users.length < 2) {
    response
      .status(400)
      .send({ message: "more than two users required to create a group chat" });
  }

  users.push(request.user);

  try {
    const groupChat = await Chat.create({
      chatName: request.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: request.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    response.status(200).json(fullGroupChat);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

/************************************************************************************** */
/****************************Logic for Renaming Group Chat********************************/
/************************************************************************************** */

const renameGroupChat = asyncHandler(async (request, response) => {
  const { chatId, chatName } = request.body;
  const updatedGroupChatName = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroupChatName) {
    response.status(404).json({ error: "The chat is not found" });
  } else {
    response.json(updatedGroupChatName);
  }
});

/************************************************************************************** */
/****************************Logic for add user to group********************************/
/************************************************************************************** */

const addToGroup = asyncHandler(async (request, response) => {
  const { chatId, userId } = request.body;
  const newUserAdded = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!newUserAdded) {
    response.status(404);
    throw new Error("chat not found");
  } else {
    response.json(newUserAdded);
  }
});

/************************************************************************************** */
/****************************Logic for remove user from group********************************/
/************************************************************************************** */

const removeFromGroup = asyncHandler(async (request, response) => {
  const { chatId, userId } = request.body;
  const userRemoved = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!userRemoved) {
    response.status(404);
    throw new Error("chat not found");
  } else {
    response.json(userRemoved);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
