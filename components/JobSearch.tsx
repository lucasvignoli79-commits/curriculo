
import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Briefcase, ExternalLink, Globe, Building, DollarSign, Clock, Link as LinkIcon, Info } from 'lucide-react';
import { searchJobs } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  onBack: () => void;
}

const JobSearch: React.FC<Props> = ({ onBack }) => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [rawResult, setRawResult] = useState<string>('');
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!role || !location) {
        alert("Preencha o cargo e a cidade.");
        return;
    }
    setLoading(true);
    setRawResult('');
    setGroundingLinks([]);
    
    try {
      const data = await searchJobs(role, location);
      setRawResult(data.rawText);
      setGroundingLinks(data.chunks);
    } catch (e) {
      alert("Erro ao buscar vagas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><Globe className="w-8 h-8" /> Vagas em Tempo Real</h2>
        <p className="opacity-90">Pesquise oportunidades ativas na sua região.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Search Form - Modern & Clean */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo ou Área</label>
                 <div className="relative group">
                     <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                     <input 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Ex: Auxiliar Administrativo"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800 font-medium transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                     />
                 </div>
             </div>
             <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cidade / Região</label>
                 <div className="relative group">
                     <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                     <input 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ex: São Paulo, SP"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800 font-medium transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                     />
                 </div>
             </div>
             <div className="flex items-end">
                 <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                 >
                    {loading ? 'Buscando...' : <>Buscar Vagas <Search className="w-4 h-4" /></>}
                 </button>
             </div>
        </div>

        {/* Results */}
        {(rawResult || groundingLinks.length > 0) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
                
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    Análise de Oportunidades
                </h3>

                {rawResult && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 prose prose-slate max-w-none">
                        <MarkdownRenderer content={rawResult} />
                    </div>
                )}

                {/* Grounding / Fallback Links - MANDATORY BY GEMINI GUIDELINES */}
                {groundingLinks.length > 0 && (
                     <div className="mt-8 pt-8 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4"/> Links Verificados da Pesquisa Google
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {groundingLinks.map((chunk: any, i: number) => {
                                const url = chunk.web?.uri;
                                const title = chunk.web?.title;
                                if (!url) return null;
                                return (
                                    <a 
                                        key={i} 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex flex-col p-4 bg-white border border-slate-200 hover:border-blue-300 rounded-xl hover:shadow-md transition-all group"
                                    >
                                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-700 line-clamp-2 mb-2">{title || "Vaga de Emprego"}</span>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xs text-slate-400 truncate max-w-[150px]">{new URL(url).hostname}</span>
                                            <ExternalLink className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!rawResult && !loading && groundingLinks.length === 0 && (
                    <div className="text-center py-10">
                        <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Nenhuma vaga encontrada para estes critérios. Tente termos mais amplos.</p>
                    </div>
                )}

                 <button 
                    onClick={() => { setRawResult(''); setGroundingLinks([]); }}
                    className="block mx-auto text-slate-400 hover:text-slate-700 mt-8 font-medium"
                >
                    Fazer nova busca
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
