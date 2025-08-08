export enum Theme {
  NousDeux = "Nous deux",
  Confidences = "Confidences",
  Avenir = "Avenir",
}

export interface CardData {
  id: number;
  question: string;
  theme: Theme;
}

export interface SessionLog {
  id: string;
  accessCode: string;
  loginTime: string;
  endTime?: string;
  cardsViewed: number;
  players?: { player1: string, player2: string };
}

export interface PlayerData {
    player1: string;
    player2: string;
}

export interface PlayerScores {
    player1: number;
    player2: number;
}