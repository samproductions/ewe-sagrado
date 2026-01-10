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
    if (session) {
      setIsLoggedIn(true);
    }

    const saved = localStorage.getItem('ewe_ai_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (analysis: PlantAnalysis, preview: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      title: analysis.suggestedTitle,
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

  const clearHistory = () => {
    if (confirm("Deseja realmente apagar todo o seu histórico de axé?")) {
      setHistory([]);
      localStorage.removeItem('ewe_ai_history');
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#061a11] text-slate-100 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-md"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        history={history} 
        onSelect={selectFromHistory} 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClear={clearHistory}
        activeId={history.find(h => h.analysis === result)?.id}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-5 border-b border-emerald-900/30 bg-[#061a11]/90 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-emerald-500 hover:bg-emerald-900/30 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
             <span className="text-emerald-500 font-black tracking-tighter text-xl">Ewe Expert</span>
          </div>
          <button onClick={handleLogout} className="text-red-500/70 text-[10px] font-black uppercase tracking-widest p-2">Sair</button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            <div className="hidden md:flex justify-end mb-8">
              <button 
                onClick={handleLogout}
                className="text-[10px] text-slate-500 hover:text-red-400 font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 bg-emerald-950/20 px-6 py-3 rounded-2xl border border-emerald-900/30"
              >
                Encerrar Sessão
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
              </button>
            </div>

            {status === AppStatus.IDLE && (
              <div className="flex-1 flex flex-col justify-center">
                <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <span className="text-5xl">🌿</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-serif tracking-tight">Ewe Expert</h1>
                  <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                    "O saber das folhas é o despertar dos Orixás."<br/>
                    <span className="text-emerald-500 font-black mt-4 block italic text-sm tracking-[0.4em] uppercase opacity-60">Nação Ketu • Identificação Ancestral</span>
                  </p>
                </section>
                <div className="animate-in fade-in zoom-in-95 delay-300">
                  <ImageUploader onImageSelect={handleImageSelect} />
                </div>
              </div>
            )}

            {status === AppStatus.LOADING && <LoadingState />}

            {status === AppStatus.ERROR && (
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-[#120a0a] border border-red-500/20 p-12 rounded-[3rem] text-center max-w-lg shadow-2xl animate-in zoom-in-95">
                  <span className="text-5xl mb-6 block">🍂</span>
                  <h3 className="text-red-500 font-black uppercase tracking-[0.2em] text-xs mb-4">Interferência no Axé</h3>
                  <p className="text-red-200/80 mb-8 text-lg font-medium leading-relaxed">
                    {error}
                  </p>
                  <button 
                    onClick={reset}
                    className="bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/40"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}

            {status === AppStatus.SUCCESS && result && (
              <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex justify-between items-center sticky top-0 z-20 py-4 bg-[#061a11]/90 backdrop-blur-xl border-b border-emerald-900/30">
                  <button 
                    onClick={reset}
                    className="bg-emerald-500 text-[#061a11] hover:bg-emerald-400 px-8 py-3 rounded-2xl flex items-center gap-3 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Nova Consulta
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4">
                    <div className="sticky top-28">
                      <div className="rounded-[3rem] overflow-hidden border-[6px] border-[#0a2016] shadow-2xl relative aspect-[3/4] group">
                        <img src={previewUrl!} alt="Folha de Axé" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                           <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1 opacity-80">Registro Fotográfico</p>
                           <p className="text-white font-serif italic text-lg">{result.commonName}</p>
                        </div>
                      </div>
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