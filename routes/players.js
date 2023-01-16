app.get("/players/:id", (req, res) => {
  PlayerModel.findById(req.params.id, (err, player) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(player);
    }
  });
});
