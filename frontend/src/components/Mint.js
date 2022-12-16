import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MintButton from "./MintButton";
import TextField from "@mui/material/TextField";

export default function MintCard() {
  return (
    <Card sx={{ minWidth: 275 }} className="mint-card">
      <CardContent>
        <Typography variant="h5" component="div">
          Mint Your Character
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Mint your character to begin the race to the top
        </Typography>
      </CardContent>
      <CardActions>
        <form>
          <TextField
            id="outlined-basic"
            label="Character Name"
            variant="outlined"
          />
          <MintButton />
        </form>
      </CardActions>
    </Card>
  );
}
