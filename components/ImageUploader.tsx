import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 600px é o limite de segurança para o iPhone não travar o upload
          const MAX_SIZE = 600;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';
            ctx.drawImage(img, 0, 0, width, height);
          }

          canvas.toBlob((blob) => {
            if (blob) {
              // Convertendo para JPEG simples para remover metadados pesados do iPhone
              resolve(new File([blob], "scan.jpg", { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.3); // 30% de qualidade é o ideal para cota gratuita
        };
      };
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled && !isCompressing) {
      setIsCompressing(true);
      try {
        const optimized = await compressImage(file);
        onImageSelect(optimized);
      } finally {
        setIsCompressing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      <div 
        onClick={() => !disabled && !isCompressing && fileInputRef.current?.click()}
        className={`group relative cursor-pointer border-2 border-dashed border-emerald-800/50 bg-emerald-900/10 rounded-[2.5rem] p-10 transition-all duration-300 flex flex-col items-center justify-center gap-6 ${disabled || isCompressing ? 'opacity-40 grayscale cursor-not-allowed' : 'active:scale-95 hover:bg-emerald-900/20'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={disabled || isCompressing}
        />
        
        <div className="w-20 h-20 bg-emerald-950 rounded-full flex items-center justify-center shadow-xl border border-emerald-500/20">
          {isCompressing ? (
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-200 mb-2">
            {isCompressing ? 'Preparando Folha...' : 'Toque para Analisar'}
          </p>
          <p className="text-slate-500 text-sm">
            {isCompressing ? 'Reduzindo peso da imagem...' : 'Tire uma foto ou escolha da galeria'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;