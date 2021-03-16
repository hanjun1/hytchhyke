const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  date: String,
  time: String,
  price: Number,
  driver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  passenger: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  seats: Number,
  start: String,
  startCity: String,
  end: String,
  endCity: String,
});

module.exports = mongoose.model("Trip", tripSchema);
