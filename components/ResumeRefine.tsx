
import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, X, Sparkles, Camera } from 'lucide-react';
import { FileUpload } from '../types';

interface Props {
  onSubmit: (text: string, file?: FileUpload, userPhoto?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ResumeRefine: React.FC<Props> = ({ onSubmit, onCancel, isLoading }) => {
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       if (!file.type.startsWith('image/')) return;
       const reader = new FileReader();
       reader.onload = (event) => setUserPhoto(event.target?.result as string);
       reader.readAsDataURL(file);
    }
  };

  const processFile = (file: File) => {
    // 1. Check File Size (Limit to ~4MB for inline API stability)
    if (file.size > 4 * 1024 * 1024) {
        alert("O arquivo é muito grande. Por favor, envie um arquivo menor que 4MB.");
        return;
    }

    // 2. Robust check for image or PDF
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);

    if (!isImage && !isPdf) {
      alert("Formato não suportado. Por favor, envie uma imagem (JPG, PNG) ou arquivo PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      // Handle cases where readAsDataURL might return incomplete data
      if (!base64String) return;
      
      const base64Data = base64String.split(',')[1];
      
      setUploadedFile({
        name: file.name,
        // CRITICAL: Force 'application/pdf' if extension matches, otherwise use detected type or fallback
        type: isPdf ? 'application/pdf' : (file.type || 'image/jpeg'),
        data: base64Data
      });
    };
    reader.onerror = () => {
        alert("Erro ao ler o arquivo. Tente novamente.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = () => {
    if (!textInput && !uploadedFile) {
      alert("Por favor, insira o texto ou envie o arquivo do currículo para continuar.");
      return;
    }
    onSubmit(textInput, uploadedFile || undefined, userPhoto || undefined);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
       <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            Refinar e Otimizar
            </h2>
            <p className="opacity-90 mt-2 text-emerald-50">
                Transforme seu currículo atual em uma versão de alto impacto.
            </p>
         </div>
         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Profile Photo Section */}
        <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div 
                className="w-20 h-20 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-emerald-500 overflow-hidden shrink-0"
                onClick={() => photoInputRef.current?.click()}
            >
                 {userPhoto ? (
                    <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                 ) : (
                    <Camera className="w-8 h-8 text-slate-400" />
                 )}
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-slate-700">Adicionar Foto de Perfil (Opcional)</h3>
                <p className="text-sm text-slate-500">Se você quiser que sua foto apareça na versão final, adicione-a aqui.</p>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                 {userPhoto && (
                    <button 
                        onClick={() => setUserPhoto('')}
                        className="text-xs text-red-500 mt-1 hover:underline"
                    >
                        Remover foto
                    </button>
                )}
            </div>
        </div>

        <div className="border-t border-slate-100 my-4"></div>
        
        {/* Upload Area */}
        <div 
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group relative
                ${dragActive ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'}
                ${uploadedFile ? 'bg-slate-50 border-emerald-500' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploadedFile && fileInputRef.current?.click()}
        >
            <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,.pdf,application/pdf" 
                className="hidden" 
                onChange={handleFileChange}
            />

            {uploadedFile ? (
                <div className="flex items-center justify-center gap-4 animate-in fade-in">
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                        {uploadedFile.type.includes('pdf') || uploadedFile.name.endsWith('.pdf') ? (
                            <FileText className="w-8 h-8 text-red-500" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-emerald-600" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-slate-800 text-lg">{uploadedFile.name}</p>
                        <p className="text-sm text-slate-500">Pronto para análise</p>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                        }}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-500 ml-4 z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="space-y-4 pointer-events-none">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10" />
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-slate-700">Enviar arquivo do currículo</p>
                        <p className="text-slate-500 mt-1">Arraste e solte PDF, JPG ou PNG (Máx 4MB)</p>
                    </div>
                </div>
            )}
        </div>

        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-medium">OU COLE O TEXTO</span>
            </div>
        </div>

        {/* Text Area */}
        <div>
            <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                placeholder="Cole o conteúdo do seu currículo aqui se preferir..."
            ></textarea>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-8 py-3 rounded-xl text-white font-bold text-lg flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5
                ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'}
            `}
          >
             {isLoading ? 'Otimizando...' : (
                <>
                Otimizar Agora <Sparkles className="w-5 h-5" />
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResumeRefine;
