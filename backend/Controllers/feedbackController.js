// controllers/feedbackController.js
const asyncHandler = require("express-async-handler");
const Feedback = require("../models/feedbackModel");

const postFeedback = asyncHandler(async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    res.status(400);
    throw new Error("Please add feedback");
  }

  const newFeedback = await Feedback.create({
    user: req.user._id,
    feedback,
  });

  if (newFeedback) {
    res.status(201).json(newFeedback);
  } else {
    res.status(400);
    throw new Error("Invalid feedback data");
  }
});

module.exports = {
  postFeedback,
};
