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
import { GET_PLAYERS_IN_SESSION } from "../subgraph/queries";
import { useQuery } from '@apollo/client';


export default function Leaderboard() {
  let currentSession = "1";
  const [playersList, setPlayersList] = useState([]);


  const { loading, error, data } = useQuery(GET_PLAYERS_IN_SESSION, {
    variables: {
      session: currentSession,
      first: 10
    },
    // pollInterval: 10000
  });

  useEffect(() => {
    if(!loading && data && data.players) {
      console.log("fetching data from the subgraph")
      setPlayersList(data.players)
      console.log(playersList)
    }



  }, [loading, data]);

  if(loading) console.log("fetching players from graph");
  if (error) console.log("error fetching players: ", error.message, error.graphQLErrors);



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
              <TableCell align="right">{player.gameSession}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
