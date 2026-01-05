
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-xl mx-auto">
      <div 
        onClick={triggerInput}
        className="group relative cursor-pointer border-2 border-dashed border-emerald-800/50 bg-emerald-900/10 hover:bg-emerald-900/20 hover:border-emerald-500/50 rounded-[2.5rem] p-12 transition-all duration-300 flex flex-col items-center justify-center gap-6"
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
        
        <div className="w-20 h-20 bg-emerald-950 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border border-emerald-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-200 mb-2">Toque para Identificar</p>
          <p className="text-slate-500 text-sm">Capture uma foto da folha ou selecione da galeria</p>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="px-4 py-2 bg-emerald-900/40 rounded-full text-xs text-emerald-400 font-bold border border-emerald-500/20">
            Candomblé
          </div>
          <div className="px-4 py-2 bg-emerald-900/40 rounded-full text-xs text-emerald-400 font-bold border border-emerald-500/20">
            Umbanda
          </div>
          <div className="px-4 py-2 bg-emerald-900/40 rounded-full text-xs text-emerald-400 font-bold border border-emerald-500/20">
            Botânica
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
