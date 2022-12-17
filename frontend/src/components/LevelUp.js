import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MintButton from "./MintButton";
import TextField from "@mui/material/TextField";
import "./App.css";

export default function LevelUpCard() {
  return (
    <div className="mint-card">
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Level Up
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Level up your character once every 24 hours. First one to 75 wins.
            Level up scores will be random to all users.
          </Typography>
        </CardContent>
        <CardActions>
          <MintButton className="mint-button" />
        </CardActions>
      </Card>
    </div>
  );
}
