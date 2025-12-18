
import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { SavedResume, GeneratedResume, User } from '../types';
import { FileText, Trash2, Calendar, ChevronRight, ArrowLeft, Clock, Edit2, Check, X, Copy } from 'lucide-react';
import { authService } from '../services/authService';

interface Props {
  userId: string;
  onSelectResume: (resume: GeneratedResume) => void;
  onBack: () => void;
}

const ResumeHistory: React.FC<Props> = ({ userId, onSelectResume, onBack }) => {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
        loadResumes(currentUser.id, currentUser.email);
    }
  }, [userId]);

  const loadResumes = (id: string, email: string) => {
    const list = resumeService.getResumesByUser(id, email);
    setResumes(list);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este currículo permanentemente?')) {
      resumeService.deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    resumeService.duplicateResume(id);
    if (user) loadResumes(user.id, user.email);
  };

  const startEditing = (e: React.MouseEvent, resume: SavedResume) => {
    e.stopPropagation();
    setEditingId(resume.id);
    setEditTitle(resume.title);
  };

  const saveTitle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      resumeService.updateResumeTitle(id, editTitle.trim());
      setEditingId(null);
      if (user) loadResumes(user.id, user.email);
    }
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-screen pb-10">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-400" /> Meus Currículos
        </h2>
        <p className="opacity-90">Histórico de todos os currículos vinculados à sua conta.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8">
        {resumes.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-600">Nenhum currículo encontrado</h3>
                <p className="text-slate-500 mt-2">Os currículos gerados ou salvos aparecerão aqui.</p>
                <button onClick={onBack} className="mt-6 text-blue-600 font-bold hover:underline">
                    Criar Novo Currículo
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                    <div 
                        key={resume.id}
                        onClick={() => editingId !== resume.id && onSelectResume(resume.data)}
                        className={`group bg-white rounded-xl border transition-all relative overflow-hidden flex flex-col h-full
                            ${editingId === resume.id ? 'border-blue-400 ring-2 ring-blue-100 shadow-lg' : 'border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 cursor-pointer'}
                        `}
                    >
                        <div className="h-2 w-full bg-blue-500"></div>
                        <div className="p-6 flex-1">
                            <div className="mb-2 min-h-[32px] flex items-center">
                                {editingId === resume.id ? (
                                    <div className="flex items-center gap-1 w-full animate-in fade-in">
                                        <input 
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full text-sm font-bold border border-blue-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') saveTitle(e as any, resume.id);
                                                if(e.key === 'Escape') cancelEditing(e as any);
                                            }}
                                        />
                                        <button onClick={(e) => saveTitle(e, resume.id)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check className="w-4 h-4"/></button>
                                        <button onClick={cancelEditing} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><X className="w-4 h-4"/></button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start w-full group/title">
                                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={resume.title}>
                                            {resume.title || "Sem Título"}
                                        </h3>
                                        <button 
                                            onClick={(e) => startEditing(e, resume)}
                                            className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-opacity"
                                            title="Renomear"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
                                {resume.data.structured.summary || "Sem resumo definido."}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(resume.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(resume.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                Abrir Visualização <ChevronRight className="w-3 h-3" />
                            </span>
                            <div className="flex gap-1">
                                <button 
                                    onClick={(e) => handleDuplicate(e, resume.id)}
                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                                    title="Duplicar"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(e, resume.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHistory;
