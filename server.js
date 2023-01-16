const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost:27017/mydb", { useNewUrlParser: true });

// Create a Mongoose schema for the object you want to insert
const playerSchema = new mongoose.Schema({
  name: String,
  owner: String,
  score: String,
});

// Create a Mongoose model for the player
const PlayerModel = mongoose.model("Player", playerSchema);

app.use(bodyParser.json());

app.post("/players", (req, res) => {
  // Create a new instance of the ObjectModel using the data from the request body
  const newPlayer = new PlayerModel(req.body);

  // Save the new object to the database
  newPlayer.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Player successfully inserted into the database.");
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
