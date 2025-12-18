
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
import PaymentModal from './components/PaymentModal.tsx';

import { FileText, Sparkles, Briefcase, BookOpen, Layout, Camera, Search, ShieldCheck, Linkedin, MessageSquare, Crown, Layers, Zap, X, GraduationCap, LogOut, Lock, Globe, History, Check, AlertTriangle, Key } from 'lucide-react';

// Use the pre-defined AIStudio type to avoid conflicting declarations
declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [result, setResult] = useState<GeneratedResume | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [showPayment, setShowPayment] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean>(true);

  useEffect(() => {
    authService.init();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      checkApiKeyStatus();
    }
  }, []);

  const checkApiKeyStatus = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsApiKeySelected(hasKey);
    }
  };

  const handleOpenApiKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setIsApiKeySelected(true); // Assume success after interaction
    }
  };

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    setMode(AppMode.HOME);
    checkApiKeyStatus();
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

  const ensureApiKey = async (): Promise<boolean> => {
    if (!isApiKeySelected && window.aistudio) {
      await handleOpenApiKeyDialog();
      return true;
    }
    return true;
  };

  // --- Handlers ---

  const handleCreateSubmit = async (data: ResumeFormData) => {
    await ensureApiKey();
    setLoading(true);
    setError(null);
    setUserPhoto(data.photo || ''); 
    const isApprentice = mode === AppMode.CREATE_APPRENTICE;
    
    try {
      const generated = await generateResumeFromScratch(data, isApprentice);
      if (user) {
          resumeService.saveResume(user.id, generated, user.email);
          triggerSaveToast();
      }
      setResult(generated);
      setMode(AppMode.RESULT);
    } catch (err: any) {
      if (err.message?.includes("entity was not found")) {
        setIsApiKeySelected(false);
        setError("Chave de API expirada ou inválida. Configure novamente.");
      } else {
        setError("Erro ao gerar currículo. Verifique sua conexão ou chave de API.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefineSubmit = async (text: string, file?: FileUpload, photo?: string) => {
    await ensureApiKey();
    setLoading(true);
    setError(null);
    setUserPhoto(photo || '');
    try {
      const generated = await optimizeResume(text, file?.data, file?.type);
      if (user) {
          resumeService.saveResume(user.id, generated, user.email);
          triggerSaveToast();
      }
      setResult(generated);
      setMode(AppMode.RESULT);
    } catch (err) {
      setError("Erro ao otimizar currículo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoGeneration = async (imageBase64: string, style: PhotoStyle): Promise<string> => {
    await ensureApiKey();
    setLoading(true);
    setError(null);
    try {
      const resultBase64 = await generateProfessionalHeadshot(imageBase64, style);
      return resultBase64;
    } catch (err: any) {
      setError("Erro ao processar foto. Certifique-se de usar uma chave de API válida.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const renderHome = () => (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      {/* API Key Warning */}
      {!isApiKeySelected && (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-600 w-6 h-6" />
            <div>
              <p className="font-bold text-amber-800">Chave de API Necessária</p>
              <p className="text-sm text-amber-700">Para usar as funções de IA na Netlify, você precisa configurar sua chave.</p>
            </div>
          </div>
          <button 
            onClick={handleOpenApiKeyDialog}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Key className="w-4 h-4" /> Configurar Agora
          </button>
        </div>
      )}

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
              <button 
                onClick={() => setMode(AppMode.HISTORY)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                  <History className="w-4 h-4" /> Meus Currículos
              </button>
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
          Crie, otimize ou transforme seu currículo com o poder da IA Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => setMode(AppMode.TEMPLATES)} className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-left hover:-translate-y-2 transition-all flex flex-col h-full">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
            <Layout className="w-7 h-7 text-purple-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ver Modelos</h2>
          <p className="text-slate-500 text-sm flex-1">Explore designs modernos e executivos.</p>
        </button>

        <button onClick={() => setMode(AppMode.PHOTO_STUDIO)} className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-left hover:-translate-y-2 transition-all flex flex-col h-full">
          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 transition-colors">
            <Camera className="w-7 h-7 text-violet-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Foto Profissional</h2>
          <p className="text-slate-500 text-sm flex-1">IA Gemini 3 Pro para retratos de estúdio.</p>
        </button>

        <button onClick={() => { setSelectedTemplate('modern'); setMode(AppMode.CREATE); }} className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-left hover:-translate-y-2 transition-all flex flex-col h-full">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <Briefcase className="w-7 h-7 text-blue-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Criar Profissional</h2>
          <p className="text-slate-500 text-sm flex-1">Geração rápida focada em resultados.</p>
        </button>

        <button onClick={() => { setSelectedTemplate('modern'); setMode(AppMode.REFINE); }} className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-left hover:-translate-y-2 transition-all flex flex-col h-full">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
            <Sparkles className="w-7 h-7 text-emerald-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Otimizar Atual</h2>
          <p className="text-slate-500 text-sm flex-1">Correção e design para currículos prontos.</p>
        </button>

        <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                Ferramentas de IA Pro
            </h3>
        </div>

        <button onClick={() => setMode(AppMode.JOB_SEARCH)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Globe className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">Buscar Vagas</h3>
            </div>
            <p className="text-xs text-slate-500">Conectado ao Google Search.</p>
        </button>

        <button onClick={() => setMode(AppMode.JOB_ANALYSIS)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Search className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">Analisar Vaga</h3>
            </div>
            <p className="text-xs text-slate-500">Match inteligente com a IA.</p>
        </button>

        <button onClick={() => setMode(AppMode.ATS_CHECKER)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><ShieldCheck className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">ATS Checker</h3>
            </div>
            <p className="text-xs text-slate-500">Filtro de robôs de RH.</p>
        </button>

        <button onClick={() => setMode(AppMode.LINKEDIN_GEN)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Linkedin className="w-5 h-5"/></div>
                <h3 className="font-bold text-slate-800">LinkedIn Pro</h3>
            </div>
            <p className="text-xs text-slate-500">Perfil campeão gerado.</p>
        </button>
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

        {mode === AppMode.PHOTO_STUDIO && (
            <PhotoStudio 
                onGenerate={handlePhotoGeneration} 
                onCancel={() => setMode(AppMode.HOME)} 
                isLoading={loading} 
            />
        )}

        {mode === AppMode.JOB_SEARCH && (
            <JobSearch onBack={() => setMode(AppMode.HOME)} />
        )}

        {mode === AppMode.HISTORY && user && (
            <ResumeHistory 
                userId={user.id} 
                onSelectResume={(r) => { setResult(r); setMode(AppMode.RESULT); }} 
                onBack={() => setMode(AppMode.HOME)} 
            />
        )}

        {showSavedToast && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50">
                <Check className="w-4 h-4 text-green-400" />
                <span className="font-medium text-sm">{toastMessage}</span>
            </div>
        )}

        {error && (
            <div className="fixed bottom-6 right-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50">
                <div className="flex items-center justify-between">
                    <p className="font-bold">Aviso</p>
                    <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
                </div>
                <p className="text-sm">{error}</p>
            </div>
        )}
    </div>
  );
};

export default App;
