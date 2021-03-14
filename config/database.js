const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/projectX", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Connected to MongoDB on ${db.host}:${db.port}`);
});
