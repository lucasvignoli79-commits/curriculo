import React, { useState, useRef, useEffect } from 'react';
import { PhotoStyle } from '../types';
import { Camera, Upload, RefreshCw, Download, User, Sparkles, X, ChevronRight, Image as ImageIcon, Video, Aperture } from 'lucide-react';

interface Props {
  onGenerate: (imageBase64: string, style: PhotoStyle) => Promise<string>;
  onCancel: () => void;
  isLoading: boolean;
}

const PhotoStudio: React.FC<Props> = ({ onGenerate, onCancel, isLoading }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>('classic');
  
  // Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const styles: { id: PhotoStyle; name: string; desc: string; color: string }[] = [
    { id: 'classic', name: 'Clássico', desc: 'Fundo cinza, terno, iluminação neutra', color: 'bg-slate-700' },
    { id: 'modern', name: 'Moderno', desc: 'Fundo claro minimalista, smart casual', color: 'bg-blue-600' },
    { id: 'corporate', name: 'Corporativo', desc: 'Escritório desfocado, look executivo', color: 'bg-indigo-800' },
    { id: 'bokeh', name: 'Bokeh', desc: 'Fundo externo desfocado, luz natural', color: 'bg-emerald-600' },
    { id: 'bw', name: 'P&B Elegante', desc: 'Preto e branco, alto contraste', color: 'bg-black' },
  ];

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [cameraStream]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        // Redimensionar imagem carregada para garantir compatibilidade
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 1024;
            let width = img.width;
            let height = img.height;

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
            ctx?.drawImage(img, 0, 0, width, height);
            setSourceImage(canvas.toDataURL('image/jpeg', 0.8));
            setResultImage(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      // Pedir explicitamente a câmera frontal ou traseira preferencialmente
      const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 }
          } 
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 300);
    } catch (err) {
      alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Limitar o tamanho da captura para otimizar o envio para a IA
      const MAX_WIDTH = 1024;
      const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
      
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Aplica o efeito de espelhamento apenas na captura se desejado,
        // mas o padrão é capturar como visto pelo usuário (que já está espelhado no preview)
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSourceImage(dataUrl);
        setResultImage(null);
        stopCamera();
      }
    }
  };

  const handleProcess = async () => {
    if (!sourceImage) return;
    // Extrair o base64 puro sem o cabeçalho data:image/jpeg;base64,
    const base64Data = sourceImage.split(',')[1];
    if (!base64Data) {
        alert("Erro no formato da imagem.");
        return;
    }

    try {
      const resultBase64 = await onGenerate(base64Data, selectedStyle);
      if (resultBase64) {
          setResultImage(`data:image/jpeg;base64,${resultBase64}`);
      } else {
          throw new Error("Resposta vazia");
      }
    } catch (error) {
      // Erro já tratado no componente pai, mas mostramos o feedback visual
      console.error("Erro na geração:", error);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `foto-profissional-${selectedStyle}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white relative">
        <div className="relative z-10">
           <h2 className="text-3xl font-bold flex items-center gap-3">
             <Camera className="w-8 h-8" /> Estúdio IA Profissional
           </h2>
           <p className="opacity-90 mt-2 text-violet-50 max-w-2xl">
             Envie uma selfie ou tire uma foto agora. Nossa IA transformará sua imagem em uma foto de perfil corporativa de estúdio.
           </p>
        </div>
        <div className="absolute -right-10 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="p-8">
        
        {/* CAMERA MODAL OVERLAY */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 aspect-[3/4] sm:aspect-video flex items-center justify-center">
               <video 
                 ref={videoRef} 
                 autoPlay 
                 playsInline 
                 muted
                 className="w-full h-full object-cover transform scale-x-[-1]" 
               ></video>
               
               <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
                 <button 
                   onClick={stopCamera}
                   className="p-4 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                   title="Cancelar"
                 >
                   <X className="w-6 h-6" />
                 </button>
                 
                 <button 
                   onClick={capturePhoto}
                   className="p-1 bg-white rounded-full hover:scale-105 transition-transform border-[6px] border-slate-300 shadow-xl"
                   title="Tirar Foto"
                 >
                   <div className="w-14 h-14 rounded-full border-2 border-slate-200 bg-white shadow-inner"></div>
                 </button>
                 
                 <div className="w-14 h-14"></div> {/* Spacer for symmetry */}
               </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-white font-medium text-lg">Centralize seu rosto</p>
                <p className="text-slate-400 text-sm">Certifique-se de estar em um local bem iluminado</p>
            </div>
          </div>
        )}

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {!sourceImage ? (
          /* Selection State */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto py-8 px-4">
             {/* Option 1: Upload */}
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="group p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-violet-500 hover:bg-violet-50 transition-all cursor-pointer text-center flex flex-col items-center justify-center min-h-[250px]"
             >
                 <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">Enviar Arquivo</h3>
                 <p className="text-slate-500 text-sm">Selecione uma foto da sua galeria (JPG, PNG)</p>
                 <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
             </div>

             {/* Option 2: Camera */}
             <div 
               onClick={startCamera}
               className="group p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-fuchsia-500 hover:bg-fuchsia-50 transition-all cursor-pointer text-center flex flex-col items-center justify-center min-h-[250px]"
             >
                 <div className="w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Aperture className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">Tirar Foto Agora</h3>
                 <p className="text-slate-500 text-sm">Use sua webcam ou câmera do celular</p>
             </div>
          </div>
        ) : (
          /* Editor State */
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Controls & Preview */}
            <div className="flex-1 space-y-6">
               
               {/* Source Preview */}
               <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <img src={sourceImage} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" alt="Original" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">Foto Original</p>
                    <button onClick={() => { setSourceImage(null); setResultImage(null); }} className="text-xs text-red-500 font-bold hover:underline">Trocar foto</button>
                  </div>
               </div>

               {/* Style Selection */}
               <div>
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-violet-600" /> Escolha o Estilo
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {styles.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        disabled={isLoading}
                        className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden
                          ${selectedStyle === style.id 
                            ? 'border-violet-600 bg-violet-50 ring-2 ring-violet-200' 
                            : 'border-slate-200 hover:border-violet-300 hover:bg-white'}
                        `}
                      >
                         <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-xs ${style.color}`}>
                           {style.name.substring(0,2).toUpperCase()}
                         </div>
                         <div>
                           <p className={`font-bold text-sm ${selectedStyle === style.id ? 'text-violet-900' : 'text-slate-700'}`}>{style.name}</p>
                           <p className="text-[10px] text-slate-500 leading-tight">{style.desc}</p>
                         </div>
                      </button>
                    ))}
                 </div>
               </div>

               {/* Action Button */}
               <div className="pt-4">
                 <button 
                   onClick={handleProcess}
                   disabled={isLoading}
                   className={`w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all shadow-xl
                     ${isLoading 
                       ? 'bg-slate-400 cursor-not-allowed' 
                       : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 hover:-translate-y-1 active:scale-95'}
                   `}
                 >
                    {isLoading ? (
                      <>Otimizando Foto... <RefreshCw className="w-5 h-5 animate-spin" /></>
                    ) : (
                      <>Gerar Foto Profissional <ChevronRight className="w-6 h-6" /></>
                    )}
                 </button>
               </div>
            </div>

            {/* Right: Result */}
            <div className="w-full lg:w-[500px] bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[450px] border border-slate-200 shadow-inner">
               {resultImage ? (
                 <div className="relative w-full h-full group animate-in fade-in zoom-in-95 duration-500">
                    <img src={resultImage} alt="Generated" className="w-full h-full object-contain max-h-[650px]" />
                    
                    {/* Overlay Controls */}
                    <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-6 border-t border-slate-200 flex flex-col gap-3">
                       <button 
                         onClick={handleDownload}
                         className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg active:scale-95"
                       >
                         <Download className="w-5 h-5" /> Baixar em Alta Qualidade
                       </button>
                       <p className="text-center text-[10px] text-slate-500">
                         Gere novamente se desejar um resultado diferente ou tente outro estilo.
                       </p>
                    </div>
                 </div>
               ) : (
                 <div className="text-center p-12 opacity-60 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                        <ImageIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-lg font-bold text-slate-600">
                      O resultado aparecerá aqui
                    </p>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
                      Nossa IA vai ajustar o fundo, iluminação e suas roupas para um visual de currículo executivo.
                    </p>
                 </div>
               )}
               
               {isLoading && !resultImage && (
                   <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                       <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
                           <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
                           <p className="text-sm font-bold text-slate-700">Refazendo iluminação...</p>
                       </div>
                   </div>
               )}
            </div>

          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
          {/* Fixed undefined variable 'onBack' by using 'onCancel' from props */}
          <button onClick={onCancel} className="text-slate-500 font-bold hover:text-slate-800 px-4 py-2 flex items-center gap-2 transition-colors">
            <X className="w-4 h-4" /> Cancelar e Sair
          </button>
        </div>

      </div>
    </div>
  );
};

export default PhotoStudio;