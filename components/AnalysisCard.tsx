
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
    const lowerC = c.toLowerCase();
    if (lowerC.includes('pupa')) return 'bg-red-800 text-white border-red-600 shadow-[0_0_10px_rgba(153,27,27,0.3)]';
    if (lowerC.includes('dudu')) return 'bg-slate-900 text-slate-100 border-slate-700 shadow-[0_0_10px_rgba(15,23,42,0.3)]';
    if (lowerC.includes('funfun')) return 'bg-white text-emerald-950 border-emerald-100 shadow-[0_0_10px_rgba(255,255,255,0.1)]';
    return 'bg-emerald-900/40 text-emerald-400 border-emerald-500/20';
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
          #{analysis.eweClassification.split('(')[0].trim().replace(/\s+/g, '')}
        </span>
      </div>

      <header className="pb-8 border-b border-emerald-900/30">
        <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-500 font-black mb-2">IDENTIFICAÇÃO DE ALTA PRECISÃO</p>
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-none mb-4">{analysis.commonName}</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-2xl">✦</span>
            <p className="text-emerald-400 font-bold text-xl tracking-wide">{analysis.orixaRuling}</p>
          </div>
          <span className="h-6 w-px bg-emerald-900/50 hidden sm:block"></span>
          <p className="text-slate-400 text-sm italic font-serif">{analysis.scientificName}</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-emerald-900/30 gap-1 md:gap-4">
        <button 
          onClick={() => setActiveTab('ritual')}
          className={`px-4 md:px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ritual' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          LITURGIA & PREPARO
        </button>
        <button 
          onClick={() => setActiveTab('reza')}
          className={`px-4 md:px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reza' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          ÒFÒ (YORÙBÁ)
        </button>
        <button 
          onClick={() => setActiveTab('fundamento')}
          className={`px-4 md:px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'fundamento' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          FUNDAMENTOS
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'ritual' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
            <section className="bg-emerald-950/20 border border-emerald-500/10 p-8 rounded-[2.5rem] shadow-inner">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    NATUREZA RITUALÍSTICA
                  </h3>
                  <p className="text-white font-bold text-lg">{analysis.ritualNature}</p>
                </div>
                <div className="h-full border-l border-emerald-900/30 hidden md:block"></div>
                <div>
                  <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">LOCAL DE APLICAÇÃO</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.applicationLocation.map(loc => (
                      <span key={loc} className="bg-emerald-900/30 text-emerald-100 px-4 py-2 rounded-xl text-xs border border-emerald-500/10">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#0a2016] border border-emerald-900/50 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="text-emerald-500 text-3xl">🪘</span> PASSO A PASSO NO CANDOMBLÉ
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
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[12rem] font-serif select-none italic text-emerald-500">Òfò</div>
              
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 border-b border-emerald-500/20 pb-2 inline-block">
                {analysis.prayer.title || "REZA LITÚRGICA EM YORÙBÁ"}
              </h3>
              
              <div className="relative z-10 mb-10">
                <p className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4 whitespace-pre-line italic">
                  {analysis.prayer.text}
                </p>
              </div>

              <div className="bg-[#04120b] p-8 rounded-3xl border-l-4 border-emerald-600 shadow-xl">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-3 tracking-widest">Tradução / Fundamento da Reza</h4>
                  <p className="text-slate-300 text-lg leading-relaxed font-serif italic">
                    {analysis.prayer.translation}
                  </p>
                </div>
            </section>
            
            <p className="text-center text-[10px] text-emerald-700 font-bold uppercase tracking-widest px-8">
              Nota: O Òfò é a palavra de poder que desperta a força vital (Àṣẹ) contida na folha.
            </p>
          </div>
        )}

        {activeTab === 'fundamento' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
             <section className="bg-amber-950/20 border border-amber-500/20 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">✨</div>
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  {analysis.goldenTip.title}
                </h3>
                <p className="text-amber-100/90 text-2xl font-serif leading-relaxed mb-6 italic relative z-10">
                  "{analysis.goldenTip.content}"
                </p>
             </section>

             <section className="bg-emerald-950/20 border border-emerald-500/10 p-10 rounded-[3rem]">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6">FUNDAMENTO & ESSÊNCIA NO CANDOMBLÉ</h3>
                <p className="text-slate-100 text-xl leading-relaxed mb-8 font-serif">{analysis.fundamentoExplanation}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-[#04120b] p-6 rounded-2xl border-l-4 border-emerald-600">
                    <p className="text-emerald-500 text-[10px] font-black uppercase mb-1 tracking-widest">Elemento</p>
                    <p className="text-white font-bold">{analysis.elements}</p>
                  </div>
                  <div className="bg-[#04120b] p-6 rounded-2xl border-l-4 border-amber-600">
                    <p className="text-amber-500 text-[10px] font-black uppercase mb-1 tracking-widest">Classificação Litúrgica</p>
                    <p className="text-white font-bold">{analysis.eweClassification}</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-emerald-900/30">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase mb-4 tracking-widest">Contexto Histórico / Itan</h4>
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
            <h3 className="text-sm font-black text-red-400 mb-2 uppercase tracking-widest">Aviso de Respeito e Segurança</h3>
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