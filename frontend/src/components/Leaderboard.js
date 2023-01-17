import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Component.css";
import axios from "axios";

export default function Leaderboard(props) {
  const [playersList, setPlayersList] = useState([]);

  const [groupKey, setGroupKey] = useState([]);
  // sets playerList from info from parent component

  const [objects, setObjects] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/players")
      .then((response) => {
        setPlayersList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.playersUpdated]);
  useEffect(() => {
    setGroupKey(Object.keys(playersList));
    console.log("group key check: " + groupKey);
  }, [playersList]);

  function getPlayers() {
    axios
      .get("http://localhost:3000/players")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 550 }}
      className="table-container"
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Character</TableCell>
            <TableCell align="center">Owner</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupKey.map((item, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {playersList[item].name}
              </TableCell>
              <TableCell align="right">{playersList[item].owner}</TableCell>
              <TableCell align="right">{playersList[item].score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
