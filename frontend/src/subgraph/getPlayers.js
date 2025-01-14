import { gql } from "@apollo/client";
import { client } from '../index';

// function to check if player is participating in current game session
export default async function checkPlayer(gameSession, playerAddress) {

    // define query to return addresses(owner) where gameSession is current gameSession
    const GET_PLAYERS_IN_SESSION = gql`
    query ($gameSession: String!, $first: Int!) {
      players(where: { gameSession: $gameSession }, first: $first) {
        owner
      }
    }
  `;

    try {
        const { data } = await client.query({
            query: GET_PLAYERS_IN_SESSION,
            variables: { gameSession: gameSession, first: 10 },
        });

        if (data && data.players) {
            let players = data.players;

            for (let i = 0; i < players.length; i++) {
                if (players[i].owner === playerAddress) {
                    return true
                }
            }
            return false;
        }
    } catch (error) {
        console.log("Error fetching players:", error.message);
        return false;
    }
}
