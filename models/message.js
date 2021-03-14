const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  trip: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
  },
  timestamp: Date,
  text: String,
});

module.exports = mongoose.model("Message", messageSchema);
