const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    portfolio: {
    type: String,
    default: "",
    },

    github: {
    type: String,
    default: "",
    },

   linkedin: {
   type: String,
   default: "",
   }, 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);