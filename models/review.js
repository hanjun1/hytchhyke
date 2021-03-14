const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
  comment: "String",
});

module.exports = mongoose.model("Review", reviewSchema);
