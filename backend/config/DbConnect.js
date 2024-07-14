const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/vaultchat";

const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(connectionString, {});

    console.log(" chat app mongoDB connected");
    return connect;
  } catch (error) {
    console.error("error happened: " + error.message);
    process.exit();
  }
};

module.exports = connectDatabase;
//"mongodb+srv://kamrankhanmashwani:p2WOEY7opNoUwwWF@cluster0.ujuegs9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
