const mongoose = require("mongoose");
require("./server");

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.g6vlacc.mongodb.net/?retryWrites=true&w=majority`
);
mongoose.set("debug", true);
