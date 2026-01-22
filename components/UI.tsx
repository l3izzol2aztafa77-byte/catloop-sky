
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseStyle = "px-8 py-4 rounded-full font-medium transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 tracking-wide text-sm";
  const variants = {
    primary: "bg-[#00f3ff] text-[#020408] shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]",
    secondary: "bg-[#bc13fe] text-white shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.5)]",
    outline: "border border-white/10 text-white hover:bg-white/5",
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
    className={`glass rounded-[2rem] p-6 transition-all duration-500 hover:translate-y-[-2px] hover:bg-white/5 ${className}`}
  >
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#00f3ff' }) => (
  <span 
    className="text-[10px] px-3 py-1 rounded-full font-orbitron tracking-widest border border-current opacity-80" 
    style={{ color }}
  >
    {children}
  </span>
);

export const SectionHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 ${className}`}>
    {children}
  </h3>
);
