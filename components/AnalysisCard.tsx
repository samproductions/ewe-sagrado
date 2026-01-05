
import React, { useState } from 'react';
import { PlantAnalysis } from '../types';

interface AnalysisCardProps {
  analysis: PlantAnalysis;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'ritual' | 'reza' | 'fundamento'>('ritual');

  const getFundamentoColor = (f: string) => {
    switch (f) {
      case 'Quente': return 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]';
      case 'Morna': return 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]';
      case 'Fria': return 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]';
      default: return 'bg-slate-600';
    }
  };

  const getEweClassificationColor = (c: string) => {
    switch (c) {
      case 'Ewe Pupa': return 'bg-red-800 text-white border-red-600';
      case 'Ewe Dudu': return 'bg-slate-900 text-slate-100 border-slate-700';
      case 'Ewe Funfun': return 'bg-white text-emerald-950 border-emerald-100';
      default: return 'bg-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* [TAGS] Header Section */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 shadow-lg">
          #{analysis.commonName.replace(/\s+/g, '')}
        </span>
        <span className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 shadow-lg">
          #{analysis.orixaRuling.split(' ')[0]}
        </span>
        <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg ${getFundamentoColor(analysis.fundamento)}`}>
          #{analysis.fundamento === 'Quente' ? 'FolhaQuente' : analysis.fundamento === 'Morna' ? 'FolhaMorna' : 'FolhaFria'}
        </span>
        <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border shadow-lg ${getEweClassificationColor(analysis.eweClassification)}`}>
          #{analysis.eweClassification.replace(/\s+/g, '')}
        </span>
      </div>

      <header className="pb-8 border-b border-emerald-900/30">
        <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-500 font-black mb-2">IDENTIFICAÇÃO</p>
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-none mb-4">{analysis.commonName}</h2>
        <div className="flex items-center gap-3">
          <span className="text-amber-500 text-2xl">✦</span>
          <p className="text-emerald-400 font-bold text-xl tracking-wide">{analysis.orixaRuling}</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-emerald-900/30 gap-1 md:gap-4">
        <button 
          onClick={() => setActiveTab('ritual')}
          className={`px-4 md:px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ritual' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          PASSO A PASSO
        </button>
        <button 
          onClick={() => setActiveTab('reza')}
          className={`px-4 md:px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reza' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          REZA/CANTIGA
        </button>
        <button 
          onClick={() => setActiveTab('fundamento')}
          className={`px-4 md:px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'fundamento' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          DICA DE OURO
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'ritual' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
            <section className="bg-emerald-950/20 border border-emerald-500/10 p-8 rounded-[2.5rem] shadow-inner">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ONDE APLICAR
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.applicationLocation.map(loc => (
                  <div key={loc} className="flex items-center gap-3 bg-emerald-900/30 p-4 rounded-2xl border border-emerald-500/10">
                    <span className="text-emerald-400 text-lg">◈</span>
                    <span className="text-emerald-50 font-medium">{loc}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#0a2016] border border-emerald-900/50 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="text-emerald-500 text-3xl">🪘</span> PASSO A PASSO
              </h3>
              <div className="space-y-5">
                {analysis.stepByStepInstructions.map((step, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-[#081a12] rounded-[1.5rem] border border-emerald-500/5 hover:border-emerald-500/20 transition-all hover:translate-x-1 group">
                    <span className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-sm group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-colors">
                      {i + 1}
                    </span>
                    <p className="text-slate-200 text-base leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'reza' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <section className="bg-[#0c1a13] border border-emerald-900/40 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[12rem] font-serif select-none">"</div>
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 uppercase">
                REZA/CANTIGA: {analysis.prayer.title}
              </h3>
              <p className="text-3xl font-serif text-white leading-tight mb-8 whitespace-pre-line italic relative z-10">
                {analysis.prayer.text}
              </p>
              {analysis.prayer.translation && (
                <div className="pt-8 border-t border-emerald-900/30">
                  <p className="text-base text-slate-400 leading-relaxed">
                    <span className="font-bold text-emerald-600 mr-2 uppercase tracking-tighter">SENTIDO:</span>
                    {analysis.prayer.translation}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'fundamento' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
             <section className="bg-amber-950/20 border border-amber-500/20 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">✨</div>
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  DICA DE OURO: {analysis.goldenTip.title}
                </h3>
                <p className="text-amber-100/90 text-2xl font-serif leading-relaxed mb-6 italic relative z-10">
                  "{analysis.goldenTip.content}"
                </p>
             </section>

             <section className="bg-emerald-950/20 border border-emerald-500/10 p-10 rounded-[3rem]">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6">FUNDAMENTO & ESSÊNCIA</h3>
                <p className="text-slate-100 text-xl leading-relaxed mb-6 font-serif">{analysis.fundamentoExplanation}</p>
                <div className="bg-[#04120b] p-6 rounded-2xl border-l-4 border-emerald-600">
                  <p className="text-slate-400 text-sm leading-relaxed italic">
                    "{analysis.historicalContext}"
                  </p>
                </div>
             </section>
          </div>
        )}
      </div>

      {analysis.safetyWarnings && (
        <div className="p-8 bg-red-950/20 border border-red-900/30 rounded-[2rem] flex items-start gap-6 mt-12">
          <span className="text-3xl mt-1 shrink-0 animate-bounce">⚠</span>
          <div>
            <h3 className="text-sm font-black text-red-400 mb-2 uppercase tracking-widest">Aviso de Segurança & Respeito</h3>
            <p className="text-sm text-red-200/80 leading-relaxed">
              {analysis.safetyWarnings}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;
