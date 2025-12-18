
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { License, User } from '../types';
import { ArrowLeft, Key, Users, Copy, Check, Plus, RefreshCw, LogOut } from 'lucide-react';

interface Props {
  currentUser: User;
  onBack: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ currentUser, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'licenses' | 'users'>('licenses');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const l = await authService.getLicenses();
    const u = await authService.getUsers();
    setLicenses(l);
    setUsers(u);
    setLoading(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    await authService.generateLicense(currentUser.email);
    await loadData();
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Header - BLUE BRAND COLOR */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Key className="w-5 h-5 text-white"/></div>
                    Painel Administrativo
                </h1>
                <p className="text-blue-100 text-sm mt-1">Gerenciamento de Licenças e Usuários</p>
            </div>
            <div className="flex gap-3">
                <button onClick={onBack} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm border border-white/10">
                    Voltar ao App
                </button>
                <button onClick={onLogout} className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white border border-red-400/30 text-sm font-medium transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sair
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-4">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase">Licenças Ativas</p>
                        <h3 className="text-3xl font-bold text-emerald-600">{licenses.filter(l => l.status === 'active').length}</h3>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Check className="w-6 h-6"/></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase">Licenças Usadas</p>
                        <h3 className="text-3xl font-bold text-slate-700">{licenses.filter(l => l.status === 'used').length}</h3>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Key className="w-6 h-6"/></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase">Total Usuários</p>
                        <h3 className="text-3xl font-bold text-blue-600">{users.length}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-6 h-6"/></div>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
            <button 
                onClick={() => setActiveTab('licenses')}
                className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'licenses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Gerenciar Licenças
            </button>
            <button 
                onClick={() => setActiveTab('users')}
                className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Usuários Registrados
            </button>
        </div>

        {/* Licenses Tab */}
        {activeTab === 'licenses' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Lista de Códigos</h3>
                    <div className="flex gap-2">
                        <button onClick={loadData} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors" title="Atualizar">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button 
                            onClick={handleGenerate}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30"
                        >
                            <Plus className="w-4 h-4" /> Gerar Nova Licença
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Código</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Criado em</th>
                                <th className="p-4">Usado por</th>
                                <th className="p-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {licenses.map((lic) => (
                                <tr key={lic.code} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-mono font-bold text-slate-700">{lic.code}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${lic.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}
                                        `}>
                                            {lic.status === 'active' ? 'Disponível' : 'Usado'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">{new Date(lic.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm text-slate-600">{lic.usedBy || '-'}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => copyToClipboard(lic.code)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Copiar Código"
                                        >
                                            {copied === lic.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {licenses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">Nenhuma licença gerada ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Nome</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Função</th>
                                <th className="p-4">Licença Utilizada</th>
                                <th className="p-4">Data Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-medium text-slate-800">{u.name}</td>
                                    <td className="p-4 text-sm text-slate-600">{u.email}</td>
                                    <td className="p-4">
                                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'}
                                        `}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-slate-500">{u.licenseCode || '-'}</td>
                                    <td className="p-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
