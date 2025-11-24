
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
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

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  ORACLE = 'ORACLE',
  RATER = 'RATER',
  STAKING = 'STAKING'
}
