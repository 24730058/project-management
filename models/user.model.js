const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
	  tokenUser: String,
    phone: String,
    avatar: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");
module.exports = User;