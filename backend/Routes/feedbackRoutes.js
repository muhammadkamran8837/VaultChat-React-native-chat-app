// routes/feedbackRoutes.js
const express = require("express");
const { protect } = require("../middlewares/autherizationMiddleware");
const { postFeedback } = require("../Controllers/feedbackController");

const router = express.Router();

router.route("/").post(protect, postFeedback);

module.exports = router;
