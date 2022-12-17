import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, owner, score) {
  return { name, owner, score };
}

const rows = [
  createData("Horsey", "0x00000000219ab540356cbb839cbe05303d7705fa", 33),
  createData("Pony", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 914),
  createData("Capaill", "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8", 9),
];

export default function Leaderboard() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Character</TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.owner}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
