
import React, { useState, useCallback, useEffect } from 'react';
import { analyzePlantImage } from './services/geminiService';
import { PlantAnalysis, AppStatus, HistoryItem } from './types';
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
    const saved = localStorage.getItem('ewe_ai_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar histórico");
      }
    }
  }, []);

  const saveToHistory = (analysis: PlantAnalysis, preview: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      title: analysis.suggestedTitles || analysis.commonName,
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
        
        // Validação de segurança: se a análise vier incompleta, preenchemos o básico
        const validAnalysis: PlantAnalysis = {
          scientificName: analysis.scientificName || "Não identificado",
          commonName: analysis.commonName || "Planta Desconhecida",
          orixRuling: analysis.orixRuling || "Consulte um Zelador",
          fundamento: analysis.fundamento || "Neutro",
          fundamentoExplanation: analysis.fundamentoExplanation || "Não foi possível detalhar o fundamento.",
          eweClassification: analysis.eweClassification || "Geral",
          ritualNature: analysis.ritualNature || "Uso Geral",
          applicationLocation: analysis.applicationLocation || ["Corpo"],
          stepByStepInstructions: analysis.stepByStepInstructions || ["Lave a folha em água corrente"],
          prayer: analysis.prayer || { title: "Prece", text: "Que o axé desta folha traga luz." },
          goldenTips: analysis.goldenTips || { title: "Dica", content: "Mantenha o respeito à natureza." },
          elements: analysis.elements || "Terra",
          historicalContext: analysis.historicalContext || "Sem dados históricos.",
          safetyWarnings: analysis.safetyWarnings || "Nenhum",
          suggestedTitles: analysis.suggestedTitles || "Folha Sagrada"
        };

        setResult(validAnalysis);
        setStatus(AppStatus.SUCCESS);
        saveToHistory(validAnalysis, b64);
      } catch (err) {
        console.error("Erro na análise:", err);
        setError("O segredo da mata exige clareza. Tente outra foto ou verifique sua conexão.");
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

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ewe_ai_history');
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#061a11] text-slate-100 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
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
        <header className="md:hidden flex items-center justify-between p-4 border-b border-emerald-900/50 bg-[#061a11]/80">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
             <span className="text-emerald-500 font-bold">Ewe Expert</span>
          </div>
          <div className="w-8"></div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {status === AppStatus.IDLE && (
              <div className="flex-1 flex flex-col justify-center">
                <section className="text-center mb-12">
                  <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-emerald-400 font-serif">Ewe Expert</h1>
                  <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    "Identificação Sagrada e Fundamento Ancestral."
                  </p>
                </section>
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
            )}

            {status === AppStatus.LOADING && <LoadingState />}

            {status === AppStatus.ERROR && (
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-[2rem] text-center max-w-md">
                  <span className="text-4xl mb-4 block">🍂</span>
                  <p className="text-red-400 mb-6 text-lg">{error}</p>
                  <button onClick={reset} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold">
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}

            {status === AppStatus.SUCCESS && result && (
              <div className="space-y-10 py-6">
                <div className="flex justify-between items-center sticky top-0 z-10 py-2 bg-[#061a11]/90 backdrop-blur-sm">
                  <button onClick={reset} className="bg-emerald-900/30 text-emerald-400 hover:bg-emerald-800/50 px-5 py-2 rounded-full flex items-center gap-2 border border-emerald-500/20 text-sm font-bold">
                    Nova Identificação
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-4 lg:col-span-3">
                    <div className="rounded-[2.5rem] overflow-hidden border-4 border-emerald-900/50 aspect-[3/4]">
                      <img src={previewUrl!} alt="Planta" className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-6 p-5 bg-emerald-950/40 rounded-3xl border border-emerald-500/10 text-center">
                      <p className="italic text-xl text-slate-100 font-serif">{result.scientificName}</p>
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
