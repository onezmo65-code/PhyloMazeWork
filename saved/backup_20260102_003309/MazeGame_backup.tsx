import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Map as MapIcon, Shield, RefreshCw, Sparkles, AlertTriangle, Skull, Flame, CloudFog, Snowflake, HelpCircle, Settings, Trophy, Menu, X, Backpack, CheckSquare, Play, User
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { 
  generateMaze, LEVEL_CONFIG, ItemType, Direction, Cell, ItemTypeValues, Theme 
} from '../utils/mazeUtils';
import { getRandomQuestion, checkAnswer, Question, registry } from '../utils/questionUtils';
import { Leaderboard } from './Leaderboard';
import { getHighScores, saveHighScore, isHighScore } from '../utils/leaderboardUtils';
import { PlayerAvatar, AvatarType } from './PlayerAvatar';
import { OperatorPanel } from './OperatorPanel';
import { Paywall } from './Paywall';
import { AdInterstitial } from './AdInterstitial';
import { SignupPrompt } from './SignupPrompt';
import { MusicPlayer } from './MusicPlayer';
import encounters from '../data/encounters.json';
import academicQuestions from '../data/academicQuestions.json';

// --- CONSTANTS ---
const VISIBILITY_RADIUS = 1;

const ITEMS_CONFIG = {
  [ItemType.Health]: { char: '💊', color: 'text-red-500', name: 'Health Pack' },
  [ItemType.Score]: { char: '💎', color: 'text-cyan-400', name: 'Gem' },
  [ItemType.Hazard]: { char: '🐍', color: 'text-green-600', name: 'Hazard' },
  [ItemType.Weapon]: { char: '🗡️', color: 'text-slate-300', name: 'Dagger' },
  [ItemType.Exit]: { char: '🚪', color: 'text-yellow-500', name: 'Exit' },
  [ItemType.Start]: { char: 'S', color: 'text-white', name: 'Start' },
  [ItemType.Empty]: { char: '', color: '', name: '' },
  [ItemType.Fire]: { char: '🔥', color: 'text-orange-500', name: 'Bushfire' },
  [ItemType.Fumes]: { char: '💨', color: 'text-purple-500', name: 'Toxic Fumes' },
  [ItemType.IceCube]: { char: '🧊', color: 'text-blue-300', name: 'Ice Cube' },
  [ItemType.CO2]: { char: '☁️', color: 'text-gray-400', name: 'CO2 Canister' },
  [ItemType.Antivenom]: { char: '💉', color: 'text-emerald-400', name: 'Antivenom' },
  [ItemType.Robber]: { char: '🦹', color: 'text-purple-600', name: 'Robber' },
  // Specific Hazards
  [ItemType.Snake]: { char: '🐍', color: 'text-green-500', name: 'Snake' },
  [ItemType.Quicksand]: { char: '🏜️', color: 'text-yellow-700', name: 'Quicksand' },
  [ItemType.Bees]: { char: '🐝', color: 'text-yellow-400', name: 'Swarm of Bees' },
  [ItemType.Meteor]: { char: '☄️', color: 'text-orange-600', name: 'Meteor Storm' },
  [ItemType.Aliens]: { char: '👽', color: 'text-green-400', name: 'Violent Alien' },
  [ItemType.Bear]: { char: '🐻', color: 'text-amber-800', name: 'Bear' },
  // New Items
  [ItemType.Water]: { char: '💧', color: 'text-blue-400', name: 'Water' },
  [ItemType.Bandage]: { char: '🩹', color: 'text-white', name: 'Bandage' },
  [ItemType.Herb]: { char: '🌿', color: 'text-green-400', name: 'Herb' },
  [ItemType.Honey]: { char: '🍯', color: 'text-yellow-400', name: 'Honey' },
  [ItemType.Rope]: { char: '🧶', color: 'text-orange-300', name: 'Rope' },
  [ItemType.Stick]: { char: '🪵', color: 'text-orange-800', name: 'Stick' },
  [ItemType.Teamwork]: { char: '🤝', color: 'text-pink-400', name: 'Teamwork' },
  [ItemType.ShieldGenerator]: { char: '🛡️', color: 'text-cyan-300', name: 'Shield Generator' },
  [ItemType.EvasiveManeuver]: { char: '💨', color: 'text-white', name: 'Evasive Maneuver' },
  [ItemType.NegotiationItem]: { char: '📜', color: 'text-yellow-200', name: 'Treaty' },
  [ItemType.RadiationShield]: { char: '☢️', color: 'text-green-300', name: 'Rad Shield' },
  [ItemType.OxygenTank]: { char: '🤿', color: 'text-blue-500', name: 'Oxygen Tank' },
  [ItemType.OxygenMask]: { char: '😷', color: 'text-white', name: 'Oxygen Mask' },
  [ItemType.Root]: { char: '🥕', color: 'text-orange-600', name: 'Root' },
  [ItemType.Trap]: { char: '🪤', color: 'text-slate-400', name: 'Trap' },
  [ItemType.Shelter]: { char: '⛺', color: 'text-green-700', name: 'Shelter' },
  [ItemType.PharmacyPack]: { char: '🎒', color: 'text-red-400', name: 'Pharmacy Pack' },
  [ItemType.Sunscreen]: { char: '🧴', color: 'text-yellow-100', name: 'Sunscreen' },
  [ItemType.LifeJacket]: { char: '🦺', color: 'text-orange-500', name: 'Life Jacket' },
  [ItemType.Ventilation]: { char: '🌬️', color: 'text-blue-200', name: 'Ventilation' },
  [ItemType.Helmet]: { char: '⛑️', color: 'text-red-600', name: 'Helmet' },
  [ItemType.Shield]: { char: '🛡️', color: 'text-slate-300', name: 'Shield' },
  [ItemType.Money]: { char: '💰', color: 'text-yellow-400', name: 'Money' },
  [ItemType.ReflexBoost]: { char: '⚡', color: 'text-yellow-300', name: 'Reflex Boost' },
  [ItemType.Dodge]: { char: '🏃', color: 'text-white', name: 'Dodge' },
  [ItemType.HealthBerries]: { char: '🍒', color: 'text-red-500', name: 'Health Berries' },
  [ItemType.FlowerPollen]: { char: '🌻', color: 'text-yellow-300', name: 'Flower Pollen' },
  [ItemType.GameMeat]: { char: '🍖', color: 'text-orange-700', name: 'Game Meat' },
  [ItemType.Syringe]: { char: '💉', color: 'text-slate-200', name: 'Syringe' },
  [ItemType.PoisonBerries]: { char: '🫐', color: 'text-purple-800', name: 'Poison Berries' },
};

const SCENERY_IMAGES = [
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHwxfHxnYWxheHl8ZW58MHx8fHwxNzY2MDAyMjg3fDA&ixlib=rb-4.1.0&q=80&w=1080", // Galaxy
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHw0fHx1bml2ZXJzZXxlbnwwfHx8fDE3NjYwMDIyODd8MA&ixlib=rb-4.1.0&q=80&w=1080", // Universe
  "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHw4fHxzb2xhciUyMHN5c3RlbXxlbnwwfHx8fDE3NjYwMDIyODd8MA&ixlib=rb-4.1.0&q=80&w=1080", // Solar System
  "https://images.unsplash.com/photo-1648851367298-c83e035dd235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHwzfHxibHVlJTIwc2t5JTIwY2xvdWRzJTIwZGF5fGVufDB8fHx8MTc2NjAwMjI4N3ww&ixlib=rb-4.1.0&q=80&w=1080", // Day Sky
  "https://images.unsplash.com/photo-1502957291543-d85480254bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHNreSUyMHN0YXJzfGVufDB8fHx8MTc2NjAwMjI4N3ww&ixlib=rb-4.1.0&q=80&w=1080", // Night Sky
  "https://images.unsplash.com/photo-1610044847457-f6aabcbb67d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBuYXR1cmV8ZW58MHx8fHwxNzY2MDAyMjg3fDA&ixlib=rb-4.1.0&q=80&w=1080", // Waterfalls
  "https://images.unsplash.com/photo-1551143404-5672b325d6b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHw3fHxyaXZlciUyMHNob3JlbGluZXxlbnwwfHx8fDE3NjYwMDIyODd8MA&ixlib=rb-4.1.0&q=80&w=1080", // River Shoreline
  "https://images.unsplash.com/photo-1503755356442-db57841b13f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHw2fHxvY2VhbiUyMHNob3JlbGluZXxlbnwwfHx8fDE3NjYwMDIyODd8MA&ixlib=rb-4.1.0&q=80&w=1080", // Ocean Shoreline
  "https://images.unsplash.com/photo-1691222691453-b32eba6f451e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHwxfHxzZWElMjBzaG9yZWxpbmV8ZW58MHx8fHwxNzY2MDAyMjg3fDA&ixlib=rb-4.1.0&q=80&w=1080", // Sea Shoreline
  "https://images.unsplash.com/photo-1688693155385-53e3662534e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHw1fHxwb25kJTIwc2hvcmVsaW5lfGVufDB8fHx8MTc2NjAwMjI4N3ww&ixlib=rb-4.1.0&q=80&w=1080"  // Pond Shoreline
];

const THEME_COLORS: Record<Theme, string> = {
  dungeon: 'bg-gradient-to-br from-purple-900 to-slate-800',
  orchard: 'bg-gradient-to-br from-lime-700 to-green-600',
  farm: 'bg-gradient-to-br from-amber-600 to-yellow-700',
  vacation: 'bg-gradient-to-br from-cyan-400 to-blue-600',
  forest: 'bg-gradient-to-br from-emerald-600 to-green-800',
  ocean: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  cartoon: 'bg-gradient-to-br from-pink-500 to-purple-600',
  galaxy: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
};

const THEME_IMAGES: Record<Theme, string[]> = {
  dungeon: [],
  orchard: [],
  farm: [],
  vacation: [],
  forest: [],
  ocean: [],
  cartoon: [
    'https://images.unsplash.com/photo-1725621504723-650753ae3994?auto=format&fit=crop&w=1080',
    'https://images.unsplash.com/photo-1759390304300-2acfaf1db11a?auto=format&fit=crop&w=1080',
    'https://images.unsplash.com/photo-1741038273267-82518165fd35?auto=format&fit=crop&w=1080'
  ],
  galaxy: [],
};

// --- AUDIO SERVICE ---
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  return audioCtx;
};

const playAudioService = (type: 'step' | 'bump' | 'pickup' | 'hazard' | 'levelUp' | 'die' | 'correct' | 'wrong' | 'doorbell' | 'churchBell' | 'gong' | 'cheer' | 'railCrossing' | 'bleep', volumeScale: number = 1.0) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const masterGain = ctx.createGain();

  osc.connect(gain);
  gain.connect(masterGain);
  masterGain.connect(ctx.destination);
  
  masterGain.gain.value = volumeScale;

  const now = ctx.currentTime;

  switch (type) {
    case 'step':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    case 'bump':
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'pickup':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    case 'hazard':
      // Siren: Alternating high/low (Police/Hospital style)
      osc.type = 'triangle';
      const startTime = now;
      
      // First tone (High)
      osc.frequency.setValueAtTime(880, startTime); // A5
      osc.frequency.setValueAtTime(880, startTime + 0.3);
      
      // Second tone (Low)
      osc.frequency.setValueAtTime(659, startTime + 0.3); // E5
      osc.frequency.setValueAtTime(659, startTime + 0.6);
      
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.55);
      gain.gain.linearRampToValueAtTime(0, startTime + 0.6);
      
      osc.start(startTime);
      osc.stop(startTime + 0.6);
      break;
    case 'levelUp':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(600, now + 0.1);
      osc.frequency.setValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    case 'die':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 1);
      osc.start(now);
      osc.stop(now + 1);
      break;
    case 'correct':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'wrong':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'doorbell':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      osc.start(now);
      osc.stop(now + 1);
      setTimeout(() => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.type = 'sine';
        o2.frequency.setValueAtTime(480, now + 0.6);
        g2.gain.setValueAtTime(0.1, now + 0.6);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 2);
        o2.start(now + 0.6);
        o2.stop(now + 2);
      }, 600);
      break;
    case 'churchBell':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);
      osc.start(now);
      osc.stop(now + 3);
      break;
    case 'gong':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
      osc.start(now);
      osc.stop(now + 4);
      break;
    case 'railCrossing':
      for(let i=0; i<4; i++) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(800, now + i*0.5);
        g.gain.setValueAtTime(0.1, now + i*0.5);
        g.gain.exponentialRampToValueAtTime(0.001, now + i*0.5 + 0.3);
        o.start(now + i*0.5);
        o.stop(now + i*0.5 + 0.3);
      }
      break;
    case 'cheer':
      [440, 554, 659, 880].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + i*0.1);
        g.gain.setValueAtTime(0.1, now + i*0.1);
        g.gain.linearRampToValueAtTime(0, now + i*0.1 + 2);
        o.start(now + i*0.1);
        o.stop(now + i*0.1 + 2);
      });
      break;
    case 'bleep':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
  }
};

const CURRENCY_IMAGES = [
  "https://images.unsplash.com/photo-1764865987459-b4d7f9f1e16d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1764865988356-45369f310813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1579287953053-7bded5d8adb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1570787019255-5f4e02414dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
];

// --- LAUNCHER COMPONENT ---
const Launcher = ({ 
  onStart, 
  onReset,
  difficulty, 
  setDifficulty, 
  playerIcon, 
  setPlayerIcon 
}: { 
  onStart: () => void, 
  onReset: () => void,
  difficulty: 'easy' | 'hard' | 'tough_genius', 
  setDifficulty: (d: 'easy' | 'hard' | 'tough_genius') => void,
  playerIcon: AvatarType,
  setPlayerIcon: (i: AvatarType) => void
}) => {
  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 animate-in fade-in overflow-y-auto"
      style={{
        backgroundColor: "#add8e6" // Light Blue
      }}>
      <div className="max-w-md w-full space-y-6 text-center my-auto">
        <div>
          <h1
            className="text-4xl font-black mb-2 text-slate-900"
            style={{
              // Removed inline color to use Tailwind class for better contrast
            }}>
            NEBULA MAZE
          </h1>
          <p className="text-slate-700 font-bold">Fog of War • Survival • Trivia</p>
        </div>

        {/* Commercial/Advert Link Area */}
        <div className="bg-white/50 p-4 rounded-xl border border-white/50 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Sponsored</div>
          {/* Fallback to Currency Notes if no ad (simulated) */}
          <div className="grid grid-cols-2 gap-2">
            {CURRENCY_IMAGES.slice(0, 2).map((img, i) => (
              <div key={i} className="aspect-video rounded-lg overflow-hidden bg-slate-200 relative group">
                <img src={img} alt="Currency" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                    View Offer
                  </span>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="block mt-2 text-xs text-blue-600 hover:underline font-medium">
            Visit our partners for exclusive deals
          </a>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 space-y-6 shadow-xl"
        >
          {/* Difficulty Selector */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'hard', 'tough_genius'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2 px-1 rounded-lg text-sm font-bold capitalize transition-all
                    ${difficulty === d 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' 
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                >
                  {d.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Explorer Icon</label>
            <div className="flex justify-center gap-4">
              {(['boy', 'girl', 'cat', 'dog', 'car'] as const).map((icon) => (
                <button
                  key={icon}
                  onClick={() => setPlayerIcon(icon)}
                  className={`p-2 rounded-xl transition-all border-2 
                    ${playerIcon === icon 
                      ? 'border-cyan-500 bg-cyan-500/10 scale-110' 
                      : 'border-transparent hover:bg-slate-200'}`}
                >
                  <PlayerAvatar type={icon} className="w-10 h-10" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-black text-lg shadow-xl shadow-cyan-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            START ADVENTURE
          </button>
          
          <button
            onClick={onReset}
            className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Reset Progress (Debug)
          </button>
        </div>
      </div>
    </div>
  );
};

const GAME_VERSION = '1.7.2';

export const MazeGame: React.FC = () => {
  const [sceneryIndex, setSceneryIndex] = useState(0);

  // Cycle scenery images
  useEffect(() => {
    const interval = setInterval(() => {
      setSceneryIndex(prev => (prev + 1) % SCENERY_IMAGES.length);
    }, 30000); // Change every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Cycle yellow accent color
  useEffect(() => {
    const interval = setInterval(() => {
      const root = document.documentElement;
      // Subtle shift between yellow-300 and yellow-400
      const colors = ['#fde047', '#facc15', '#fef08a', '#eab308'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      root.style.setProperty('--cell-bg-color', randomColor);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  // --- STATE ---
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [hp, setHp] = useState(100);
  const [score, setScore] = useState(0);
  const [bag, setBag] = useState<ItemTypeValues[]>([]);
  const [messageLog, setMessageLog] = useState<string[]>(['Welcome to the Nebula Maze!']);
  const [level, setLevel] = useState(1);
  const [theme, setTheme] = useState<Theme>('dungeon');
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'alert' | 'question' | 'gameOver' | 'levelComplete' | 'inventory';
    title: string;
    message?: string;
    question?: Question;
    hazardType?: string;
    onConfirm?: (answer?: any) => void;
  }>({ isOpen: false, type: 'alert', title: '' });
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showOperator, setShowOperator] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<{ level: number, score: number }[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [encounteredHazards, setEncounteredHazards] = useState<string[]>([]);

  // Monetization & Settings State
  const [runCount, setRunCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Stores Nickname now
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'hard' | 'tough_genius'>('easy');
  const [playerIcon, setPlayerIcon] = useState<AvatarType>('boy');
  const [textAnswer, setTextAnswer] = useState('');
  const [postAdAction, setPostAdAction] = useState<(() => void) | null>(null);

  // Audio State
  const [musicVolume, setMusicVolume] = useState(0.1);
  const [sfxVolume, setSfxVolume] = useState(0.3);

  const playSound = useCallback((type: Parameters<typeof playAudioService>[0]) => {
    playAudioService(type, sfxVolume);
  }, [sfxVolume]);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- INIT ---
  useEffect(() => {
    const init = async () => {
      await registry.load();
      // Add academic questions to registry
      academicQuestions.forEach(q => registry.add(q as Question));
    };
    init();

    // Version Check for Reset
    const savedVersion = localStorage.getItem('gameVersion');
    if (savedVersion !== GAME_VERSION) {
      // New version, reset progress to ensure free games work
      localStorage.removeItem('runCount');
      localStorage.removeItem('adWatched');
      // Keep high scores and email if desired, but for now let's keep it simple
      // localStorage.removeItem('isPremium'); // Maybe keep premium?
      // Let's just reset runCount and adWatched to fix the flow issue
      setRunCount(0);
      setAdWatched(false);
      localStorage.setItem('gameVersion', GAME_VERSION);
    } else {
      const savedRunCount = localStorage.getItem('runCount');
      const savedPremium = localStorage.getItem('isPremium');
      const savedEmail = localStorage.getItem('userEmail');
      if (savedRunCount) setRunCount(parseInt(savedRunCount));
      if (savedPremium === 'true') setIsPremium(true);
      if (savedEmail) setUserEmail(savedEmail);
    }
  }, []);

  const checkAndStartLevel = (lvl: number) => {
    // Paywall Logic: Check if we should show paywall (After Game 3+)
    // Note: runCount is incremented only in handleLauncherStart (new game sessions)
    // This function handles level progression within the same game session
    // CRITICAL: First 2 games (runCount 1 and 2) are ALWAYS FREE - no paywall, no ads
    if (!isPremium && !adWatched && runCount >= 3) {
      setShowPaywall(true);
      return;
    }

    // Consume Ad if used (only for game 3+)
    if (adWatched && runCount >= 3) setAdWatched(false);

    startLevel(lvl);
  };

  const handleLauncherStart = () => {
    // CRITICAL: First 2 games are FREE
    // runCount 0 -> increment to 1 -> Game 1 (FREE)
    // runCount 1 -> increment to 2 -> Game 2 (FREE)
    // runCount 2 -> Show Paywall -> Game 3+ (REQUIRES AD/SUBSCRIPTION)

    if (runCount >= 2 && !isPremium && !adWatched) {
      // User has played 2 games already, show paywall for game 3+
      setShowPaywall(true);
    } else {
      // User is on game 1 or 2, or has unlocked via ad/subscription
      setRunCount(c => {
        const newCount = c + 1;
        localStorage.setItem('runCount', newCount.toString());
        return newCount;
      });

      // Consume Ad if used
      if (adWatched) setAdWatched(false);

      startLevel(1);
      setShowLauncher(false);
    }
  };

  const handleReset = () => {
    setRunCount(0);
    localStorage.setItem('runCount', '0');
    setAdWatched(false);
    setIsPremium(false);
    localStorage.removeItem('isPremium');
    alert("Progress Reset!");
  };

  const handlePaywallUnlock = (method: 'ad' | 'sub_weekly' | 'sub_monthly' | 'sub_yearly') => {
    if (method.startsWith('sub')) {
      setIsPremium(true);
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('subscriptionType', method);
    } else {
      setAdWatched(true);
    }
    setShowPaywall(false);
    // Don't auto-start, let them click Start again or auto-start if they were blocked
    // Better UX: Auto start if they were clicking start
    // But for now, just close paywall and let them click start.
  };

  const handleSignup = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    setShowSignup(false);
    if (isNewHighScore) {
      saveHighScore(email, score, level, difficulty);
      setShowLeaderboard(true);
    }
  };

  const [showLauncher, setShowLauncher] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // --- THEME BACKGROUND ---
  useEffect(() => {
    const images = THEME_IMAGES[theme];
    if (images && images.length > 0) {
      setBackgroundImage(images[Math.floor(Math.random() * images.length)]);
    } else {
      setBackgroundImage(null);
    }
  }, [theme]);

  // --- ALERT SOUND ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modal.isOpen && (modal.type === 'question' || modal.type === 'inventory')) {
      const playAlert = () => playSound('hazard');
      playAlert();
      interval = setInterval(playAlert, 500);
    }
    return () => clearInterval(interval);
  }, [modal.isOpen, modal.type]);

  const startLevel = (lvl: number) => {
    const config = LEVEL_CONFIG[lvl] || LEVEL_CONFIG[5];
    setTheme(config.theme);
    
    const { grid: newGrid, startPos } = generateMaze(config.w, config.h, config.shape, difficulty);
    
    setGrid(newGrid);
    setPlayerPos(startPos);
    setLevel(lvl);
    
    // Add 3 random unique items every level
    const starterItems = [ItemType.Health, ItemType.Weapon, ItemType.Antivenom, ItemType.IceCube, ItemType.CO2, ItemType.Water, ItemType.Rope, ItemType.Shield];
    const newItems: ItemTypeValues[] = [];
    while(newItems.length < 3) {
      const item = starterItems[Math.floor(Math.random() * starterItems.length)];
      if (!newItems.includes(item)) {
        newItems.push(item);
      }
    }
    setBag(prev => [...prev, ...newItems]);

    if (lvl === 1) {
      setHp(100);
      setScore(0);
      setScoreHistory([]);
      setMessageLog(['Welcome to the Nebula Maze!', 'You received 3 starter items. Good luck!']);
    } else {
      addLog(`Level ${lvl} started! +3 Items`);
    }
    
    updateVisibility(newGrid, startPos.x, startPos.y);
    playSound('levelUp');
    
    setScoreHistory(prev => [...prev, { level: lvl, score }]);
  };

  const updateVisibility = (currentGrid: Cell[][], px: number, py: number) => {
    const newGrid = [...currentGrid];
    const h = newGrid.length;
    const w = newGrid[0].length;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        newGrid[y][x].visible = false;
        const dist = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2));
        if (dist <= VISIBILITY_RADIUS) {
          newGrid[y][x].seen = true;
          newGrid[y][x].visible = true;
        }
      }
    }
    setGrid(newGrid);
  };

  const addLog = (msg: string) => {
    setMessageLog(prev => [msg, ...prev].slice(0, 50));
  };

  // --- MOVEMENT ---
  const move = useCallback((dx: number, dy: number) => {
    if (modal.isOpen || grid.length === 0 || !grid[0]) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX < 0 || newX >= grid[0].length || newY < 0 || newY >= grid.length) {
      playSound('bump');
      return;
    }

    const currentCell = grid[playerPos.y]?.[playerPos.x];
    const targetCell = grid[newY]?.[newX];

    if (!currentCell || !targetCell) {
      playSound('bump');
      return;
    }

    // Check Walls
    let blocked = false;
    if (dx === 1 && (currentCell.walls & Direction.E)) blocked = true;
    if (dx === -1 && (currentCell.walls & Direction.W)) blocked = true;
    if (dy === 1 && (currentCell.walls & Direction.S)) blocked = true;
    if (dy === -1 && (currentCell.walls & Direction.N)) blocked = true;

    if (blocked || !targetCell.valid) {
      playSound('bump');
      return;
    }

    // Move
    setPlayerPos({ x: newX, y: newY });
    updateVisibility(grid, newX, newY);
    playSound('step');

    // Academic Prompt Trigger (5% chance on empty cells)
    if (targetCell.item === ItemType.Empty && Math.random() < 0.05) {
      const question = registry.getRandom();
      if (question) {
        setModal({
          isOpen: true,
          type: 'question',
          title: 'Academic Challenge',
          message: 'Solve this to gain points!',
          question: question,
          onConfirm: (answer: string) => handleQuestionAnswer(answer, question)
        });
        playSound('hazard'); 
      }
    }

    // Check Item
    if (targetCell.item !== ItemType.Empty && targetCell.item !== ItemType.Start) {
      handleItem(targetCell.item, newX, newY);
    }
  }, [grid, playerPos, modal.isOpen]);

  const handleItem = (item: ItemTypeValues, x: number, y: number) => {
    const newGrid = [...grid];
    
    if (item === ItemType.Exit) {
      // Check if mostly explored (simple check: 80% of valid cells seen)
      const validCells = grid.flat().filter(c => c.valid);
      const seenCount = validCells.filter(c => c.seen).length;
      if (seenCount / validCells.length < 0.8) {
        addLog("The exit is locked! Explore more of the map.");
        playSound('bump');
        return;
      }
      
      // Level Complete
      const titles = ["Future Professor", "Teacher", "Scientist", "Farmer", "Student forever"];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      playSound('cheer');
      setTimeout(() => playSound('railCrossing'), 1000);
      setTimeout(() => playSound('churchBell'), 2000);

      setModal({
        isOpen: true,
        type: 'levelComplete',
        title: 'Level Complete!',
        message: `You found the exit! You are a ${title}! Score: ${score}`,
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          // NO ads or paywalls during first 2 games
          // Only show ads/paywall starting from game 3+
          if (runCount >= 3 && !isPremium && !adWatched) {
            setPostAdAction(() => () => checkAndStartLevel(level + 1));
            setShowAdInterstitial(true);
          } else {
            checkAndStartLevel(level + 1);
          }
        }
      });
      return;
    }

    // Hazards
    if ([ItemType.Hazard, ItemType.Fire, ItemType.Fumes, ItemType.Robber, ItemType.Snake, ItemType.Quicksand, ItemType.Bees, ItemType.Meteor, ItemType.Aliens, ItemType.Bear].includes(item)) {
      playSound('hazard');
      setEncounteredHazards(prev => Array.from(new Set([...prev, item])));
      setModal({
        isOpen: true,
        type: 'inventory',
        title: 'Hazard Encounter!',
        message: `You encountered: ${ITEMS_CONFIG[item].name}. Choose an item to use:`,
        hazardType: item,
        onConfirm: (selectedItem) => resolveHazard(item, selectedItem, x, y)
      });
      return;
    }

    // Pickups
    newGrid[y][x].item = ItemType.Empty;
    setGrid(newGrid);
    playSound('pickup');

    if (item === ItemType.Score) {
      setScore(s => s + 100);
      addLog("Found a Gem! +100 Score");
      playSound('doorbell');
    } else if (item === ItemType.Health) {
      setHp(h => Math.min(100, h + 20));
      addLog("Used Health Pack. +20 HP");
    } else {
      setBag(prev => [...prev, item]);
      addLog(`Picked up ${ITEMS_CONFIG[item].name}`);
    }
  };

  const resolveHazard = (hazardType: string, usedItem: string | null, x: number, y: number) => {
    let success = false;
    let msg = '';
    let hpLoss = 0;
    let scoreLoss = 0;

    // Map hazardType to encounter ID
    let encounterId = '';
    if (hazardType === ItemType.Fire) encounterId = 'forest_fire';
    else if (hazardType === ItemType.Fumes) encounterId = 'toxic_fumes';
    else if (hazardType === ItemType.Robber) encounterId = 'robber';
    else if (hazardType === ItemType.Snake) encounterId = 'snake_bite';
    else if (hazardType === ItemType.Quicksand) encounterId = 'quicksand';
    else if (hazardType === ItemType.Bees) encounterId = 'bee_sting';
    else if (hazardType === ItemType.Meteor) encounterId = 'meteor_storm';
    else if (hazardType === ItemType.Aliens) encounterId = 'violent_alien';
    else if (hazardType === ItemType.Bear) encounterId = 'hostile_wildlife';
    else if (hazardType === ItemType.Hazard) {
       // Random other hazard
       const others = ['snake_bite', 'bee_sting', 'quicksand', 'hostile_wildlife', 'dog_bite', 'leopard_attack', 'gorilla_attack'];
       encounterId = others[Math.floor(Math.random() * others.length)];
    }

    const encounter = encounters.find(e => e.id === encounterId);
    
    if (encounter) {
      const remedies = encounter.remedies as Record<string, number>;
      const basePoints = encounter.base_points;
      
      if (usedItem && remedies[usedItem] !== undefined) {
        // Valid remedy
        const mitigation = remedies[usedItem];
        hpLoss = mitigation; // Usually negative or 0
        success = true;
        msg = `You used ${ITEMS_CONFIG[usedItem].name}. Effect: ${mitigation} HP`;
      } else {
        // Invalid or no item
        hpLoss = basePoints;
        success = false;
        msg = `Failed! ${encounter.name} hit you for ${basePoints} HP.`;
        if (usedItem && encounter.invalid_choice_rule === 'apply_full_loss_and_consume_item') {
           msg += ` You also lost your ${ITEMS_CONFIG[usedItem].name}.`;
        }
      }
    } else {
      // Fallback for unknown hazards
      if (usedItem === ItemType.Weapon || usedItem === ItemType.Antivenom) success = true;
      if (success) {
        msg = "You survived!";
      } else {
        hpLoss = -20;
        msg = "Ouch! -20 HP";
      }
    }

    // Calculate new HP value BEFORE setting state
    const newHp = hp + hpLoss;

    // Apply Effects
    setHp(newHp);

    // Remove item from bag
    if (usedItem) setBag(prev => {
      const idx = prev.indexOf(usedItem as ItemTypeValues);
      if (idx > -1) {
        const newBag = [...prev];
        newBag.splice(idx, 1);
        return newBag;
      }
      return prev;
    });

    // Clear hazard
    const newGrid = [...grid];
    newGrid[y][x].item = ItemType.Empty;
    setGrid(newGrid);

    const FAILURE_PHRASES = [
      "Better luck next time",
      "Read More Often",
      "Ask a Teacher",
      "Don't give up!",
      "Keep trying!",
      "Knowledge is power"
    ];
    const failureTitle = FAILURE_PHRASES[Math.floor(Math.random() * FAILURE_PHRASES.length)];

    setModal({
      isOpen: true,
      type: 'alert',
      title: success ? 'Result' : failureTitle,
      message: msg,
      onConfirm: () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        if (newHp <= 0) gameOver();
      }
    });
  };

  const gameOver = () => {
    playSound('die');
    const isHigh = isHighScore(score);
    setIsNewHighScore(isHigh);
    
    setModal({
      isOpen: true,
      type: 'gameOver',
      title: 'Game Over',
      message: `You perished in the maze. Final Score: ${score}. Don't ever Quit! You CAN Play Again!`,
      onConfirm: () => {
        if (isHigh) {
          if (!userEmail) {
            setShowSignup(true);
          } else {
            saveHighScore(userEmail, score, level, difficulty);
            setShowLeaderboard(true);
          }
        } else {
          setModal({ ...modal, isOpen: false });
          // NO ads or paywalls during first 2 games
          if (runCount >= 3 && !isPremium && !adWatched) {
            setShowAdInterstitial(true);
          } else {
            setShowLauncher(true);
          }
        }
      }
    });
  };

  // --- KEYBOARD ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showLauncher) return;
      switch (e.key) {
        case 'ArrowUp': move(0, -1); break;
        case 'ArrowDown': move(0, 1); break;
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, showLauncher]);

  // --- RENDER HELPERS ---
  const handleManualMove = (dx: number, dy: number) => {
    if (modal.isOpen) return;
    move(dx, dy);
  };

  const handleQuestionAnswer = (answer: string | null, question: Question) => {
    if (!answer) {
      // Skip (-5 points)
      setScore(s => Math.max(0, s - 5));
      addLog('Skipped question. -5 points.');
      setModal({ ...modal, isOpen: false });
      setTextAnswer('');
      return;
    }

    const isCorrect = checkAnswer(question, answer);
    if (isCorrect) {
      // Correct (+10 to +40 points)
      // Difficulty scaling: Easy=10, Hard=20, Tough=40
      let points = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 20 : 40;
      if (question.category === 'Social') points += 10; // Bonus for social behaviors
      
      setScore(s => s + points);
      addLog(`Correct! +${points} points.`);
      playSound('churchBell');
    } else {
      // Wrong (-10 points)
      setScore(s => Math.max(0, s - 10));
      addLog('Wrong answer. -10 points.');
      playSound('gong');
    }
    setModal({ ...modal, isOpen: false });
    setTextAnswer('');
  };

  const renderEncounter = () => {
    if (modal.type === 'inventory') {
      const hazardItem = modal.hazardType as ItemTypeValues;
      const hazardConfig = ITEMS_CONFIG[hazardItem];

      return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in zoom-in animate-flash-alert">
          <div className="flex flex-col items-center mb-6">
            {hazardConfig && (
              <div className={`text-6xl mb-2 ${hazardConfig.color} animate-bounce`}>
                {hazardConfig.char}
              </div>
            )}
            <h2 className="text-2xl font-bold text-white text-center">{modal.title}</h2>
            {hazardConfig && (
              <div className="text-cyan-400 font-bold text-lg mt-1">{hazardConfig.name}</div>
            )}
          </div>
          
          <p className="text-slate-300 mb-6 text-center">{modal.message}</p>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {bag.map((item, i) => (
              <button
                key={i}
                onClick={() => modal.onConfirm && modal.onConfirm(item)}
                className="aspect-square bg-slate-700 hover:bg-slate-600 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-600"
                title={ITEMS_CONFIG[item]?.name}
              >
                <span className="text-4xl">{ITEMS_CONFIG[item]?.char}</span>
                <span className="text-xs text-slate-400 truncate w-full text-center px-1">{ITEMS_CONFIG[item]?.name}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => modal.onConfirm && modal.onConfirm(null)}
            className="w-full py-2 bg-red-900/50 hover:bg-red-900/80 text-red-200 rounded-lg text-sm font-bold transition-colors border border-red-900 mb-4"
          >
            Take Damage (No Item)
          </button>
        </div>
      );
    }
    
    if (modal.type === 'question' && modal.question) {
      const isTextType = !modal.question.options || modal.question.options.length === 0;

      return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in zoom-in max-w-md w-full animate-flash-alert">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-white">Academic Challenge</h2>
            <span className="text-xs bg-cyan-900 text-cyan-200 px-2 py-1 rounded uppercase">{modal.question.category}</span>
          </div>
          
          {modal.question.image && (
            <div className="mb-4 rounded-lg overflow-hidden border border-slate-600 bg-white/10 flex justify-center p-2">
              <img 
                src={modal.question.image} 
                alt="Question" 
                className="max-h-48 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  console.error('Image failed to load:', modal.question?.image);
                }}
              />
            </div>
          )}
          
          <p className="text-slate-300 mb-6 font-medium text-lg">{modal.question.text}</p>
          
          <div className="space-y-3">
            {!isTextType ? (
              modal.question.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => modal.onConfirm && modal.onConfirm(opt)}
                  className="w-full p-4 text-left bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors border border-slate-600 hover:border-cyan-500 font-medium"
                >
                  {opt}
                </button>
              ))
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      modal.onConfirm && modal.onConfirm(textAnswer);
                    }
                  }}
                />
                <button
                  onClick={() => modal.onConfirm && modal.onConfirm(textAnswer)}
                  className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg font-bold transition-colors"
                >
                  Submit Answer
                </button>
              </div>
            )}
            
            <button
              onClick={() => modal.onConfirm && modal.onConfirm(null)}
              className="w-full py-2 mt-4 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
            >
              Skip Question (-5 points)
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* SCROLLING BANNER */}
      <div className="h-3 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border-b border-cyan-500/30 overflow-hidden relative z-30">
        <div className="absolute whitespace-nowrap animate-scroll-left text-white text-[10px] font-bold tracking-wider flex items-center h-full">
          <span className="inline-flex items-center gap-4 px-4">
            <span className="text-cyan-300">NEBULA MAZE</span>
            <span className="text-purple-300">•</span>
            <span className="text-cyan-300">Fog of War</span>
            <span className="text-purple-300">•</span>
            <span className="text-cyan-300">Survival</span>
            <span className="text-purple-300">•</span>
            <span className="text-cyan-300">Trivia</span>
            <span className="text-purple-300">•</span>
            <span className="text-cyan-300">NEBULA MAZE</span>
            <span className="text-purple-300">•</span>
            <span className="text-cyan-300">Fog of War</span>
            <span className="text-purple-300">•</span>
            <span className="text-cyan-300">Survival</span>
            <span className="text-purple-300">•</span>
            <span className="text-cyan-300">Trivia</span>
            <span className="text-purple-300">•</span>
          </span>
        </div>
      </div>

      {/* MERGED STATS PANEL - Below Banner, Above Maze */}
      {!showLauncher && (
        <div className="bg-red-900 border-b border-slate-700 p-1 z-20 flex-shrink-0">
          <div className="flex gap-1 items-center">
            {/* Left Column: Trophy, Settings, Score, Health */}
            <div className="flex gap-1">
              {/* Icons Column */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => setShowLeaderboard(true)} className="p-0.5 bg-slate-800/90 hover:bg-slate-700 rounded transition-colors border border-slate-600">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                </button>
                <button onClick={() => setShowOperator(true)} className="p-0.5 bg-slate-800/90 hover:bg-slate-700 rounded transition-colors border border-slate-600">
                  <Settings className="w-3 h-3 text-cyan-400" />
                </button>
              </div>

              {/* Stats Column */}
              <div className="flex flex-col gap-0.5">
                <div className="bg-green-700/90 rounded px-1.5 py-0.5 border border-green-600 text-center">
                  <div className="text-[6px] text-white uppercase font-bold leading-none">SCORE</div>
                  <div className="text-xs font-mono font-bold text-yellow-300 leading-tight">{score}</div>
                </div>

                <div className="bg-slate-800/90 rounded px-1.5 py-0.5 border border-slate-600 text-center">
                  <div className="text-[6px] text-white uppercase font-bold leading-none">HEALTH</div>
                  <div className={`text-xs font-mono font-bold ${hp > 50 ? 'text-green-400' : 'text-red-400'} leading-tight`}>{hp}%</div>
                </div>
              </div>
            </div>

            {/* Right: Compact WITS Grid */}
            <div className="flex-1 max-w-[140px]">
              <div className="text-[6px] font-bold text-white uppercase tracking-wider text-center leading-none mb-0.5">WITS</div>
              <div className="grid grid-cols-4 gap-0.5">
                {Array.from({ length: 12 }).map((_, i) => {
                  const item = bag[i];
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded border ${item ? 'bg-slate-700/90 border-slate-600' : 'bg-slate-800/50 border-slate-700/50'} flex items-center justify-center`}
                      title={item ? ITEMS_CONFIG[item]?.name : 'Empty'}
                    >
                      <span className="text-[10px]">{item && ITEMS_CONFIG[item]?.char}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        {/* LAUNCHER OVERLAY */}
        {showLauncher && (
          <Launcher
            onStart={handleLauncherStart}
            onReset={handleReset}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            playerIcon={playerIcon}
            setPlayerIcon={setPlayerIcon}
          />
        )}

        {/* AD INTERSTITIAL */}
        {showAdInterstitial && (
          <AdInterstitial
            onClose={() => {
              setAdWatched(true);
              setShowAdInterstitial(false);
              if (postAdAction) {
                postAdAction();
                setPostAdAction(null);
              } else {
                setShowLauncher(true);
              }
            }}
          />
        )}



           {/* MAZE PANEL WRAPPER */}
         <div className="flex-1 flex flex-col items-center justify-center p-1 min-h-0"
          ref={containerRef}
          style={{
            backgroundImage: `url(${SCENERY_IMAGES[sceneryIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          {/* Maze Grid */}
          <div
            className="relative bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-slate-800 flex-shrink-0"
            style={{
              width: 'min(70vw, 300px)',
              height: 'min(70vw, 300px)',
              aspectRatio: '1 / 1',
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Grid Rendering */}
            <div 
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 1fr)`,
                gridTemplateRows: `repeat(${grid.length || 1}, 1fr)`,
              }}
            >
              {grid.map((row, y) => row.map((cell, x) => {
                const isPlayer = playerPos.x === x && playerPos.y === y;
                const isVisible = cell.visible;
                const isSeen = cell.seen;
                
                if (!cell.valid) return <div key={`${x}-${y}`} className="bg-slate-950" />;
                
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`
                      relative transition-all duration-300
                      ${isVisible ? (backgroundImage ? 'bg-slate-900/40 backdrop-blur-[1px]' : THEME_COLORS[theme]) : isSeen ? 'bg-slate-900/90' : 'bg-black'}
                    `}
                    style={{
                      backgroundColor: isVisible ? "var(--cell-bg-color)" : undefined
                    }}>
                    {/* Walls */}
                    {(isVisible || isSeen) && (
                      <>
                        {(cell.walls & Direction.N) ? <div className={`absolute top-0 left-0 right-0 h-[2px] border-t-2 ${isVisible ? 'border-slate-600' : 'border-slate-600/30'}`} /> : null}
                        {(cell.walls & Direction.S) ? <div className={`absolute bottom-0 left-0 right-0 h-[2px] border-b-2 ${isVisible ? 'border-slate-600' : 'border-slate-600/30'}`} /> : null}
                        {(cell.walls & Direction.W) ? <div className={`absolute top-0 bottom-0 left-0 w-[2px] border-l-2 ${isVisible ? 'border-slate-600' : 'border-slate-600/30'}`} /> : null}
                        {(cell.walls & Direction.E) ? <div className={`absolute top-0 bottom-0 right-0 w-[2px] border-r-2 ${isVisible ? 'border-slate-600' : 'border-slate-600/30'}`} /> : null}
                      </>
                    )}
                    {/* Items */}
                    {isVisible && cell.item !== ItemType.Empty && ITEMS_CONFIG[cell.item] && (
                      <div className={`absolute inset-0 flex items-center justify-center text-lg ${ITEMS_CONFIG[cell.item].color}`}>
                        {ITEMS_CONFIG[cell.item].char}
                      </div>
                    )}
                    {/* Player */}
                    {isPlayer && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <PlayerAvatar type={playerIcon} className="w-[80%] h-[80%] drop-shadow-lg animate-bounce-player" />
                      </div>
                    )}
                    {/* Fog Overlay (Seen but not visible) */}
                    {isSeen && !isVisible && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[1px]" />
                    )}
                    {/* Walls - Explored (Rendered ON TOP of fog for visibility) */}
                    {isSeen && !isVisible && (
                      <>
                        {(cell.walls & Direction.N) ? <div className="absolute top-0 left-0 right-0 h-[2px] border-t-2 border-slate-500/30" /> : null}
                        {(cell.walls & Direction.S) ? <div className="absolute bottom-0 left-0 right-0 h-[2px] border-b-2 border-slate-500/30" /> : null}
                        {(cell.walls & Direction.W) ? <div className="absolute top-0 bottom-0 left-0 w-[2px] border-l-2 border-slate-500/30" /> : null}
                        {(cell.walls & Direction.E) ? <div className="absolute top-0 bottom-0 right-0 w-[2px] border-r-2 border-slate-500/30" /> : null}
                      </>
                    )}
                  </div>
                );
              }))}
            </div>
          </div>

          {/* On-Screen Controls - Portrait Mode (Design 3: Wide layout with ad banner) */}
          <div className="md:hidden flex flex-col gap-2 mt-1 w-full">
            {/* Top Row: Up Arrow */}
            <div className="flex justify-center">
              <button
                onClick={() => handleManualMove(0, -1)}
                className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
                aria-label="Move Up"
              >
                ⬆️
              </button>
            </div>

            {/* Middle Row: Left, Ad Banner, Right */}
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => handleManualMove(-1, 0)}
                className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
                aria-label="Move Left"
              >
                ⬅️
              </button>

              {/* Ad Banner Space */}
              <div className="flex-1 h-12 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border-2 border-purple-700/50 rounded-lg flex items-center justify-center px-2 max-w-[200px]">
                <span className="text-[8px] font-bold text-purple-300 text-center uppercase tracking-wide">Ad Space</span>
              </div>

              <button
                onClick={() => handleManualMove(1, 0)}
                className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
                aria-label="Move Right"
              >
                ➡️
              </button>
            </div>

            {/* Bottom Row: Down Arrow */}
            <div className="flex justify-center">
              <button
                onClick={() => handleManualMove(0, 1)}
                className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
                aria-label="Move Down"
              >
                ⬇️
              </button>
            </div>
          </div>

          {/* On-Screen Controls - Landscape Mode (Right Side) */}
          <div className="hidden md:flex md:flex-col gap-3 ml-2">
            <button
              onClick={() => handleManualMove(0, -1)}
              className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
              aria-label="Move Up"
            >
              ⬆️
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => handleManualMove(-1, 0)}
                className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
                aria-label="Move Left"
              >
                ⬅️
              </button>
              <button
                onClick={() => handleManualMove(1, 0)}
                className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
                aria-label="Move Right"
              >
                ➡️
              </button>
            </div>
            <button
              onClick={() => handleManualMove(0, 1)}
              className="w-12 h-12 bg-slate-800/90 border-2 border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
              aria-label="Move Down"
            >
              ⬇️
            </button>
          </div>
        </div> {/* end maze panel wrapper */}

        {/* ENCOUNTER OVERLAY */}
        {modal.isOpen && (modal.type === 'question' || modal.type === 'inventory') && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="w-full max-w-md">
              {renderEncounter()}
            </div>
          </div>
        )}

        {/* MODALS */}
        {showLeaderboard && <Leaderboard scores={getHighScores()} onClose={() => setShowLeaderboard(false)} />}
        {showOperator && (
          <OperatorPanel 
            onClose={() => setShowOperator(false)} 
            musicVolume={musicVolume}
            setMusicVolume={setMusicVolume}
            sfxVolume={sfxVolume}
            setSfxVolume={setSfxVolume}
          />
        )}
        {showSignup && <SignupPrompt onSignup={handleSignup} onSkip={() => { setShowSignup(false); }} />}
        {showPaywall && <Paywall onUnlock={handlePaywallUnlock} onClose={() => { setShowPaywall(false); setShowLauncher(true); }} />}
        
        <MusicPlayer 
          src="https://upload.wikimedia.org/wikipedia/commons/transcoded/2/20/Silent_Partner_-_Bet_On_It.ogg/Silent_Partner_-_Bet_On_It.ogg.mp3" 
          volume={musicVolume} 
        />

        {/* Mobile Modal Container */}
        {modal.isOpen && modal.type !== 'inventory' && modal.type !== 'question' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm shadow-2xl p-6 animate-in zoom-in">
              <h2 className="text-xl font-bold text-white mb-2">{modal.title}</h2>
              <p className="text-slate-300 mb-6">{modal.message}</p>
              <button 
                onClick={() => { playSound('bleep'); modal.onConfirm && modal.onConfirm(); }}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition animate-pulse hover:scale-105"
              >
                {modal.type === 'gameOver' ? "Don't ever Quit! Play Again" : "Continue"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
