/*
  # Create game scores table

  1. New Tables
    - `game_scores`
      - `id` (bigint, primary key, auto-increment)
      - `score` (integer, not null) - The score achieved in the game
      - `created_at` (timestamptz, default now()) - When the score was recorded
  
  2. Security
    - Enable RLS on `game_scores` table
    - Add policy to allow anyone to insert scores (public game)
    - Add policy to allow anyone to read scores (public leaderboard)
  
  3. Indexes
    - Add index on `score` for efficient leaderboard queries
    - Add index on `created_at` for time-based queries
*/

CREATE TABLE IF NOT EXISTS game_scores (
  id bigserial PRIMARY KEY,
  score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert scores"
  ON game_scores
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view scores"
  ON game_scores
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at DESC);
