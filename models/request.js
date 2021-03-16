const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  trip: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
  },
  timestamp: Date,
  text: String,
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  read: Boolean,
  status: String,
});

module.exports = mongoose.model("Request", requestSchema);
