
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Lock, Mail, User as UserIcon, Key, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff, HelpCircle, ArrowLeft } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

const ADMIN_EMAILS = ['admin@cvmaster.com', 'lucasvignoli79@gmail.com', 'caiovenceoi@gmail.com'];

const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    license: ''
  });

  // Check if current typed email is an admin
  const isAdminEmail = ADMIN_EMAILS.includes(formData.email.toLowerCase().trim());

  // Load remembered email on mount
  useEffect(() => {
    const lastEmail = localStorage.getItem('cv_master_last_email');
    if (lastEmail) {
        setFormData(prev => ({ ...prev, email: lastEmail }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const user = await authService.login(formData.email, formData.password);
        localStorage.setItem('cv_master_last_email', formData.email);
        onLoginSuccess(user);
      } 
      else if (authMode === 'register') {
        const user = await authService.register(
          formData.name,
          formData.email,
          formData.password,
          formData.license.trim()
        );
        localStorage.setItem('cv_master_last_email', formData.email);
        onLoginSuccess(user);
      }
      else if (authMode === 'forgot') {
        await authService.resetPassword(formData.email, formData.license.trim(), formData.password);
        setSuccessMsg("Senha redefinida com sucesso! Faça login agora.");
        setFormData(prev => ({ ...prev, password: '' })); // Clear password field
        setTimeout(() => setAuthMode('login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

  const renderTitle = () => {
      switch(authMode) {
          case 'login': return 'Bem-vindo de volta';
          case 'register': return 'Ativar Licença';
          case 'forgot': return 'Redefinir Senha';
      }
  };

  const renderSubtitle = () => {
      switch(authMode) {
          case 'login': return 'Entre com suas credenciais para continuar.';
          case 'register': return 'Insira seu código de licença para criar sua conta.';
          case 'forgot': return 'Confirme seu email e código de licença para criar uma nova senha.';
      }
  };

  const renderButtonText = () => {
      if (loading) return <Loader2 className="w-5 h-5 animate-spin" />;
      switch(authMode) {
          case 'login': return <>Entrar na Plataforma <ArrowRight className="w-5 h-5" /></>;
          case 'register': return <>Validar e Criar Conta <ArrowRight className="w-5 h-5" /></>;
          case 'forgot': return <>Salvar Nova Senha <ArrowRight className="w-5 h-5" /></>;
      }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Brand */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-4">Curriculum Master IA</h1>
            <p className="text-blue-100 text-lg">
              A plataforma definitiva para acelerar sua carreira. 
              Gere currículos otimizados, treine para entrevistas e passe pelos filtros de RH.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold">Acesso Exclusivo</h3>
                    <p className="text-sm text-blue-200">Plataforma restrita para membros licenciados.</p>
                </div>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-slate-50">
           <div className="max-w-sm mx-auto w-full">
                
                {authMode === 'forgot' && (
                    <button onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }} className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                )}

                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {renderTitle()}
                </h2>
                <p className="text-slate-500 mb-8">
                    {renderSubtitle()}
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {error}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-center gap-2 animate-in fade-in">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'register' && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                            <div className="relative">
                                <UserIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                                <input 
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                            <input 
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    {(authMode === 'register' || authMode === 'forgot') && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase text-blue-600">Código de Licença</label>
                            <div className="relative">
                                <Key className="w-5 h-5 absolute left-3 top-3.5 text-blue-500" />
                                <input 
                                    name="license"
                                    type="text"
                                    // Required is false only if it's one of the admin emails
                                    required={!isAdminEmail}
                                    value={formData.license}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 outline-none transition-all
                                        ${isAdminEmail 
                                            ? 'border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-500' 
                                            : 'border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}
                                    `}
                                    placeholder={isAdminEmail ? "Acesso Admin Reconhecido (Opcional)" : "CV-XXXXXXXX"}
                                />
                            </div>
                            {authMode === 'forgot' && <p className="text-[10px] text-slate-400">Necessário para confirmar sua identidade.</p>}
                            {isAdminEmail && <p className="text-[10px] text-green-600 font-bold">Email de administrador reconhecido.</p>}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                            {authMode === 'forgot' ? 'Nova Senha' : 'Senha'}
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                            <input 
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder={authMode === 'forgot' ? "Digite a nova senha" : "••••••••"}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {authMode === 'login' && (
                        <div className="flex justify-end">
                            <button 
                                type="button"
                                onClick={() => { setAuthMode('forgot'); setError(''); setSuccessMsg(''); }}
                                className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                            >
                                Esqueci minha senha
                            </button>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                    >
                        {renderButtonText()}
                    </button>
                </form>

                {authMode !== 'forgot' && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            {authMode === 'login' ? "Ainda não tem acesso?" : "Já possui uma conta?"}
                            <button 
                                onClick={() => { 
                                    setAuthMode(authMode === 'login' ? 'register' : 'login'); 
                                    setError(''); 
                                    setSuccessMsg('');
                                }}
                                className="ml-2 font-bold text-blue-600 hover:underline"
                            >
                                {authMode === 'login' ? "Ativar Licença" : "Fazer Login"}
                            </button>
                        </p>
                    </div>
                )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
