
import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { extractTextFromImage, extractTextFromPdf } from '../services/geminiService';

interface Props {
  value: string;
  onChange: (val: string) => void;
  label: string;
  placeholder: string;
  height?: string;
  className?: string;
}

const SmartTextArea: React.FC<Props> = ({ value, onChange, label, placeholder, height = "h-64", className = "" }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // 1. File Size Check (4MB)
    if (file.size > 4 * 1024 * 1024) {
        alert("Arquivo muito grande. Limite de 4MB para leitura automática.");
        return;
    }

    setIsLoading(true);
    try {
        let extractedText = "";
        
        // Robust Type Detection
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);
        const isText = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md');

        if (isPdf) {
             // PDF Extraction via Gemini (handling OCR automatically)
             const reader = new FileReader();
             extractedText = await new Promise<string>((resolve, reject) => {
                reader.onload = async (e) => {
                    const base64String = e.target?.result as string;
                    if (!base64String) { reject("Erro na leitura do arquivo"); return; }
                    
                    const base64 = base64String.split(',')[1];
                    try {
                        const text = await extractTextFromPdf(base64);
                        resolve(text);
                    } catch (err) { reject(err); }
                };
                reader.onerror = () => reject("Erro ao ler arquivo localmente");
                reader.readAsDataURL(file);
             });
        } 
        else if (isImage) {
            // Image OCR via Gemini
            const reader = new FileReader();
            extractedText = await new Promise<string>((resolve, reject) => {
                reader.onload = async (e) => {
                    const base64String = e.target?.result as string;
                    if (!base64String) { reject("Erro na leitura da imagem"); return; }

                    const base64 = base64String.split(',')[1];
                    try {
                        // Ensure a fallback mime type if detected type is empty
                        const mime = file.type || 'image/jpeg';
                        const text = await extractTextFromImage(base64, mime);
                        resolve(text);
                    } catch (err) { reject(err); }
                };
                reader.onerror = () => reject("Erro ao ler imagem");
                reader.readAsDataURL(file);
             });
        } 
        else if (isText) {
            // Plain Text
            extractedText = await file.text();
        } else {
            alert("Formato não suportado. Use PDF, Imagem ou TXT.");
            setIsLoading(false);
            return;
        }

        if (extractedText && extractedText.trim()) {
            onChange(extractedText);
            setActiveTab('text'); // Switch back to text view to show result
        } else {
            alert("A IA não conseguiu identificar texto neste arquivo. Se for um PDF digitalizado de baixa qualidade, tente uma foto nítida.");
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao processar arquivo. O servidor de IA pode estar ocupado ou o arquivo é inválido.");
    } finally {
        setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
      }
  };

  return (
    <div className={`flex flex-col ${className}`}>
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-700">{label}</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('text')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${activeTab === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <FileText className="w-3 h-3"/> Digitar/Colar
                </button>
                <button 
                    onClick={() => setActiveTab('file')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${activeTab === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Upload className="w-3 h-3"/> Enviar Arquivo
                </button>
            </div>
        </div>

        {activeTab === 'text' ? (
            <textarea 
                className={`w-full p-4 border border-slate-200 rounded-xl ${height} focus:ring-2 focus:ring-blue-500 outline-none font-sans text-sm resize-y`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            ></textarea>
        ) : (
            <div 
                className={`w-full ${height} border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 relative overflow-hidden
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-100'}
                `}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !isLoading && fileInputRef.current?.click()}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center gap-3 animate-pulse">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-sm font-medium text-slate-600">Extraindo texto do arquivo...</p>
                    </div>
                ) : (
                    <>
                         <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                             <Upload className="w-8 h-8 text-blue-500" />
                         </div>
                         <h4 className="font-semibold text-slate-700">Clique ou arraste seu arquivo</h4>
                         <p className="text-xs text-slate-500 mt-1">PDF (Texto ou Imagem) ou JPG/PNG</p>
                         <div className="flex gap-2 mt-4">
                             <span className="bg-slate-200 px-2 py-1 rounded text-[10px] text-slate-600 font-mono">.PDF</span>
                             <span className="bg-slate-200 px-2 py-1 rounded text-[10px] text-slate-600 font-mono">.JPG</span>
                             <span className="bg-slate-200 px-2 py-1 rounded text-[10px] text-slate-600 font-mono">.PNG</span>
                         </div>
                    </>
                )}
                <input 
                    ref={fileInputRef} 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.txt,.md,.png,.jpg,.jpeg,application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
                />
            </div>
        )}
    </div>
  );
};

export default SmartTextArea;
