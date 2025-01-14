import { gql } from "@apollo/client";

export const GET_WINNERS = gql`
  query GetWinners($first: Int) {
    weHaveAWinners(first: $first) {
      id
      tokenId
      owner
      characterName
      gameSession
    }
  }
`;

export const GET_GAME_SESSIONS = gql`
  query GetGameSessions($first: Int) {
    newGameSessionStarteds(first: $first) {
      id
      gameSession
    }
  }
`;

export const GET_PLAYERS = gql`
  query GetPlayers($first: Int) {
    playerAddeds(first: $first) {
      id
      owner
      characterName
      currentLevel
      gameSession
    }
  }
`;

export const GET_LEVEL_UP_EVENTS = gql`
  query GetLevelUpEvents($first: Int) {
    levelUpEvents(first: $first) {
      id
      owner
      characterName
      currentLevel
      gameSession
    }
  }
`;

export const GET_PLAYERS_IN_SESSION = gql`
  query GetPlayersInSession($session: String!, $first: Int!) {
    players(
      where: { gameSession: $session }
      first: $first
      orderBy: currentLevel
      orderDirection: desc
    ) {
      id
      owner
      characterName
      currentLevel
      gameSession
    }
  }
`;