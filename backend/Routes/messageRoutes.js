const express = require("express");
const { protect } = require("../middlewares/autherizationMiddleware");
const {
  sendMessage,
  fetchAllMessages,
  upload,
} = require("../Controllers/messageControllers");

const router = express.Router();

router.route("/").post(protect, upload.single("file"), sendMessage);
router.route("/:chatId").get(protect, fetchAllMessages);

module.exports = router;
