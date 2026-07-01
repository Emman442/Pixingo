
export interface UserProfile {
  wallet: string;
  username: string;
  total_games: number;
  total_wins: number;
  total_score: number;
  solo_games: number;
  duel_games: number;
  royale_games: number;
  gen_earned: number;
  joined_at: string;
}



export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}


export interface Puzzle {
  puzzle_id?: string;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  theme: string;
  difficulty: string;
  answer_hint: string;
  created_by?: string;
  created_at?: string;
  is_active?: boolean;
}

export interface RoundResult {
  puzzle_id: string
  player_answer: string;
  ai_verdict: string;     // "correct" | "incorrect" | "partial"
  // ai_reasoning: string;
  score: number;
  time_taken_seconds: number;
}

export interface SoloGame {
  game_id: string;
  player: string;
  status: string;          // "active" | "completed" | "abandoned"
  current_round: string;
  total_rounds: number;
  total_score: number;
  puzzle_ids: [string];
  round_results: [RoundResult]
  started_at: string;
  completed_at: string;
}


export interface DuelGame {
  game_id: string;
  player_one: string;
  player_two: string;
  stake_gen: string;
  status: string;         // "waiting" | "active" | "completed" | "cancelled"
  current_round: number;
  total_rounds: number;
  player_one_score: number;
  player_two_score: number;
  puzzle_ids: [string];
  player_one_results: [RoundResult]
  player_two_results: [RoundResult]
  winner: string;
  started_at: string;
  completed_at: string;
}