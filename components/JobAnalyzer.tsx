import React, { useState } from 'react';
import { ArrowLeft, Search, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { analyzeJobMatch } from '../services/geminiService';
import SmartTextArea from './SmartTextArea';

interface Props {
  onBack: () => void;
}

const JobAnalyzer: React.FC<Props> = ({ onBack }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
        alert("Por favor, preencha os dois campos (Currículo e Vaga).");
        return;
    }
    setLoading(true);
    try {
      const data = await analyzeJobMatch(resumeText, jobDescription);
      setResult(data);
    } catch (e) {
      alert("Erro na análise. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden pb-8">
      <div className="bg-indigo-600 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><Search /> Analisar Vaga (Match)</h2>
        <p className="opacity-90">Cole seu CV e a descrição da vaga para ver suas chances.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8 space-y-6">
        {!result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SmartTextArea 
                    label="Seu Currículo"
                    placeholder="Cole o texto ou envie o arquivo PDF/Imagem do seu currículo..."
                    value={resumeText}
                    onChange={setResumeText}
                />
                
                <SmartTextArea 
                    label="Descrição da Vaga"
                    placeholder="Cole a descrição da vaga ou envie um print/PDF da vaga..."
                    value={jobDescription}
                    onChange={setJobDescription}
                />

                <div className="md:col-span-2 mt-4">
                    <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Analisando Compatibilidade...' : 'Calcular Match com IA'}
                    </button>
                </div>
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Score */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-indigo-100 bg-indigo-50">
                        <span className="text-4xl font-extrabold text-indigo-600">{result.score}%</span>
                    </div>
                    <p className="text-slate-500 mt-2 font-medium">Probabilidade de Entrevista</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Missing */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5"/> Palavras-chave Faltando</h3>
                        <ul className="space-y-2">
                            {result.missingKeywords?.map((k: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-red-600 bg-white px-3 py-2 rounded border border-red-100">
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span> {k}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                         <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-4"><Lightbulb className="w-5 h-5"/> Sugestões de Ajuste</h3>
                         <ul className="space-y-2">
                            {result.suggestions?.map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" /> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button 
                    onClick={() => setResult(null)}
                    className="block mx-auto text-slate-500 hover:text-indigo-600 font-medium"
                >
                    Analisar outra vaga
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default JobAnalyzer;