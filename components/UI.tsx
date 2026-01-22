
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseStyle = "px-8 py-5 rounded-2xl font-orbitron font-bold transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 tracking-[0.1em] text-xs uppercase";
  const variants = {
    primary: "bg-[#00f3ff] text-[#020408] shadow-[0_10px_30px_rgba(0,243,255,0.3)] hover:shadow-[0_15px_40px_rgba(0,243,255,0.5)] border border-white/10",
    secondary: "bg-[#bc13fe] text-white shadow-[0_10px_30px_rgba(188,19,254,0.3)] hover:shadow-[0_15px_40px_rgba(188,19,254,0.5)] border border-white/10",
    outline: "border border-white/10 text-white bg-white/5 backdrop-blur-md hover:bg-white/10",
    ghost: "text-slate-400 hover:text-white"
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
    className={`glass rounded-[2rem] p-6 transition-all duration-700 ease-[0.16, 1, 0.3, 1] border border-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.4)] ${className}`}
  >
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#00f3ff' }) => (
  <span 
    className="text-[9px] px-3 py-1 rounded-lg font-orbitron font-bold tracking-[0.2em] border border-current flex items-center justify-center w-fit uppercase" 
    style={{ color, backgroundColor: `${color}10` }}
  >
    {children}
  </span>
);

export const SectionHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-[10px] font-orbitron font-bold text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3 ${className}`}>
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40"></div>
    {children}
  </h3>
);
