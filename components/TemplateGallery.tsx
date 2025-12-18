
import React from 'react';
import { TemplateId, AppMode } from '../types';
import { Check, Briefcase, BookOpen, ArrowLeft } from 'lucide-react';

interface Props {
  onSelect: (template: TemplateId, mode: AppMode) => void;
  onCancel: () => void;
}

const templates: { id: TemplateId; name: string; description: string; tag: string }[] = [
  { 
    id: 'modern', 
    name: 'Moderno Azul', 
    description: 'Equilíbrio perfeito entre texto e design. Padrão internacional aceito em 99% das empresas.', 
    tag: 'Recomendado'
  },
  { 
    id: 'vertical', 
    name: 'Coluna Vermelha', 
    description: 'Destaque lateral forte. Ótimo para separar visualmente suas habilidades da experiência.', 
    tag: 'Destaque Visual'
  },
  { 
    id: 'informal', 
    name: 'Verde Natural', 
    description: 'Layout leve e amigável. Excelente para áreas de saúde, biologia e terceiro setor.', 
    tag: 'Amigável'
  },
  { 
    id: 'horizontal', 
    name: 'Executivo Pro', 
    description: 'Cabeçalho expandido horizontalmente. Ideal para cargos de gestão e liderança.', 
    tag: 'Executivo'
  },
  { 
    id: 'classic', 
    name: 'Clássico Serifado', 
    description: 'Tipografia tradicional e séria. A escolha certa para Direito, Academia e Medicina.', 
    tag: 'Tradicional'
  },
  { 
    id: 'metro', 
    name: 'Urbano Negrito', 
    description: 'Alto contraste com faixas pretas. Para quem quer causar impacto imediato.', 
    tag: 'Impacto'
  },
  { 
    id: 'minimal', 
    name: 'Minimalista Puro', 
    description: 'Sem distrações. Apenas o conteúdo importa. Ótimo para acadêmicos e técnicos.', 
    tag: 'Limpo'
  },
  { 
    id: 'creative', 
    name: 'Criativo Roxo', 
    description: 'Visual artístico com formas orgânicas. Perfeito para Design, Marketing e Artes.', 
    tag: 'Artístico'
  },
  { 
    id: 'tech', 
    name: 'Tech Dark', 
    description: 'Estilo moderno com tons de cinza chumbo. Ideal para Desenvolvedores e TI.', 
    tag: 'Tecnologia'
  },
  { 
    id: 'elegant', 
    name: 'Elegância Dourada', 
    description: 'Bordas duplas e detalhes em ouro. Para o mercado de luxo e alta gastronomia.', 
    tag: 'Sofisticado'
  }
];

// Componente visual que simula um currículo real em miniatura
const MiniResumePreview = ({ id }: { id: TemplateId }) => {
  // Text placeholders
  const HeaderText = () => (
    <div className="space-y-0.5">
        <div className="h-1.5 w-24 bg-current opacity-80 rounded-[1px]"></div> {/* Nome */}
        <div className="h-1 w-16 bg-current opacity-60 rounded-[1px]"></div> {/* Cargo */}
    </div>
  );
  
  const TextLines = ({ count = 3, width = "w-full" }) => (
      <div className="space-y-0.5 my-1">
          {[...Array(count)].map((_, i) => (
              <div key={i} className={`h-[2px] bg-slate-400 rounded-[1px] ${i === count - 1 ? 'w-2/3' : width}`}></div>
          ))}
      </div>
  );

  const SectionTitle = ({ color = "bg-slate-800" }) => (
      <div className={`h-1 w-12 ${color} mb-1 rounded-[1px] mt-2`}></div>
  );

  switch (id) {
    case 'modern':
      return (
        <div className="w-full h-full bg-white flex flex-col pt-3 px-3 shadow-sm relative overflow-hidden text-[4px]">
            {/* Header Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
            
            {/* Header Content */}
            <div className="flex gap-2 items-center border-b border-slate-100 pb-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0 border border-slate-300"></div>
                <div className="text-slate-800">
                    <div className="font-bold text-[5px]">JOÃO SILVA</div>
                    <div className="text-blue-600 text-[4px]">Administrador</div>
                </div>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-3 gap-2 h-full">
                <div className="col-span-2">
                    <div className="text-blue-800 font-bold uppercase text-[4px] mb-0.5">Experiência</div>
                    <TextLines count={4} />
                    <div className="text-blue-800 font-bold uppercase text-[4px] mb-0.5 mt-2">Educação</div>
                    <TextLines count={3} />
                </div>
                <div className="col-span-1 bg-blue-50/50 p-1 rounded">
                    <div className="text-slate-700 font-bold text-[4px] mb-0.5">Contato</div>
                    <div className="h-[2px] w-full bg-slate-300 mb-0.5"></div>
                    <div className="h-[2px] w-full bg-slate-300 mb-2"></div>
                    
                    <div className="text-slate-700 font-bold text-[4px] mb-0.5">Skills</div>
                    <div className="flex flex-wrap gap-0.5">
                        <div className="h-1 w-3 bg-blue-200 rounded-[1px]"></div>
                        <div className="h-1 w-4 bg-blue-200 rounded-[1px]"></div>
                        <div className="h-1 w-3 bg-blue-200 rounded-[1px]"></div>
                    </div>
                </div>
            </div>
        </div>
      );

    case 'vertical':
        return (
            <div className="w-full h-full bg-white flex shadow-sm text-[4px]">
                {/* Sidebar */}
                <div className="w-1/3 bg-red-800 h-full p-2 flex flex-col text-white/90">
                    <div className="w-6 h-6 rounded-full bg-white/20 mx-auto mb-2"></div>
                    <div className="text-center font-bold text-[5px] text-white">JOÃO</div>
                    <div className="text-center text-[3px] text-red-200 mb-2">Analista</div>
                    
                    <div className="h-[1px] w-full bg-white/30 my-1"></div>
                    <div className="text-[3px] font-bold uppercase mb-0.5">Contato</div>
                    <div className="space-y-0.5">
                         <div className="h-[2px] w-full bg-white/50"></div>
                         <div className="h-[2px] w-full bg-white/50"></div>
                    </div>
                </div>
                {/* Main */}
                <div className="w-2/3 p-2">
                     <div className="text-red-800 font-bold uppercase border-b border-red-100 mb-1">Perfil</div>
                     <TextLines count={3} />
                     <div className="text-red-800 font-bold uppercase border-b border-red-100 mb-1 mt-2">Experiência</div>
                     <TextLines count={5} />
                </div>
            </div>
        );

     case 'informal':
        return (
            <div className="w-full h-full bg-white flex shadow-sm text-[4px]">
                <div className="w-1/3 bg-emerald-50 h-full p-2 border-r border-emerald-100">
                    <div className="font-bold text-emerald-800 text-[5px] mb-2">JOÃO SILVA</div>
                    <div className="text-emerald-700 font-bold mb-0.5">Habilidades</div>
                    <div className="space-y-0.5">
                        <div className="h-1 w-full bg-emerald-200 rounded-[1px]"></div>
                        <div className="h-1 w-3/4 bg-emerald-200 rounded-[1px]"></div>
                        <div className="h-1 w-5/6 bg-emerald-200 rounded-[1px]"></div>
                    </div>
                </div>
                <div className="w-2/3 p-2">
                     <div className="text-emerald-800 font-bold bg-emerald-100 px-1 rounded-[1px] inline-block mb-1">Resumo</div>
                     <TextLines count={3} />
                     <div className="text-emerald-800 font-bold bg-emerald-100 px-1 rounded-[1px] inline-block mb-1 mt-2">Carreira</div>
                     <TextLines count={4} />
                </div>
            </div>
        );

    case 'horizontal':
        return (
             <div className="w-full h-full bg-white flex flex-col shadow-sm text-[4px]">
                 <div className="bg-slate-800 text-white p-3 flex items-center gap-2">
                     <div className="w-6 h-6 bg-slate-600 rounded-full shrink-0"></div>
                     <div>
                         <div className="font-bold text-[6px]">JOÃO SILVA</div>
                         <div className="text-slate-400 text-[4px]">Gerente Comercial</div>
                     </div>
                 </div>
                 <div className="p-2 grid grid-cols-2 gap-2 h-full">
                      <div>
                           <div className="text-slate-700 font-bold border-b border-slate-200 mb-1">EXPERIÊNCIA</div>
                           <TextLines count={5} />
                      </div>
                      <div>
                           <div className="text-slate-700 font-bold border-b border-slate-200 mb-1">EDUCAÇÃO</div>
                           <TextLines count={3} />
                           <div className="text-slate-700 font-bold border-b border-slate-200 mb-1 mt-2">SKILLS</div>
                           <div className="flex flex-wrap gap-1">
                               <div className="bg-slate-100 px-1 rounded-[1px]">Liderança</div>
                               <div className="bg-slate-100 px-1 rounded-[1px]">Vendas</div>
                           </div>
                      </div>
                 </div>
             </div>
        );

    case 'classic':
         return (
             <div className="w-full h-full bg-[#fdfbf7] p-3 flex flex-col items-center border border-stone-200 shadow-sm text-[4px] font-serif">
                  <div className="text-center mb-2">
                      <div className="font-bold text-stone-900 text-[6px] uppercase">João Silva</div>
                      <div className="h-[1px] w-24 bg-stone-300 mx-auto my-1"></div>
                      <div className="text-stone-500">joao@email.com • (11) 9999-9999</div>
                  </div>
                  
                  <div className="w-full text-left mt-1">
                       <div className="font-bold text-stone-800 uppercase border-b border-stone-300 mb-1 text-center">Resumo Profissional</div>
                       <TextLines count={2} />
                       
                       <div className="font-bold text-stone-800 uppercase border-b border-stone-300 mb-1 mt-2 text-center">Histórico</div>
                       <TextLines count={4} />
                  </div>
             </div>
         );

    case 'metro':
         return (
             <div className="w-full h-full bg-white p-3 shadow-sm text-[4px]">
                  <div className="bg-black text-white p-2 mb-2 w-[110%] -ml-3 mt-1 shadow-lg">
                       <div className="font-bold text-[6px] uppercase tracking-widest">João Silva</div>
                       <div className="text-gray-400">Designer</div>
                  </div>
                  <div className="flex gap-2">
                       <div className="w-1/3">
                            <div className="font-bold text-black border-b-2 border-black mb-1">CONTATO</div>
                            <div className="space-y-0.5 text-gray-500">
                                <div>São Paulo</div>
                                <div>joao@email</div>
                            </div>
                       </div>
                       <div className="w-2/3">
                            <div className="font-bold text-black border-b-2 border-black mb-1">SOBRE</div>
                            <TextLines count={3} />
                            <div className="font-bold text-black border-b-2 border-black mb-1 mt-2">TRABALHO</div>
                            <TextLines count={3} />
                       </div>
                  </div>
             </div>
         );

    case 'minimal':
          return (
             <div className="w-full h-full bg-white p-3 flex flex-col gap-2 border border-slate-100 shadow-sm text-[4px]">
                  <div className="flex justify-between items-end border-b border-slate-900 pb-1">
                      <div>
                          <div className="font-bold text-[6px] text-slate-900">JOÃO SILVA</div>
                          <div className="text-slate-500">Engenheiro</div>
                      </div>
                      <div className="text-right text-[3px] text-slate-400">
                          (11) 9999-9999
                      </div>
                  </div>
                  <div className="mt-1">
                       <div className="font-bold text-slate-900 mb-0.5">Experiência</div>
                       <TextLines count={4} />
                       <div className="font-bold text-slate-900 mb-0.5 mt-2">Formação</div>
                       <TextLines count={2} />
                  </div>
             </div>
          );

     case 'creative':
          return (
             <div className="w-full h-full bg-white flex flex-col relative overflow-hidden shadow-sm text-[4px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600 rounded-bl-full z-0 opacity-10"></div>
                  <div className="p-3 relative z-10">
                       <div className="text-purple-900 font-bold text-[6px]">JOÃO</div>
                       <div className="text-purple-600 mb-3">Diretor de Arte</div>
                       
                       <div className="grid grid-cols-2 gap-2">
                            <div>
                                 <div className="text-purple-800 font-bold mb-0.5">Portfolio</div>
                                 <TextLines count={4} />
                            </div>
                            <div className="bg-purple-50 p-1 rounded">
                                 <div className="text-purple-800 font-bold mb-0.5">Soft Skills</div>
                                 <div className="space-y-0.5">
                                     <div className="bg-white px-1 py-0.5 rounded text-purple-700">Criatividade</div>
                                     <div className="bg-white px-1 py-0.5 rounded text-purple-700">Inovação</div>
                                 </div>
                            </div>
                       </div>
                  </div>
             </div>
          );

    case 'tech':
         return (
             <div className="w-full h-full bg-white flex shadow-sm text-[4px]">
                <div className="w-1/3 bg-slate-800 h-full p-2 flex flex-col text-slate-300">
                    <div className="w-6 h-6 bg-slate-600 mx-auto rounded-sm mb-2 border border-green-400"></div>
                    <div className="font-mono text-center text-green-400 font-bold mb-2">DEV_JOÃO</div>
                    
                    <div className="font-bold text-white border-b border-slate-600 mb-1">STACK</div>
                    <div className="font-mono text-[3px] space-y-0.5">
                        <div>&gt; React</div>
                        <div>&gt; NodeJS</div>
                        <div>&gt; Python</div>
                    </div>
                </div>
                <div className="w-2/3 p-2 bg-slate-50">
                     <div className="text-slate-800 font-bold bg-slate-200 inline-block px-1 mb-1 font-mono"> // EXPERIÊNCIA</div>
                     <div className="font-mono text-slate-600">
                        <TextLines count={5} />
                     </div>
                </div>
            </div>
         );

    case 'elegant':
         return (
             <div className="w-full h-full bg-white p-2 border-4 border-double border-yellow-600/30 flex flex-col items-center shadow-sm text-[4px]">
                  <div className="text-center w-full mb-3 mt-2">
                      <div className="font-bold text-slate-900 text-[6px] tracking-widest uppercase">João Silva</div>
                      <div className="text-yellow-700 italic">Chef Executivo</div>
                      <div className="w-4 h-[1px] bg-yellow-600 mx-auto mt-1"></div>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-3">
                       <div className="text-center">
                            <div className="text-yellow-800 font-bold uppercase mb-1">Perfil</div>
                            <TextLines count={3} />
                       </div>
                       <div className="text-center">
                            <div className="text-yellow-800 font-bold uppercase mb-1">Experiência</div>
                            <TextLines count={3} />
                       </div>
                  </div>
             </div>
         );
    default: return <div className="bg-slate-100 w-full h-full"></div>
  }
}

const TemplateGallery: React.FC<Props> = ({ onSelect, onCancel }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-4xl font-bold text-slate-800">Escolha o Visual Ideal</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Selecione o modelo que melhor representa sua área profissional. <br/>
          <span className="text-sm text-slate-500">Todos os modelos são otimizados para leitura automática por robôs (ATS).</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1 group flex flex-col">
            
            {/* Tag */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.tag}</span>
                {t.id === 'modern' && <Check className="w-4 h-4 text-blue-500" />}
            </div>

            {/* Preview Section - Realistic A4 Ratio */}
            <div className="w-full bg-slate-100 p-6 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-50/30 transition-colors">
               <div className="w-[160px] h-[226px] shadow-lg transform transition-transform duration-300 group-hover:scale-105 bg-white">
                  <MiniResumePreview id={t.id} />
               </div>
            </div>

            {/* Info Section */}
            <div className="p-5 flex-1 flex flex-col bg-white">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{t.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t.description}</p>
              </div>
              
              <div className="mt-auto space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onSelect(t.id, AppMode.CREATE)}
                        className="py-2 px-3 rounded-lg bg-slate-800 text-white hover:bg-black font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-300"
                    >
                        <Briefcase className="w-3.5 h-3.5" /> Profissional
                    </button>
                    <button
                        onClick={() => onSelect(t.id, AppMode.CREATE_APPRENTICE)}
                        className="py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                        <BookOpen className="w-3.5 h-3.5" /> Aprendiz
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 pb-8">
        <button 
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-800 font-medium px-6 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default TemplateGallery;
