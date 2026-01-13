import React, { useState } from 'react';
import { User, KeyRound, X } from 'lucide-react';

interface SignupPromptProps {
  onSignup: (nickname: string, pin: string) => void;
  onSkip: () => void;
}

export const SignupPrompt: React.FC<SignupPromptProps> = ({ onSignup, onSkip }) => {
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname && pin.length === 4) {
      onSignup(nickname, pin);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-6 shadow-2xl relative">
        <button onClick={onSkip} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 mb-3">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Save Your Progress</h2>
          <p className="text-sm text-slate-400 mt-1">Create a nickname and PIN to track your stats.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 ml-1">Nickname</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="CoolExplorer"
                required
                maxLength={12}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1 ml-1">4-Digit PIN</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={pin}
                onChange={handlePinChange}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none font-mono tracking-widest"
                placeholder="0000"
                required
                pattern="\d{4}"
                inputMode="numeric"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all"
            disabled={!nickname || pin.length !== 4}
          >
            Create Profile
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-300 underline">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
