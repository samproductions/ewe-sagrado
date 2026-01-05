import React, { useState, useCallback, useEffect } from 'react';
import { analyzePlantImage } from './services/geminiService';
import { AppStatus, HistoryItem } from './types';
import Sidebar from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import AnalysisCard from './components/AnalysisCard';
import LoadingState from './components/LoadingState';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ewe_ai_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToHistory = (analysis: any, preview: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      title: analysis.suggestedTitle || analysis.commonName || "Folha Sagrada",
      analysis,
      previewUrl: preview,
      timestamp: Date.now()
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('ewe_ai_history', JSON.stringify(newHistory));
  };

  const handleImageSelect = useCallback(async (file: File) => {
    setStatus(AppStatus.LOADING);
    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target?.result as string;
      setPreviewUrl(b64);
      try {
        const analysis = await analyzePlantImage(b64);
        // Normalização manual para garantir que todos os nomes batam com o que o site exibe
        const normalized = {
          ...analysis,
          suggestedTitle: analysis.suggestedTitle || analysis.suggestedTitles,
          orixaRuling: analysis.orixaRuling || analysis.orixRuling,
          goldenTip: analysis.goldenTip || analysis.goldenTips
        };
        setResult(normalized);
        setStatus(AppStatus.SUCCESS);
        saveToHistory(normalized, b64);
      } catch (err) {
        setError("O segredo da mata exige clareza. Tente novamente.");
        setStatus(AppStatus.ERROR);
      }
    };
    reader.readAsDataURL(file);
  }, [history]);

  const selectFromHistory = (item: HistoryItem) => {
    setResult(item.analysis);
    setPreviewUrl(item.previewUrl);
    setStatus(AppStatus.SUCCESS);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setPreviewUrl(null);
    setError(null);
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex h-screen bg-[#061a11] text-slate-100 overflow-hidden font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <Sidebar history={history} onSelect={selectFromHistory} isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} onClear={() => setHistory([])} activeId={history.find(h => h.analysis === result)?.id} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-emerald-900/50 bg-[#061a11]/80">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-emerald-500"><span className="text-2xl">☰</span></button>
          <span className="text-emerald-500 font-bold text-xl font-serif">Ewe Expert</span>
          <div className="w-8"></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {status === AppStatus.IDLE && (
              <div className="flex-1 flex flex-col justify-center text-center">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🌿</div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-emerald-400 font-serif">Ewe Expert</h1>
                <p className="text-lg text-slate-400 mb-12">"Identificação Sagrada e Fundamento Ancestral."</p>
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
            )}
            {status === AppStatus.LOADING && <LoadingState />}
            {status === AppStatus.ERROR && (
              <div className="flex-1 flex items-center justify-center text-center">
                <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-[2rem]">
                  <p className="text-red-400 mb-6 text-lg">{error}</p>
                  <button onClick={reset} className="bg-red-600 px-8 py-3 rounded-full font-bold">Tentar Novamente</button>
                </div>
              </div>
            )}
            {status === AppStatus.SUCCESS && result && (
              <div className="space-y-10 py-6">
                <button onClick={reset} className="bg-emerald-900/30 text-emerald-400 px-5 py-2 rounded-full border border-emerald-500/20 font-bold">← Nova Identificação</button>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-4 lg:col-span-3">
                    <div className="rounded-[2.5rem] overflow-hidden border-4 border-emerald-900/50 aspect-[3/4] shadow-2xl">
                      <img src={previewUrl!} alt="Planta" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="md:col-span-8 lg:col-span-9">
                    <AnalysisCard analysis={result} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
