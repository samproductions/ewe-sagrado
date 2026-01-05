
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-6 border-b border-emerald-900/50 bg-[#061a11]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(5,150,105,0.5)]">
            <span className="text-white text-xl font-bold">🌿</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Ewé Sagrado</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-bold leading-none">Botânica de Axé</p>
          </div>
        </div>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-emerald-400 transition-colors">Orixás</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Banhos</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Fundamentos</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
