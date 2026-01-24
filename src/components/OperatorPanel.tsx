import React from 'react';
import { Save, X } from 'lucide-react';

interface OperatorPanelProps {
  onClose: () => void;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  sfxVolume: number;
  setSfxVolume: (v: number) => void;
}

export const OperatorPanel: React.FC<OperatorPanelProps> = ({
  onClose,
  musicVolume,
  setMusicVolume,
  sfxVolume,
  setSfxVolume
}) => {

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600 w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 rounded-t-xl">
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Save className="w-5 h-5" /> Settings
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Settings Only */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Audio Settings</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Music Volume</span>
                  <span>{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Sound Effects Volume</span>
                  <span>{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
