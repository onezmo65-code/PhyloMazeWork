import React from 'react';
import { Trophy, X } from 'lucide-react';
import { HighScore } from '../utils/leaderboardUtils';

interface LeaderboardProps {
  scores: HighScore[];
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores = [], onClose }) => {
  const safeScores = Array.isArray(scores) ? scores : [];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-yellow-500/30 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-yellow-400">
            <Trophy size={20} />
            <h2 className="font-bold text-lg uppercase tracking-wider">Hall of Fame</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {safeScores.length === 0 ? (
            <div className="text-center text-slate-500 py-8 italic">No high scores yet. Be the first!</div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-xs text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-800">
                <div className="col-span-2 text-center">Rank</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-3 text-center">Mode</div>
                <div className="col-span-3 text-right">Score</div>
              </div>
              {safeScores.map((s, i) => (
                <div key={i} className={`grid grid-cols-12 items-center py-2 border-b border-slate-800/50 ${i < 3 ? 'text-yellow-100' : 'text-slate-300'}`}>
                  <div className="col-span-2 text-center font-bold text-slate-500">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>
                  <div className="col-span-4 font-medium truncate" title={s.name}>{s.name}</div>
                  <div className="col-span-3 text-center text-[10px] uppercase text-slate-500">
                    {s.difficulty ? s.difficulty.replace('tough_', '') : 'EASY'}
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-cyan-400">{s.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-800/30 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
