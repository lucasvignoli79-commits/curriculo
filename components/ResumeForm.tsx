import React, { useState, useRef } from 'react';
import { ResumeFormData, AppMode } from '../types';
import { User, BookOpen, Briefcase, Award, Target, ChevronRight, Upload, Camera, X, Mail, Phone } from 'lucide-react';

interface Props {
  mode: AppMode;
  onSubmit: (data: ResumeFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ResumeForm: React.FC<Props> = ({ mode, onSubmit, onCancel, isLoading }) => {
  const isApprentice = mode === AppMode.CREATE_APPRENTICE;
  
  const [formData, setFormData] = useState<ResumeFormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    objective: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    socials: '',
    photo: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className={`p-8 text-white relative overflow-hidden
        ${isApprentice ? 'bg-gradient-to-r from-orange-500 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}
      `}>
        <div className="relative z-10">
            <h2 className="text-3xl font-bold flex items-center gap-3">
            {isApprentice ? <BookOpen className="w-8 h-8" /> : <User className="w-8 h-8" />}
            {isApprentice ? 'Currículo Jovem Aprendiz' : 'Currículo Profissional'}
            </h2>
            <p className="opacity-90 mt-2 text-white/90 font-medium">
                {isApprentice 
                    ? 'Focado em quem busca a primeira oportunidade. Vamos destacar seu potencial!' 
                    : 'Preencha seus dados e deixe a IA criar um currículo de alto nível.'}
            </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Foto e Dados Principais */}
        <section className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-auto flex flex-col items-center gap-3">
                <div 
                    className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden relative group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {formData.photo ? (
                        <>
                            <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-2">
                            <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                            <span className="text-xs text-slate-500 font-medium">Adicionar Foto</span>
                        </div>
                    )}
                </div>
                {formData.photo && (
                    <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({...prev, photo: ''}))}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Remover foto
                    </button>
                )}
                <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoUpload}
                />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo *</label>
                    <input 
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="Ex: Ana Clara Souza"
                    />
                </div>
                
                {/* Email - Required */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                    <div className="relative">
                        <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>

                {/* Phone - Required */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone/Celular *</label>
                     <div className="relative">
                        <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cidade/Estado</label>
                    <input 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="Ex: Curitiba, PR"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Idade</label>
                    <input 
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="Ex: 17 anos"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Outros Links (LinkedIn, Portfólio)</label>
                    <input 
                        name="socials"
                        value={formData.socials}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="LinkedIn, Site Pessoal..."
                    />
                </div>
            </div>
        </section>

        {/* Objetivo */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Target className={`w-5 h-5 ${isApprentice ? 'text-orange-500' : 'text-blue-600'}`} />
            Objetivo Profissional
          </h3>
          <textarea 
            required
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            rows={2}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
            placeholder={isApprentice 
                ? "Ex: Busco minha primeira oportunidade como Jovem Aprendiz para aprender, contribuir e crescer profissionalmente." 
                : "Ex: Atuar como Analista Financeiro Sênior focando em otimização de processos..."}
          />
        </section>

        {/* Experiência ou Projetos */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Briefcase className={`w-5 h-5 ${isApprentice ? 'text-orange-500' : 'text-blue-600'}`} />
            {isApprentice ? 'Voluntariado ou Projetos Escolares (Se houver)' : 'Experiências Profissionais'}
          </h3>
          <p className="text-sm text-slate-500 mb-3">
            {isApprentice 
                ? 'Se nunca trabalhou, cite grêmio estudantil, trabalhos voluntários, ajuda em negócios familiares ou projetos da escola.' 
                : 'Liste suas últimas empresas, cargos e principais resultados alcançados.'}
          </p>
          <textarea 
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows={5}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
            placeholder={isApprentice 
                ? "Ex: Voluntário na ONG X ajudando na organização de eventos..." 
                : "Ex: Empresa X (2020-2023) - Gerente de Vendas..."}
          />
        </section>

        {/* Educação e Habilidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BookOpen className={`w-5 h-5 ${isApprentice ? 'text-orange-500' : 'text-blue-600'}`} />
                    Educação e Cursos
                </h3>
                <textarea 
                    required
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="Ensino médio (completo ou cursando), cursos online, inglês, informática..."
                />
            </section>
             <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Award className={`w-5 h-5 ${isApprentice ? 'text-orange-500' : 'text-blue-600'}`} />
                    {isApprentice ? 'Habilidades e Qualidades' : 'Habilidades e Projetos'}
                </h3>
                <textarea 
                    required
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    placeholder={isApprentice 
                        ? "Ex: Facilidade com computador, Pacote Office, pontualidade, vontade de aprender, boa comunicação..." 
                        : "Ex: Python, Gestão de Pessoas, Scrum, SEO..."}
                />
            </section>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`px-8 py-3 rounded-xl text-white font-bold text-lg flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5
                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : (isApprentice ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30')}
            `}
          >
            {isLoading ? 'Gerando Currículo...' : (
                <>
                Criar Currículo <ChevronRight className="w-5 h-5" />
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeForm;