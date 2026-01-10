
import React, { useState, useCallback, useEffect } from 'react';
import { analyzePlantImage } from './services/geminiService';
import { PlantAnalysis, AppStatus, HistoryItem } from './types';
import { authService } from './services/authService';
import Sidebar from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import AnalysisCard from './components/AnalysisCard';
import LoadingState from './components/LoadingState';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<PlantAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session) setIsLoggedIn(true);
    const saved = localStorage.getItem('ewe_ai_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (analysis: PlantAnalysis, preview: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      title: analysis.commonName,
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
        setResult(analysis);
        setStatus(AppStatus.SUCCESS);
        saveToHistory(analysis, b64);
      } catch (err: any) {
        setError(err.message);
        setStatus(AppStatus.ERROR);
      }
    };
    reader.readAsDataURL(file);
  }, [history]);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    reset();
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
      {isSidebarOpen && <div className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />}

      <Sidebar 
        history={history} 
        onSelect={(item) => { setResult(item.analysis); setPreviewUrl(item.previewUrl); setStatus(AppStatus.SUCCESS); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClear={() => { setHistory([]); localStorage.removeItem('ewe_ai_history'); }}
        activeId={history.find(h => h.analysis === result)?.id}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-5 bg-[#061a11]/90 border-b border-emerald-900/30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="text-emerald-500 font-black tracking-tighter text-xl">Ewe Expert</span>
          <button onClick={handleLogout} className="text-red-500/70 text-[10px] font-black uppercase">Sair</button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-12">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            {status === AppStatus.IDLE && (
              <div className="flex-1 flex flex-col justify-center">
                <section className="text-center mb-12">
                  <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">Ewe Expert</h1>
                  <p className="text-slate-400 text-lg">"Ko si ewe, ko si orisa" - Sem folha, não há Orixá.</p>
                </section>
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
            )}

            {status === AppStatus.LOADING && <LoadingState previewUrl={previewUrl} />}

            {status === AppStatus.ERROR && (
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-[#120a0a] p-12 rounded-[3rem] text-center max-w-lg border border-red-500/20">
                  <span className="text-5xl mb-6 block">🍂</span>
                  <p className="text-red-200/80 mb-8 text-lg font-medium">{error}</p>
                  <button onClick={reset} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Tentar Novamente</button>
                </div>
              </div>
            )}

            {status === AppStatus.SUCCESS && result && (
              <div className="py-8 animate-in fade-in slide-in-from-bottom-6">
                <div className="flex justify-between items-center mb-8">
                  <button onClick={reset} className="bg-emerald-500 text-[#061a11] px-6 py-3 rounded-2xl text-xs font-black uppercase">Nova Foto</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4">
                    <div className="rounded-[3rem] overflow-hidden border-8 border-[#0a2016] shadow-2xl aspect-[3/4]">
                      <img src={previewUrl!} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="lg:col-span-8">
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
