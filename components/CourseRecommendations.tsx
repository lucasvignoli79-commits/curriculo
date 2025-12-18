
import React, { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, BookOpen, ExternalLink, Bookmark, CheckCircle2, Search, Zap, PlusCircle, Check, X, ChevronDown, Award, RefreshCw, Loader2, Clock, Calendar } from 'lucide-react';
import { getCourseRecommendations } from '../services/geminiService';
import { resumeService } from '../services/resumeService';
import { SavedResume } from '../types';

interface Props {
  userId: string;
  onBack: () => void;
  onAddedSuccess: () => void;
}

interface Course {
  name: string;
  provider: string;
  difficulty: string;
  impact: string;
  howToList: string;
  link: string;
  status?: 'none' | 'saved' | 'completed';
}

const CourseRecommendations: React.FC<Props> = ({ userId, onBack, onAddedSuccess }) => {
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [selectingResumeFor, setSelectingResumeFor] = useState<string | null>(null);
  
  // States para os novos campos de detalhes do curso
  const [courseHours, setCourseHours] = useState('');
  const [courseDate, setCourseDate] = useState('');

  useEffect(() => {
    const list = resumeService.getResumesByUser(userId);
    setSavedResumes(list);
  }, [userId]);

  const quickAreas = [
    "Administração", "Vendas", "Marketing Digital", 
    "Programação / TI", "Recursos Humanos", "Logística", 
    "Atendimento ao Cliente", "Finanças", "Design Gráfico"
  ];

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return;
    setLoading(true);
    setArea(searchTerm);
    try {
      const data = await getCourseRecommendations(searchTerm);
      if (data && data.courses && data.courses.length > 0) {
        setCourses(data.courses.map((c: any) => ({ ...c, status: 'none' })));
        setShowResults(true);
      } else {
        alert("Nenhum curso encontrado para esta área no momento. Tente termos mais gerais.");
      }
    } catch (e) {
      alert("Erro ao buscar cursos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToResume = (resumeId: string, courseText: string) => {
    const success = resumeService.appendCourseToResume(resumeId, courseText, courseHours, courseDate);
    if (success) {
      setSelectingResumeFor(null);
      setCourseHours('');
      setCourseDate('');
      onAddedSuccess();
    } else {
      alert("Erro ao adicionar curso ao currículo.");
    }
  };

  const toggleStatus = (index: number, type: 'saved' | 'completed') => {
    const newCourses = [...courses];
    const current = newCourses[index].status;
    if (current === type) {
        newCourses[index].status = 'none';
    } else {
        newCourses[index].status = type;
    }
    setCourses(newCourses);
  };

  const completedCount = courses.filter(c => c.status === 'completed').length;
  const progress = courses.length > 0 ? (completedCount / courses.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-screen pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><GraduationCap className="w-8 h-8" /> Cursos Gratuitos Verificados</h2>
        <p className="opacity-90 max-w-2xl">Aumente sua empregabilidade com cursos oficiais de plataformas estáveis (Bradesco, SEBRAE, FGV, etc).</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8">
        {!showResults ? (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-800">Turbine sua carreira agora</h3>
                    <p className="text-slate-500">Digite seu cargo ou área de interesse e nossa IA encontrará os melhores cursos gratuitos ativos das plataformas mais respeitadas do Brasil.</p>
                </div>

                <div className="relative">
                    <input 
                        type="text" 
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Ex: Auxiliar Administrativo, Atendimento, Excel..."
                        className="w-full p-4 pl-5 pr-14 border border-slate-300 rounded-full text-lg shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(area)}
                    />
                    <button 
                        onClick={() => handleSearch(area)}
                        disabled={loading}
                        className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors disabled:bg-slate-300"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                    </button>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Sugestões Populares</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {quickAreas.map(a => (
                            <button 
                                key={a}
                                onClick={() => handleSearch(a)}
                                className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-transparent rounded-full text-slate-600 text-sm font-medium transition-all"
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="pt-8 animate-in fade-in">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-500 mt-4 font-medium">Buscando links verificados em plataformas oficiais...</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Recomendações para: <span className="text-emerald-600">{area}</span></h3>
                        <p className="text-sm text-slate-500">Links de catálogos oficiais para evitar páginas quebradas.</p>
                    </div>
                    <button onClick={() => { setShowResults(false); setArea(''); }} className="text-emerald-600 font-medium hover:underline text-sm flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Buscar outra área
                    </button>
                </div>

                {/* Progress Tracking */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-4 shadow-sm">
                    <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold text-emerald-600 mb-2">
                            <span>METAS DE APRENDIZADO</span>
                            <span>{completedCount} de {courses.length} cursos feitos</span>
                        </div>
                        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-emerald-200">
                            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-emerald-200 shadow-inner">
                        <span className="font-bold text-emerald-600 text-xs">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group relative overflow-hidden">
                            <div className={`h-1.5 w-full ${course.status === 'completed' ? 'bg-emerald-500' : (course.status === 'saved' ? 'bg-amber-400' : 'bg-slate-100')}`}></div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide
                                        ${course.difficulty === 'Iniciante' ? 'bg-green-100 text-green-700' : 
                                         (course.difficulty === 'Intermediário' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')}
                                    `}>
                                        {course.difficulty}
                                    </span>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => toggleStatus(index, 'saved')}
                                            title="Salvar para depois"
                                            className={`p-1.5 rounded-full transition-colors ${course.status === 'saved' ? 'bg-amber-100 text-amber-600' : 'hover:bg-slate-100 text-slate-400'}`}
                                        >
                                            <Bookmark className="w-4 h-4 fill-current" />
                                        </button>
                                        <button 
                                            onClick={() => toggleStatus(index, 'completed')}
                                            title="Marcar como concluído"
                                            className={`p-1.5 rounded-full transition-colors ${course.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100 text-slate-400'}`}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h4 className="font-bold text-lg text-slate-800 mb-1 leading-snug">{course.name}</h4>
                                <p className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-1">
                                    <BookOpen className="w-3.5 h-3.5" /> {course.provider}
                                </p>

                                <div className="bg-slate-50 p-3 rounded-lg mb-4 flex-1">
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        <Award className="w-3 h-3 inline mr-1 text-emerald-500" />
                                        <strong>Impacto:</strong> {course.impact}
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                                    {selectingResumeFor === course.howToList ? (
                                        <div className="bg-slate-100 p-3 rounded-xl space-y-3 animate-in fade-in zoom-in-95 border border-slate-200">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Detalhes da Conclusão:</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="relative">
                                                        <Clock className="absolute left-2 top-2 w-3 h-3 text-slate-400" />
                                                        <input 
                                                            type="number"
                                                            placeholder="Horas"
                                                            value={courseHours}
                                                            onChange={(e) => setCourseHours(e.target.value)}
                                                            className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-2 top-2 w-3 h-3 text-slate-400" />
                                                        <input 
                                                            type="date"
                                                            value={courseDate}
                                                            onChange={(e) => setCourseDate(e.target.value)}
                                                            className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Escolha o currículo:</p>
                                                {savedResumes.length > 0 ? (
                                                    <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg bg-white">
                                                        {savedResumes.map(r => (
                                                            <button 
                                                                key={r.id}
                                                                onClick={() => handleAddToResume(r.id, course.howToList)}
                                                                className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-700 border-b last:border-0 border-slate-200 flex justify-between items-center transition-colors"
                                                            >
                                                                <span className="truncate">{r.title}</span>
                                                                <PlusCircle className="w-3 h-3" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center p-2">
                                                        <p className="text-[10px] text-red-500 mb-2">Você não tem currículos salvos.</p>
                                                        <button onClick={onBack} className="text-[10px] text-blue-600 font-bold hover:underline">Ir criar um agora</button>
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => {
                                                  setSelectingResumeFor(null);
                                                  setCourseHours('');
                                                  setCourseDate('');
                                                }}
                                                className="w-full py-1.5 text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setSelectingResumeFor(course.howToList)}
                                            className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                            <PlusCircle className="w-4 h-4" /> Adicionar ao Currículo
                                        </button>
                                    )}

                                    <a 
                                        href={course.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-md"
                                    >
                                        Acessar Plataforma <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        )}
      </div>
    </div>
  );
};

export default CourseRecommendations;
