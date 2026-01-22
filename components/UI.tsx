
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseStyle = "px-10 py-5 rounded-[2rem] font-orbitron font-bold transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 tracking-[0.2em] text-[11px] uppercase";
  const variants = {
    primary: "bg-[#00f3ff] text-[#020408] shadow-[0_15px_40px_rgba(0,243,255,0.35)] hover:shadow-[0_20px_50px_rgba(0,243,255,0.5)] border border-white/20",
    secondary: "bg-[#bc13fe] text-white shadow-[0_15px_40px_rgba(188,19,254,0.35)] hover:shadow-[0_20px_50px_rgba(188,19,254,0.5)] border border-white/20",
    outline: "border border-white/10 text-white bg-white/5 backdrop-blur-xl hover:bg-white/10",
    ghost: "text-slate-500 hover:text-white"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick} 
    className={`glass rounded-[2.5rem] p-8 transition-all duration-700 ease-[0.16, 1, 0.3, 1] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)] active:scale-[0.98] ${className}`}
  >
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#00f3ff' }) => (
  <span 
    className="text-[9px] px-4 py-1.5 rounded-full font-orbitron font-extrabold tracking-[0.3em] border border-current flex items-center justify-center w-fit uppercase" 
    style={{ color, backgroundColor: `${color}15`, boxShadow: `0 0 15px ${color}20` }}
  >
    {children}
  </span>
);

export const SectionHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-[11px] font-orbitron font-bold text-slate-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-4 ${className}`}>
    <div className="w-2 h-2 rounded-full bg-cyan-500/50 shadow-[0_0_10px_#00f3ff]"></div>
    {children}
    <div className="flex-1 h-[1px] bg-white/5"></div>
  </h3>
);
