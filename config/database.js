const mongoose = require("mongoose");

console.log(process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Connected to MongoDB on ${db.host}:${db.port}`);
});
