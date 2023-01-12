import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Component.css";

export default function Leaderboard(props) {
  const [playersList, setPlayersList] = useState(props.players);

  const [groupKey, setGroupKey] = useState([]);
  useEffect(() => {
    setPlayersList(props.players);
    console.log("test adding players" + playersList);
  });
  useEffect(() => {
    setGroupKey(Object.keys(playersList));
  }, [playersList]);
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
                {item.name}
              </TableCell>
              <TableCell align="right">{item.owner}</TableCell>
              <TableCell align="right">{item.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
