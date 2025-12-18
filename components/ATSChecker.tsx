import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, AlertCircle, Check, X } from 'lucide-react';
import { checkATS } from '../services/geminiService';
import SmartTextArea from './SmartTextArea';

interface Props {
  onBack: () => void;
}

const ATSChecker: React.FC<Props> = ({ onBack }) => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!resumeText) return;
    setLoading(true);
    try {
      const data = await checkATS(resumeText);
      setResult(data);
    } catch (e) {
      alert("Erro na análise ATS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden pb-8">
      <div className="bg-slate-800 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><ShieldCheck className="text-emerald-400" /> ATS Checker</h2>
        <p className="opacity-90">Verifique se seu currículo passa pelos robôs de recrutamento.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8">
        {!result ? (
            <div className="space-y-6">
                <p className="text-slate-600 mb-4">Envie seu currículo em PDF, Imagem ou Texto para uma varredura completa de legibilidade.</p>
                
                <SmartTextArea 
                    label="Conteúdo do Currículo"
                    placeholder="Cole o texto ou arraste seu arquivo aqui..."
                    value={resumeText}
                    onChange={setResumeText}
                    height="h-64"
                />

                <button 
                    onClick={handleCheck}
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
                >
                    {loading ? 'Escaneando...' : 'Verificar Compatibilidade ATS'}
                </button>
            </div>
        ) : (
            <div className="space-y-8">
                <div className="flex items-center justify-between bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Pontuação ATS</h3>
                        <p className="text-sm text-slate-500">Baseado em legibilidade e estrutura</p>
                    </div>
                    <div className={`text-4xl font-extrabold ${result.score > 80 ? 'text-emerald-600' : (result.score > 50 ? 'text-yellow-600' : 'text-red-600')}`}>
                        {result.score}/100
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 border-b pb-2">Diagnóstico</h3>
                    
                    {result.errors?.length > 0 && (
                        <div className="space-y-2">
                             {result.errors.map((err: string, i: number) => (
                                 <div key={i} className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                     <X className="w-5 h-5 shrink-0" /> {err}
                                 </div>
                             ))}
                        </div>
                    )}
                     {result.warnings?.length > 0 && (
                        <div className="space-y-2">
                             {result.warnings.map((warn: string, i: number) => (
                                 <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                                     <AlertCircle className="w-5 h-5 shrink-0" /> {warn}
                                 </div>
                             ))}
                        </div>
                    )}
                    {result.errors?.length === 0 && result.warnings?.length === 0 && (
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-3">
                            <Check className="w-5 h-5" /> Seu currículo está perfeitamente otimizado!
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Palavras-chave Encontradas</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.keywordsFound?.map((k: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                                {k}
                            </span>
                        ))}
                    </div>
                </div>

                 <button 
                    onClick={() => setResult(null)}
                    className="w-full py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                >
                    Nova Verificação
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;