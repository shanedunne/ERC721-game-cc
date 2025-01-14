import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import "./Component.css";
import Stack from "@mui/material/Stack";

// button to level up
export function LevelUpButton() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained">Level Up</Button>
    </Stack>
  );
}

export default function LevelUpCard({ levelUp }) {
  return (
    <div className="mint-card">
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Level Up
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Level up your character. First one to 75 wins.
            Level up scores will be random to all users.
          </Typography>
        </CardContent>
        <CardActions>
          <button className="mint-button" onClick={() => levelUp()}>
            Level Up
          </button>
        </CardActions>
      </Card>
    </div>
  );
}
