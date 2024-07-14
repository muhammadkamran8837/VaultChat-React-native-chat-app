const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      required: true,
      default: "defaultprofileImage.png",
    },
  },
  {
    timestamps: true,
    //The timestamps option is used to automatically add
    //createdAt and updatedAt fields to the documents in the collection.
  }
);
// checking if the entered passsword is matching the encrypted password stored in the database or not
userSchema.methods.passwordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//hashing the password before savin to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //salt is random data that is generated and combined with the actual password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});
const User = mongoose.model("User", userSchema);
module.exports = User;
