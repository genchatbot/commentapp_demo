const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  password: { type: String, required: false },
  username: { type: String, required: true },
  email: { type: String, required: true },
  resetToken:String,
  expireToken:Date
},
  {timestamps: {createdAt: 'created_at'}}
);

module.exports = mongoose.model("User", UserSchema);