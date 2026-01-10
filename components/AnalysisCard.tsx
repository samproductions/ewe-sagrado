import React, { useState } from 'react';
import { PlantAnalysis } from '../types';

interface AnalysisCardProps {
  analysis: PlantAnalysis;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'ritual' | 'reza' | 'fundamento'>('ritual');

  const getFundamentoColor = (f: string) => {
    const text = f.toLowerCase();
    if (text.includes('ero') || text.includes('fria')) return 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]';
    if (text.includes('gun') || text.includes('quente')) return 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]';
    return 'bg-emerald-600 text-white';
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* Header Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-600/20 text-amber-400 border border-amber-500/30">
          NAÇÃO KETU
        </span>
        <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-900/40 text-emerald-400 border border-emerald-500/20">
          {analysis.orixaRuling.toUpperCase()}
        </span>
        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${getFundamentoColor(analysis.fundamento)}`}>
          {analysis.fundamento.toUpperCase()}
        </span>
      </div>

      <header className="pb-8 border-b border-emerald-900/30">
        <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-500 font-black mb-2 italic">Àṣẹ Ewé - O Segredo das Folhas</p>
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-none mb-4">
          {analysis.commonName}
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-emerald-400 font-bold text-xl tracking-wide">{analysis.orixaRuling}</p>
          <span className="h-4 w-px bg-emerald-900/50 hidden sm:block"></span>
          <p className="text-slate-400 text-sm italic font-serif">{analysis.scientificName}</p>
        </div>
      </header>

      {/* Navigation */}
      <div className="flex flex-wrap border-b border-emerald-900/30">
        <button 
          onClick={() => setActiveTab('ritual')}
          className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'ritual' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500'}`}
        >
          LITURGIA KETU
        </button>
        <button 
          onClick={() => setActiveTab('reza')}
          className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'reza' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500'}`}
        >
          ÒFÒ (ENCANTAMENTO)
        </button>
        <button 
          onClick={() => setActiveTab('fundamento')}
          className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'fundamento' ? 'text-emerald-400 border-b-4 border-emerald-400' : 'text-slate-500'}`}
        >
          ITAN & FUNDAMENTO
        </button>
      </div>

      <div className="py-6">
        {activeTab === 'ritual' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <section className="bg-emerald-950/20 border border-emerald-500/10 p-8 rounded-[2rem]">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Natureza Ritualística</h3>
              <p className="text-white text-lg font-medium leading-relaxed">{analysis.ritualNature}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0a2016] p-8 rounded-[2rem] border border-emerald-900/50">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Instruções de Preparo</h3>
                <ul className="space-y-4">
                  {analysis.stepByStepInstructions.map((step, i) => (
                    <li key={i} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                      <span className="text-emerald-500 font-bold">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0a2016] p-8 rounded-[2rem] border border-emerald-900/50">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Aplicação Litúrgica</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.applicationLocation.map(loc => (
                    <span key={loc} className="bg-emerald-900/40 px-3 py-1 rounded-lg text-xs text-emerald-200 border border-emerald-500/20">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reza' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
            <div className="bg-[#0c1a13] border border-emerald-900/40 p-10 rounded-[3rem] relative shadow-2xl">
              <div className="absolute top-4 right-8 opacity-10 text-6xl font-serif italic text-emerald-500">Òfò</div>
              <h3 className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-6 border-b border-emerald-500/20 pb-2 inline-block">
                {analysis.prayer.title}
              </h3>
              <p className="text-3xl md:text-4xl font-serif text-white leading-tight mb-8 italic">
                "{analysis.prayer.text}"
              </p>
              <div className="bg-emerald-950/40 p-6 rounded-2xl border-l-4 border-emerald-600">
                <p className="text-emerald-500 text-[10px] font-black uppercase mb-2">Tradução e Significado</p>
                <p className="text-slate-300 italic font-serif leading-relaxed">
                  {analysis.prayer.translation}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest text-center">
              "A palavra desperta o Àṣẹ contido na semente e na folha."
            </p>
          </div>
        )}

        {activeTab === 'fundamento' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
            <section className="bg-amber-950/10 border border-amber-500/10 p-10 rounded-[3rem]">
              <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4">Itan (História Sagrada)</h3>
              <p className="text-slate-200 text-xl font-serif leading-relaxed italic">
                "{analysis.historicalContext}"
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Elementos Dominantes</h3>
                <p className="text-white font-bold text-lg">{analysis.elements}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Classificação Ewé</h3>
                <p className="text-white font-bold text-lg">{analysis.eweClassification}</p>
              </div>
            </div>

            <div className="p-8 bg-emerald-950/40 rounded-[2rem] border border-emerald-500/10">
              <h3 className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-4">Dica do Oníṣègún</h3>
              <p className="text-slate-300 leading-relaxed italic">
                <span className="text-amber-500 font-bold mr-2">{analysis.goldenTip.title}:</span>
                {analysis.goldenTip.content}
              </p>
            </div>
          </div>
        )}
      </div>

      {analysis.safetyWarnings && (
        <div className="mt-8 p-6 bg-red-950/20 border border-red-900/30 rounded-2xl flex gap-4 items-start">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-1">Cuidado e Respeito</h4>
            <p className="text-red-200/60 text-xs leading-relaxed">{analysis.safetyWarnings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;