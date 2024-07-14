const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
  getAllUsers,
  updateUserProfile,
} = require("../Controllers/userControllers");
const { protect } = require("../middlewares/autherizationMiddleware");

// Apply protect middleware before the route handler for getting all users
router
  .route("/")
  .post(registerUser)
  .get(protect, allUsers)
  .get(protect, getAllUsers);

router.route("/login").post(authUser);
router.route("/updateProfile").put(protect, updateUserProfile);

module.exports = router;
