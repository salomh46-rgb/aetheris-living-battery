import React from 'react';
import { Sparkles, Minus, Power, Maximize2, Minimize2 } from 'lucide-react';

interface HeaderProps {
  onHide: () => void;
  onQuit: () => void;
  isMini: boolean;
  onToggleMini: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHide, onQuit, isMini, onToggleMini }) => {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            AETHERIS
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-normal">
              v1.0
            </span>
          </h1>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleMini}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title={isMini ? "To'liq Oyna" : "Desktop Vidjet Rejimi"}
        >
          {isMini ? <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onHide}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title="Yashirish"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onQuit}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Dasturdan chiqish"
        >
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
