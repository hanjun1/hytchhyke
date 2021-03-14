const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // add regex to username, password, name
  username: String,
  password: String,
  name: String,
});

module.exports = mongoose.model("User", userSchema);
