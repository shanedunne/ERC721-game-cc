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
import { GET_PLAYERS } from "../subgraph/queries";
import { useQuery } from '@apollo/client';


export default function Leaderboard() {
  const [playersList, setPlayersList] = useState([]);
  const [groupKey, setGroupKey] = useState([]);


  const { loading, error, data } = useQuery(GET_PLAYERS);

  useEffect(() => {
    if(!loading && data) {
      console.log("fetching data from the subgraph: " + data.playerAddeds)
      setPlayersList(data.playerAddeds)

      console.log("playerlIST: " + playersList)
    }



  }, [loading, data]);

  if(loading) console.log("fetching players from graph");
  if (error) console.log("error fetching players");



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
          {playersList.map((player, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {player.characterName}
              </TableCell>
              <TableCell align="right">{player.owner}</TableCell>
              <TableCell align="right">{player.currentLevel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
