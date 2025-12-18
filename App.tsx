
import React, { useState, useEffect } from 'react';
import { AppMode, GeneratedResume, ResumeFormData, FileUpload, TemplateId, PhotoStyle, User } from './types.ts';
import { generateResumeFromScratch, optimizeResume, generateProfessionalHeadshot } from './services/geminiService.ts';
import { authService } from './services/authService.ts';
import { resumeService } from './services/resumeService.ts';

import ResumeForm from './components/ResumeForm.tsx';
import ResumeRefine from './components/ResumeRefine.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import TemplateGallery from './components/TemplateGallery.tsx';
import PhotoStudio from './components/PhotoStudio.tsx';
import BeforeAfterGallery from './components/BeforeAfterGallery.tsx';
import JobAnalyzer from './components/JobAnalyzer.tsx';
import ATSChecker from './components/ATSChecker.tsx';
import LinkedInGenerator from './components/LinkedInGenerator.tsx';
import InterviewSimulator from './components/InterviewSimulator.tsx';
import CompetitorComparison from './components/CompetitorComparison.tsx';
import CourseRecommendations from './components/CourseRecommendations.tsx';
import JobSearch from './components/JobSearch.tsx';
import ResumeHistory from './components/ResumeHistory.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';

import { FileText, Sparkles, Briefcase, BookOpen, Layout, Camera, Search, ShieldCheck, Linkedin, MessageSquare, Crown, Layers, Zap, X, GraduationCap, LogOut, Lock, Globe, History, Check } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [result, setResult] = useState<GeneratedResume | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Currículo salvo em "Meus Currículos"');

  // Initialize Auth
  useEffect(() => {
    authService.init();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    setMode(AppMode.HOME);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMode(AppMode.HOME);
    setResult(null);
  };

  const triggerSaveToast = (msg?: string) => {
      setToastMessage(msg || 'Currículo salvo em "Meus Currículos"');
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 4000);
  };

  // --- Handlers ---

  const handleCreateSubmit = async (data: ResumeFormData) => {
    setLoading(true);
    setError(null);
    setUserPhoto(data.photo || ''); 
    const isApprentice = mode === AppMode.CREATE_APPRENTICE;
    
    try {
      const generated = await generateResumeFromScratch(data, isApprentice);
      // Save automatically using both ID and Email for persistence insurance
      if (user) {
          resumeService.saveResume(user.id, generated, user.email);
          triggerSaveToast();
      }
      setResult(generated);
      setMode(AppMode.RESULT);
    } catch (err) {
      setError("Erro ao gerar currículo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefineSubmit = async (text: string, file?: FileUpload, photo?: string) => {
    setLoading(true);
    setError(null);
    setUserPhoto(photo || '');
    try {
      const generated = await optimizeResume(text, file?.data, file?.type);
      // Save automatically using both ID and Email for persistence insurance
      if (user) {
          resumeService.saveResume(user.id, generated, user.email);
          triggerSaveToast();
      }
      setResult(generated);
      setMode(AppMode.RESULT);
    } catch (err) {
      setError("Erro ao otimizar currículo. Verifique se a imagem é legível e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoGeneration = async (imageBase64: string, style: PhotoStyle): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const resultBase64 = await generateProfessionalHeadshot(imageBase64, style);
      return resultBase64;
    } catch (err) {
      setError("Erro ao processar foto. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistoryResume = (resume: GeneratedResume) => {
      setResult(resume);
      setMode(AppMode.RESULT);
  };

  // --- Auth Guard ---
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // --- Admin View ---
  if (mode === AppMode.ADMIN && user.role === 'admin') {
      return <AdminDashboard currentUser={user} onBack={() => setMode(AppMode.HOME)} onLogout={handleLogout} />;
  }

  const renderHome = () => (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      {/* User Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                 {user.name.charAt(0).toUpperCase()}
             </div>
             <div>
                 <p className="text-xs text-slate-400 font-bold uppercase">Bem-vindo(a)</p>
                 <p className="font-semibold text-slate-800">{user.name}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
              {/* My Resumes Tab Button */}
              <button 
                onClick={() => setMode(AppMode.HISTORY)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                  <History className="w-4 h-4" /> Meus Currículos
              </button>

              {user.role === 'admin' && (
                  <button onClick={() => setMode(AppMode.ADMIN)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-black transition-colors">
                      <Lock className="w-4 h-4" /> Painel Admin
                  </button>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors">
                  <LogOut className="w-4 h-4" /> Sair
              </button>
          </div>
      </div>

      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
          Curriculum <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Master IA</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light">
          Crie, otimize ou transforme seu currículo em um documento de alto impacto em segundos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 0: Modelos */}
        <button 
          onClick={() => setMode(AppMode.TEMPLATES)}
          className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all border border-slate-100 text-left hover:-translate-y-2 duration-300 flex flex-col h-full"
        >
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
            <Layout className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ver Modelos</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
            Explore designs modernos, executivos e criativos.
          </p>
        </button>

        {/* Card 1: Foto Profissional */}
        <button 
          onClick={() => setMode(AppMode.PHOTO_STUDIO)}
          className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all border border-slate-100 text-left hover:-translate-y-2 duration-300 flex flex-col h-full"
        >
          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 transition-colors duration-300">
            <Camera className="w-7 h-7 text-violet-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Foto Profissional</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
            Transforme selfie em foto de estúdio com IA.
          </p>
        </button>

        {/* Card 2: Profissional */}
        <button 
          onClick={() => {
              setSelectedTemplate('modern'); 
              setMode(AppMode.CREATE);
          }}
          className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all border border-slate-100 text-left hover:-translate-y-2 duration-300 flex flex-col h-full"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
            <Briefcase className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Currículo Profissional</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
            Criação rápida focada em resultados.
          </p>
        </button>

         {/* Card 3: Jovem Aprendiz */}
         <button 
          onClick={() => {
            setSelectedTemplate('modern'); 
            setMode(AppMode.CREATE_APPRENTICE);
          }}
          className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all border border-slate-100 text-left hover:-translate-y-2 duration-300 flex flex-col h-full"
        >
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
            <BookOpen className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Currículo Jovem Aprendiz</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
            Foco em potencial e educação para o 1º emprego.
          </p>
        </button>

        {/* Card 4: Refinar (Expanded) */}
        <button 
          onClick={() => {
            setSelectedTemplate('modern'); 
            setMode(AppMode.REFINE);
          }}
          className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all border border-slate-100 text-left hover:-translate-y-2 duration-300 flex flex-col h-full md:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors duration-300">
              <Sparkles className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Otimizar CV Existente</h2>
              <p className="text-slate-500 text-sm">
                Envie seu arquivo atual. Nossa IA corrige erros e aplica design profissional.
              </p>
            </div>
          </div>
        </button>

         {/* Card: Comparativo (Expanded) */}
        <button 
          onClick={() => setMode(AppMode.COMPARISON)}
          className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all border border-slate-100 text-left hover:-translate-y-2 duration-300 flex flex-col h-full md:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-yellow-500 transition-colors duration-300">
              <Crown className="w-7 h-7 text-yellow-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Por que somos melhores?</h2>
              <p className="text-slate-500 text-sm">
                Compare nossos recursos com Canva e editores tradicionais.
              </p>
            </div>
          </div>
        </button>

        {/* === NEW FEATURES === */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6 mb-2">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-8 h-px bg-slate-300"></span> Ferramentas Extras <span className="w-full h-px bg-slate-300"></span>
            </h3>
        </div>

        {/* Busca de Vagas - NEW */}
        <button onClick={() => setMode(AppMode.JOB_SEARCH)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Globe className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">Buscar Vagas</h3>
            </div>
            <p className="text-xs text-slate-500">Encontre oportunidades na sua região.</p>
        </button>

        {/* Analisar Vaga */}
        <button onClick={() => setMode(AppMode.JOB_ANALYSIS)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Search className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">Analisar Vaga</h3>
            </div>
            <p className="text-xs text-slate-500">Compare seu CV com uma vaga e veja o Match.</p>
        </button>

         {/* ATS Checker */}
         <button onClick={() => setMode(AppMode.ATS_CHECKER)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><ShieldCheck className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">ATS Checker</h3>
            </div>
            <p className="text-xs text-slate-500">Seu CV passa pelos robôs de RH?</p>
        </button>

        {/* LinkedIn Pro */}
        <button onClick={() => setMode(AppMode.LINKEDIN_GEN)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Linkedin className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">LinkedIn Pro</h3>
            </div>
            <p className="text-xs text-slate-500">Gere Bio e Título otimizados.</p>
        </button>

         {/* Simulador */}
         <button onClick={() => setMode(AppMode.INTERVIEW_SIM)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MessageSquare className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">Simulador Entrevista</h3>
            </div>
            <p className="text-xs text-slate-500">Treine respostas com IA.</p>
        </button>

        {/* Cursos Recomendados */}
         <button onClick={() => setMode(AppMode.COURSES)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><GraduationCap className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">Cursos Grátis</h3>
            </div>
            <p className="text-xs text-slate-500">Recomendações para turbinar o CV.</p>
        </button>
        
        {/* Antes e Depois */}
         <button onClick={() => setMode(AppMode.BEFORE_AFTER)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left md:col-span-2 lg:col-span-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg"><Layers className="w-5 h-5"/></div>
                <div>
                    <h3 className="font-bold text-slate-800">Galeria Antes e Depois</h3>
                    <p className="text-xs text-slate-500">Veja exemplos reais de transformação.</p>
                </div>
            </div>
            <div className="text-cyan-600"><Zap className="w-4 h-4" /></div>
        </button>

      </div>
      
      <div className="mt-20 text-center text-slate-400 text-sm">
        Desenvolvido com Google Gemini 2.5 Flash
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {mode === AppMode.HOME && renderHome()}

        {mode === AppMode.CREATE && (
            <ResumeForm 
                mode={AppMode.CREATE} 
                onSubmit={handleCreateSubmit} 
                onCancel={() => setMode(AppMode.HOME)} 
                isLoading={loading}
            />
        )}

        {mode === AppMode.CREATE_APPRENTICE && (
            <ResumeForm 
                mode={AppMode.CREATE_APPRENTICE} 
                onSubmit={handleCreateSubmit} 
                onCancel={() => setMode(AppMode.HOME)} 
                isLoading={loading}
            />
        )}

        {mode === AppMode.REFINE && (
            <ResumeRefine 
                onSubmit={handleRefineSubmit} 
                onCancel={() => setMode(AppMode.HOME)} 
                isLoading={loading}
            />
        )}

        {mode === AppMode.RESULT && result && (
            <ResultDisplay 
                data={result} 
                userPhoto={userPhoto} 
                templateId={selectedTemplate}
                onBack={() => setMode(AppMode.HOME)}
                onChangeTemplate={setSelectedTemplate}
            />
        )}

        {mode === AppMode.TEMPLATES && (
            <TemplateGallery 
                onSelect={(id, m) => { setSelectedTemplate(id); setMode(m); }} 
                onCancel={() => setMode(AppMode.HOME)}
            />
        )}

        {mode === AppMode.PHOTO_STUDIO && (
            <PhotoStudio 
                onGenerate={handlePhotoGeneration} 
                onCancel={() => setMode(AppMode.HOME)} 
                isLoading={loading} 
            />
        )}

        {mode === AppMode.BEFORE_AFTER && (
            <BeforeAfterGallery onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.JOB_ANALYSIS && (
            <JobAnalyzer onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.ATS_CHECKER && (
            <ATSChecker onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.LINKEDIN_GEN && (
            <LinkedInGenerator onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.INTERVIEW_SIM && (
            <InterviewSimulator onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.COMPARISON && (
            <CompetitorComparison onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.COURSES && user && (
            <CourseRecommendations 
                userId={user.id}
                onBack={() => setMode(AppMode.HOME)} 
                onAddedSuccess={() => triggerSaveToast("Curso adicionado ao currículo com sucesso!")}
            />
        )}

        {mode === AppMode.JOB_SEARCH && (
            <JobSearch onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.HISTORY && user && (
            <ResumeHistory 
                userId={user.id} 
                onSelectResume={handleSelectHistoryResume} 
                onBack={() => setMode(AppMode.HOME)} 
            />
        )}

        {showSavedToast && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5">
                <div className="bg-green-500 rounded-full p-1"><Check className="w-3 h-3 text-white" /></div>
                <span className="font-medium text-sm">{toastMessage}</span>
            </div>
        )}

        {error && (
            <div className="fixed bottom-6 right-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="absolute top-2 right-2 text-red-500 hover:text-red-800"><X className="w-4 h-4" /></button>
            </div>
        )}
    </div>
  );
};

export default App;
