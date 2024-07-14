const express = require("express");
const path = require("path"); // Import path module

const app = express();
const cors = require("cors");
const connectDatabase = require("./config/DbConnect");
const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require("./Routes/chatRoutes.js");
const messageRoutes = require("./Routes/messageRoutes.js");
const feedbackRoutes = require("./Routes/feedbackRoutes.js");

app.use(cors());
connectDatabase();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the uploads directory

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = 8000;
const server = app.listen(8000, () => {
  console.log(`server running on port ${PORT}`);
});

// SOCKET.IO WORK
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8081",
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("user with id " + userData._id + " has connected");

    // Add user to onlineUsers
    onlineUsers[userData._id] = true;

    // Emit to all clients that the user is online
    io.emit("user online", userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("user joined room " + roomId);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat; // to which chat does the new message belongs to
    if (!chat.users) return console.log("chat.users not defined"); // if the chat doesnt have any users
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return; //if the newMessageRecieved is sent by me , then no need to send back to me , just return
      socket.in(user._id).emit("message recieved", newMessageRecieved); // .in() function  send a message or emit an event to all clients in a specific room.
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Find the disconnected user and remove from onlineUsers
    for (const userId in onlineUsers) {
      if (socket.rooms.has(userId)) {
        delete onlineUsers[userId];
        io.emit("user offline", userId);
      }
    }
  });

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("user with id " + userData._id + " has connected");

    // Add user to onlineUsers
    onlineUsers[userData._id] = true;

    // Emit to all clients that the user is online
    io.emit("user online", userData._id);

    socket.emit("connected");
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);

    // Remove user from onlineUsers
    delete onlineUsers[userData._id];
    io.emit("user offline", userData._id);
  });
});
