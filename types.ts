
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  sources?: { title: string; uri: string }[];
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface ChonkRating {
  score: number;
  verdict: string;
  humorousTake: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  ORACLE = 'ORACLE',
  RATER = 'RATER',
  TRIVIA = 'TRIVIA',
  STAKING = 'STAKING',
  TOKENOMICS = 'TOKENOMICS',
  COMMUNITY = 'COMMUNITY'
}
