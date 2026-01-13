export interface HighScore {
  name: string;
  score: number;
  level: number;
  difficulty?: string;
  date: string;
}

const STORAGE_KEY = 'nebula_maze_highscores';

export const getHighScores = (): HighScore[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load high scores', e);
    return [];
  }
};

export const saveHighScore = (name: string, score: number, level: number, difficulty: string = 'easy') => {
  const scores = getHighScores();
  const newScore: HighScore = {
    name: name.substring(0, 10) || 'Anonymous',
    score,
    level,
    difficulty,
    date: new Date().toLocaleDateString()
  };
  
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score);
  
  // Keep top 10
  const topScores = scores.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topScores));
  return topScores;
};

export const isHighScore = (score: number): boolean => {
  const scores = getHighScores();
  if (scores.length < 10) return true;
  return score > scores[scores.length - 1].score;
};
