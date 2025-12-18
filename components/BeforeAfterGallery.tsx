
import React from 'react';
import { ArrowLeft, Check, X, Star } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const BeforeAfterGallery: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto bg-slate-50 rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-screen pb-10">
      <div className="bg-cyan-600 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2">Transformação Real</h2>
        <p className="opacity-90 text-cyan-100">Veja a diferença visual entre um currículo comum e um gerado pela nossa IA.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8 space-y-16">
        
        {/* Visual Comparison Container */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            
            {/* The BAD Resume (Paper Look) */}
            <div className="relative group w-full max-w-sm">
                <div className="absolute -top-4 -left-4 bg-red-500 text-white px-4 py-1 rounded-full font-bold shadow-lg z-20 flex items-center gap-2">
                    <X className="w-4 h-4" /> ANTES
                </div>
                <div className="bg-white h-[450px] w-full shadow-md border border-slate-200 p-8 relative opacity-90 grayscale-[50%]">
                    {/* Messy Content */}
                    <div className="font-serif text-slate-800">
                        <h1 className="text-xl text-center mb-1">José da Silva</h1>
                        <p className="text-xs text-center mb-6">Brasileiro, Solteiro, 25 anos. Rua X, Bairro Y.</p>

                        <p className="font-bold text-sm underline mb-1">Objetivo</p>
                        <p className="text-xs mb-4">Quero trabalhar na empresa para crescer.</p>

                        <p className="font-bold text-sm underline mb-1">Experiência Profissional</p>
                        <ul className="text-xs list-disc pl-4 space-y-1 mb-4">
                            <li>Vendedor (2020-2022) - Fazia vendas.</li>
                            <li>Atendente (2019) - Atendia telefone.</li>
                        </ul>

                        <p className="font-bold text-sm underline mb-1">Cursos</p>
                        <p className="text-xs">Informática básica. Inglês básico.</p>
                    </div>

                    {/* Annotations */}
                    <div className="absolute top-1/3 left-4 right-4 bg-red-100/90 text-red-700 text-xs p-2 rounded border border-red-200 text-center font-bold rotate-[-2deg]">
                        Muito vago! Sem detalhes.
                    </div>
                    <div className="absolute bottom-1/4 left-4 right-4 bg-red-100/90 text-red-700 text-xs p-2 rounded border border-red-200 text-center font-bold rotate-[1deg]">
                        Visual cansativo e antigo.
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-slate-300">
                <ArrowLeft className="w-12 h-12 rotate-180" />
            </div>

            {/* The GOOD Resume (Paper Look) */}
            <div className="relative group w-full max-w-sm">
                 <div className="absolute -top-6 -right-4 bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-xl z-20 flex items-center gap-2 animate-bounce">
                    <Check className="w-5 h-5" /> DEPOIS
                </div>
                
                <div className="bg-white h-[480px] w-full shadow-2xl border border-slate-100 relative overflow-hidden transform md:-translate-y-4 transition-transform duration-500 hover:scale-[1.02]">
                    {/* Modern Header */}
                    <div className="h-24 bg-slate-800 p-6 flex justify-between items-center text-white">
                        <div>
                            <h1 className="text-xl font-bold uppercase tracking-wide">José Silva</h1>
                            <p className="text-xs text-blue-300 font-medium">Especialista em Vendas</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-600 rounded-full border-2 border-white/20"></div>
                    </div>

                    {/* Content Columns */}
                    <div className="flex h-full">
                        {/* Sidebar */}
                        <div className="w-1/3 bg-slate-50 p-4 border-r border-slate-100">
                            <div className="mb-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Contato</p>
                                <div className="h-1 w-full bg-slate-300 rounded mb-1"></div>
                                <div className="h-1 w-2/3 bg-slate-300 rounded"></div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Habilidades</p>
                                <div className="flex flex-wrap gap-1">
                                    <span className="h-3 w-8 bg-blue-100 rounded"></span>
                                    <span className="h-3 w-10 bg-blue-100 rounded"></span>
                                    <span className="h-3 w-6 bg-blue-100 rounded"></span>
                                </div>
                            </div>
                        </div>

                        {/* Main Body */}
                        <div className="w-2/3 p-4">
                            <div className="mb-4">
                                <p className="text-[10px] font-bold text-blue-800 uppercase border-b border-blue-100 mb-2">Resumo Profissional</p>
                                <p className="text-[8px] text-slate-600 leading-relaxed">
                                    Profissional com 3 anos de experiência focada em resultados. Aumentou o faturamento em 20% através de técnicas de negociação avançada.
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-800 uppercase border-b border-blue-100 mb-2">Experiência</p>
                                <div className="mb-2">
                                    <div className="flex justify-between mb-1">
                                        <div className="h-2 w-20 bg-slate-800 rounded"></div>
                                        <div className="h-2 w-10 bg-slate-300 rounded"></div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-1 w-full bg-slate-400 rounded"></div>
                                        <div className="h-1 w-full bg-slate-400 rounded"></div>
                                        <div className="h-1 w-3/4 bg-slate-400 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticker */}
                    <div className="absolute bottom-6 right-6 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Aprovado por IAs
                    </div>
                </div>
            </div>
        </div>

        {/* Feature List */}
        <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h3 className="text-center font-bold text-slate-800 text-xl mb-6">O que mudou exatamente?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                    <h4 className="font-bold text-slate-700 mb-1">Clareza Visual</h4>
                    <p className="text-sm text-slate-500">O recrutador encontra o que precisa em menos de 6 segundos.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                    <h4 className="font-bold text-slate-700 mb-1">Conteúdo Rico</h4>
                    <p className="text-sm text-slate-500">Frases genéricas ("Sou esforçado") viram resultados ("Aumentei vendas em 20%").</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                    <h4 className="font-bold text-slate-700 mb-1">Compatível com Robôs</h4>
                    <p className="text-sm text-slate-500">Estrutura que passa pelos filtros automáticos (ATS) das grandes empresas.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BeforeAfterGallery;
