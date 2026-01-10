
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Iniciando Visão de Ossain...",
  "Analisando Morfologia Foliar...",
  "Mapeando Nervuras e Àṣẹ...",
  "Consultando Oráculo das Folhas...",
  "Identificando Linhagem de Ketu...",
  "Consolidando Fundamentos..."
];

const LoadingState: React.FC<{ previewUrl?: string | null }> = ({ previewUrl }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-500">
      <div className="relative w-72 h-96 mb-8 rounded-[2.5rem] overflow-hidden border-4 border-emerald-500/30 shadow-2xl">
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img src={previewUrl} className="w-full h-full object-cover grayscale opacity-40" alt="Scanning" />
            {/* Scanner Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-[scan_3s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-emerald-950/50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
          {MESSAGES[msgIndex]}
        </h3>
        <p className="text-emerald-500/60 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Identificação em Tempo Real
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
