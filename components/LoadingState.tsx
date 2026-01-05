
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Consultando as folhas sagradas...",
  "Ouvindo o sussurro da mata...",
  "Osun está purificando a imagem...",
  "Ossain está revelando o mistério...",
  "Buscando o axé desta planta...",
  "Tecendo o conhecimento ancestral..."
];

const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-emerald-500/20 rounded-full animate-spin border-t-emerald-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🌿</span>
        </div>
      </div>
      <p className="text-xl font-medium text-emerald-400 text-center animate-bounce">
        {MESSAGES[msgIndex]}
      </p>
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_100ms]"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_300ms]"></div>
      </div>
    </div>
  );
};

export default LoadingState;
