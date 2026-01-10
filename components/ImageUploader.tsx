import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
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

          // Redimensionamento agressivo para 1000px - ideal para leitura de IA e leve para upload
          const MAX_SIZE = 1000;
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
          
          // Limpa o canvas e desenha a imagem
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Qualidade 0.5 (50%) reduz o arquivo de 10MB para ~150kb, eliminando erros de cota por tamanho
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], "folha_scan.jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.5); 
        };
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsCompressing(true);
      try {
        const originalFile = e.target.files[0];
        // Sempre comprimimos fotos da câmera para garantir que o iPhone não trave a API
        const processedFile = await compressImage(originalFile);
        onImageSelect(processedFile);
      } catch (err) {
        console.error("Erro na compressão:", err);
        if (e.target.files?.[0]) onImageSelect(e.target.files[0]);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const triggerInput = () => {
    if (!isCompressing) fileInputRef.current?.click();
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      <div 
        onClick={triggerInput}
        className={`group relative cursor-pointer border-2 border-dashed border-emerald-800/50 bg-emerald-900/10 hover:bg-emerald-900/20 hover:border-emerald-500/50 rounded-[2.5rem] p-10 md:p-12 transition-all duration-300 flex flex-col items-center justify-center gap-6 ${isCompressing ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
        
        <div className="w-20 h-20 bg-emerald-950 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border border-emerald-500/20">
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
            {isCompressing ? 'Otimizando foto...' : 'Toque para Identificar'}
          </p>
          <p className="text-slate-500 text-sm max-w-[250px] mx-auto">
            {isCompressing ? 'Preparando imagem para os Orixás...' : 'Tire uma foto nítida da folha ou escolha da galeria'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {['Candomblé', 'Umbanda', 'Botânica'].map(tag => (
            <div key={tag} className="px-3 py-1 bg-emerald-900/40 rounded-full text-[10px] text-emerald-400 font-black uppercase tracking-widest border border-emerald-500/10">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;