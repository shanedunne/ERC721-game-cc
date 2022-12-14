import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import "./Component.css";
import Stack from "@mui/material/Stack";
import App from "../App";

// button for the mint form
const MintButton = () => {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained">Mint</Button>
    </Stack>
  );
};
const MintCard = ({ mintCharacter }) => {
  const [newName, setNewName] = useState("");
  // set name on child element to be passed as a parameter on the mintCharacter function
  const onNameChange = (event) => {
    setNewName(event.target.value);
    console.log(newName);
  };

  return (
    <div className="mint-card">
      <Card>
        <CardContent className="mint-card-inners">
          <Typography variant="h5" component="div">
            Mint Your Character
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Mint your character to begin the race to the top
          </Typography>
        </CardContent>
        <CardActions className="mint-card-form">
          <TextField
            id="outlined-basic"
            label="Character Name"
            variant="outlined"
            onChange={onNameChange}
          />
          <button
            className="mint-button"
            onClick={() => mintCharacter(newName)}
          >
            Mint
          </button>
        </CardActions>
      </Card>
    </div>
  );
};
export default MintCard;

// () => props.mintSetName("prop name");
