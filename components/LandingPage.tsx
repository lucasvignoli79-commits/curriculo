
import React from 'react';
import { Check, ArrowRight, Star, ShieldCheck, Zap, Briefcase, Camera, MessageSquare, Linkedin, Globe, BookOpen, Crown, X } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pt-16 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-100 text-sm font-medium mb-8 backdrop-blur-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>A Tecnologia de IA mais avançada do mercado (Gemini 2.5)</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Seu Currículo Profissional <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Criado por IA em Segundos.</span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100 mb-10">
            Passe pelos filtros de robôs (ATS), impressione recrutadores e conquiste a vaga dos seus sonhos. Tudo em uma única plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onGetStarted}
              className="px-8 py-5 bg-white text-blue-900 hover:bg-blue-50 text-lg font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Criar Meu Currículo Agora <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          
          <p className="mt-6 text-sm text-blue-200/60">
            <ShieldCheck className="w-4 h-4 inline mr-1" /> Dados seguros e criptografados.
          </p>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tudo o que você precisa para ser contratado</h2>
            <p className="text-lg text-slate-600">Nossa IA cuida de cada etapa do processo seletivo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Briefcase className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Criação de Currículo</h3>
              <p className="text-slate-500">Geração instantânea de texto persuasivo focado em resultados. Modelos modernos e aceitos pelo mercado.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <Camera className="w-7 h-7 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Foto Profissional IA</h3>
              <p className="text-slate-500">Não gaste com fotógrafo. Nossa IA transforma sua selfie caseira em uma foto de perfil corporativa de estúdio.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <Zap className="w-7 h-7 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Otimização ATS</h3>
              <p className="text-slate-500">Já tem um CV? Nossa IA analisa e reescreve seu currículo para passar pelos robôs de triagem automática.</p>
            </div>

             {/* Feature 4 */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <MessageSquare className="w-7 h-7 text-orange-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Simulador de Entrevista</h3>
              <p className="text-slate-500">Treine com perguntas reais e receba feedback imediato sobre suas respostas antes da entrevista real.</p>
            </div>

             {/* Feature 5 */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-600 transition-colors">
                <Globe className="w-7 h-7 text-sky-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Busca de Vagas</h3>
              <p className="text-slate-500">Encontre oportunidades abertas em tempo real na sua região e candidate-se com um clique.</p>
            </div>

             {/* Feature 6 */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <Linkedin className="w-7 h-7 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Gerador LinkedIn</h3>
              <p className="text-slate-500">Transforme seu currículo em um perfil campeão no LinkedIn com Bio, Título e Resumo otimizados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- APPRENTICE / FIRST JOB SECTION --- */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50 rounded-l-[100px] z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-6">
                    <BookOpen className="w-4 h-4" /> Especial para Iniciantes
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                    Primeiro Emprego ou <br/>
                    <span className="text-orange-600">Jovem Aprendiz?</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Sabemos que é difícil fazer um currículo sem experiência. Nossa IA foi treinada para identificar seu potencial, focando em:
                </p>
                <ul className="space-y-4 mb-8">
                    {[
                        "Habilidades comportamentais (Soft Skills)",
                        "Projetos escolares e voluntariado",
                        "Vontade de aprender e potencial",
                        "Formatação que valoriza a educação"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-medium text-slate-700">
                            <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs">
                                <Check className="w-3 h-3" />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all"
                >
                    Criar Currículo de Aprendiz
                </button>
            </div>
            <div className="lg:w-1/2 relative">
                 <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                     <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                         <div>
                             <div className="h-3 w-32 bg-slate-200 rounded mb-2"></div>
                             <div className="h-2 w-20 bg-slate-100 rounded"></div>
                         </div>
                     </div>
                     <div className="space-y-3">
                         <div className="h-2 w-full bg-slate-100 rounded"></div>
                         <div className="h-2 w-full bg-slate-100 rounded"></div>
                         <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                     </div>
                 </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
