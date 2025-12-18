import React, { useState } from 'react';
import { ArrowLeft, Linkedin, Copy, Check } from 'lucide-react';
import { generateLinkedInProfile } from '../services/geminiService';
import SmartTextArea from './SmartTextArea';

interface Props {
  onBack: () => void;
}

const LinkedInGenerator: React.FC<Props> = ({ onBack }) => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!resumeText) return;
    setLoading(true);
    try {
      const data = await generateLinkedInProfile(resumeText);
      setResult(data);
    } catch (e) {
      alert("Erro ao gerar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden pb-8">
      <div className="bg-[#0077b5] p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><Linkedin /> LinkedIn Pro</h2>
        <p className="opacity-90">Gere um perfil campeão com base no seu currículo.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8">
        {!result ? (
            <div className="space-y-6">
                <p className="text-slate-600">Envie seu currículo atual (PDF, Imagem ou Texto) para criarmos seu perfil.</p>
                <SmartTextArea 
                    label="Seu Currículo"
                    placeholder="Cole o texto ou envie o arquivo..."
                    value={resumeText}
                    onChange={setResumeText}
                    height="h-48"
                />

                <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-[#0077b5] text-white font-bold py-4 rounded-xl hover:bg-[#006097] transition-colors shadow-lg"
                >
                    {loading ? 'Gerando Perfil...' : 'Gerar Perfil LinkedIn'}
                </button>
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in">
                {/* Headline */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-800">Título Profissional (Headline)</h3>
                        <button onClick={() => copyToClipboard(result.headline, 'headline')} className="text-[#0077b5] hover:underline text-xs flex items-center gap-1">
                            {copied === 'headline' ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} Copiar
                        </button>
                    </div>
                    <p className="text-lg font-medium text-slate-700">{result.headline}</p>
                </div>

                {/* About Sections */}
                <div className="space-y-4">
                     <h3 className="font-bold text-slate-800">Sobre (Escolha uma versão)</h3>
                     
                     {['aboutShort', 'aboutMedium', 'aboutLong'].map((key) => (
                        <div key={key} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">
                                    {key === 'aboutShort' ? 'Curto (Twitter Pitch)' : (key === 'aboutMedium' ? 'Médio (Padrão)' : 'Longo (Storytelling)')}
                                </span>
                                <button onClick={() => copyToClipboard(result[key], key)} className="text-[#0077b5] hover:underline text-xs flex items-center gap-1">
                                    {copied === key ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} Copiar
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{result[key]}</p>
                        </div>
                     ))}
                </div>

                {/* Skills */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3">Top Competências</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.skills?.map((s: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                 <button 
                    onClick={() => setResult(null)}
                    className="block mx-auto text-slate-400 hover:text-slate-700 mt-8"
                >
                    Começar de novo
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInGenerator;