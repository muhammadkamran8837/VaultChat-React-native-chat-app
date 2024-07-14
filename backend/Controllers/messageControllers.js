const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const sendMessage = asyncHandler(async (request, response) => {
  const { content, chatId } = request.body;

  if (!content && !chatId && !request.file) {
    console.log(
      "Incomplete information passed, (missing content, chatId, or file)"
    );
    response.status(400);
    throw new Error(
      "Incomplete information passed (missing content, chatId, or file)"
    );
  }

  // Creating new message object
  var newMessage = {
    sender: request.user._id,
    content: content || "",
    chat: chatId,
  };

  if (request.file) {
    if (request.file.mimetype.startsWith("image/")) {
      newMessage.image = request.file.path;
    } else {
      newMessage.document = request.file.path;
    }
  }

  // Query to database
  try {
    var message = await Message.create(newMessage);
    message = await message.populate({ path: "sender", select: "name pic" });
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(request.body.chatId, {
      latestMessage: message,
    });

    response.json(message);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});
// Logic for fetchAllMessages
const fetchAllMessages = asyncHandler(async (request, response) => {
  try {
    const allMessages = await Message.find({
      chat: request.params.chatId,
    })
      .populate({ path: "sender", select: "name pic email" })
      .populate({ path: "chat" });
    response.json(allMessages);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, fetchAllMessages, upload };
