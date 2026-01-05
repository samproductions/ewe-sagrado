
import React from 'react';
import { HistoryItem } from '../types';

interface SidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
  activeId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelect, isOpen, onToggle, onClear, activeId }) => {
  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-50
      w-72 bg-[#04120b] border-r border-emerald-900/40 
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 transition-transform duration-300 ease-in-out
      flex flex-col h-full
    `}>
      <div className="p-6 border-b border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold">🌿</div>
          <span className="text-xl font-bold font-serif text-white tracking-tight">Ewe AI</span>
        </div>
        <button onClick={onToggle} className="md:hidden text-emerald-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="X" />
              <path d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Histórico de Axé</h3>
          {history.length > 0 && (
            <button onClick={onClear} className="text-[10px] text-red-500/60 hover:text-red-500 font-bold transition-colors">LIMPAR TUDO</button>
          )}
        </div>
        
        {history.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-slate-600 italic">Sua jornada litúrgica começa aqui.</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`
                w-full text-left p-3 rounded-2xl flex gap-3 items-center group transition-all
                ${activeId === item.id ? 'bg-emerald-900/40 border border-emerald-500/30 ring-1 ring-emerald-500/20' : 'hover:bg-emerald-900/20 border border-transparent'}
              `}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all border border-emerald-900/50">
                <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${activeId === item.id ? 'text-emerald-400' : 'text-slate-300 group-hover:text-white'}`}>
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-emerald-900/40 bg-[#030e08]/50">
        <div className="p-4 bg-emerald-900/10 rounded-2xl border border-emerald-500/5">
          <p className="text-[9px] text-emerald-500/60 leading-tight">
            "Ossain, dono de todas as folhas, nada se faz sem seu axé."
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
