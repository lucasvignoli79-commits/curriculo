
import React, { useState, useEffect } from 'react';
import { GeneratedResume, TemplateId, StructuredResume } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { FileText, Star, Lightbulb, ArrowLeft, Printer, Download, Palette, DownloadCloud, MapPin, Mail, Phone, Linkedin, Globe, Check } from 'lucide-react';

declare var html2pdf: any;

interface Props {
  data: GeneratedResume;
  userPhoto?: string;
  templateId: TemplateId;
  onBack: () => void;
  onChangeTemplate: (id: TemplateId) => void;
}

const colorSchemes: Record<string, any> = {
  blue: { primary: 'text-blue-800', border: 'border-blue-200', bg: 'bg-blue-50', sidebarBg: 'bg-blue-900', sidebarText: 'text-white', badge: 'bg-blue-100 text-blue-800', accent: 'bg-blue-600', name: 'Azul' },
  red: { primary: 'text-red-800', border: 'border-red-200', bg: 'bg-red-50', sidebarBg: 'bg-red-900', sidebarText: 'text-white', badge: 'bg-red-100 text-red-800', accent: 'bg-red-600', name: 'Vermelho' },
  emerald: { primary: 'text-emerald-800', border: 'border-emerald-200', bg: 'bg-emerald-50', sidebarBg: 'bg-emerald-900', sidebarText: 'text-white', badge: 'bg-emerald-100 text-emerald-800', accent: 'bg-emerald-600', name: 'Verde' },
  purple: { primary: 'text-purple-800', border: 'border-purple-200', bg: 'bg-purple-50', sidebarBg: 'bg-purple-900', sidebarText: 'text-white', badge: 'bg-purple-100 text-purple-800', accent: 'bg-purple-600', name: 'Roxo' },
  slate: { primary: 'text-slate-800', border: 'border-slate-200', bg: 'bg-slate-50', sidebarBg: 'bg-slate-900', sidebarText: 'text-slate-200', badge: 'bg-slate-200 text-slate-800', accent: 'bg-slate-800', name: 'Cinza' },
  indigo: { primary: 'text-indigo-800', border: 'border-indigo-200', bg: 'bg-indigo-50', sidebarBg: 'bg-indigo-900', sidebarText: 'text-white', badge: 'bg-indigo-100 text-indigo-800', accent: 'bg-indigo-600', name: 'Indigo' },
  amber: { primary: 'text-amber-800', border: 'border-amber-200', bg: 'bg-amber-50', sidebarBg: 'bg-amber-900', sidebarText: 'text-white', badge: 'bg-amber-100 text-amber-800', accent: 'bg-amber-600', name: 'Dourado' },
  pink: { primary: 'text-pink-800', border: 'border-pink-200', bg: 'bg-pink-50', sidebarBg: 'bg-pink-900', sidebarText: 'text-white', badge: 'bg-pink-100 text-pink-800', accent: 'bg-pink-600', name: 'Rosa' },
  cyan: { primary: 'text-cyan-800', border: 'border-cyan-200', bg: 'bg-cyan-50', sidebarBg: 'bg-cyan-900', sidebarText: 'text-white', badge: 'bg-cyan-100 text-cyan-800', accent: 'bg-cyan-600', name: 'Ciano' },
  black: { primary: 'text-black', border: 'border-slate-300', bg: 'bg-slate-50', sidebarBg: 'bg-black', sidebarText: 'text-white', badge: 'bg-slate-200 text-black', accent: 'bg-black', name: 'Preto' },
};

const ResultDisplay: React.FC<Props> = ({ data, userPhoto, templateId, onBack, onChangeTemplate }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'suggestions'>('resume');
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');
  const info = data.structured;

  // Set default color based on template when template changes
  useEffect(() => {
    switch (templateId) {
        case 'modern': setSelectedColor('blue'); break;
        case 'vertical': setSelectedColor('red'); break;
        case 'informal': setSelectedColor('emerald'); break;
        case 'classic': setSelectedColor('slate'); break;
        case 'creative': setSelectedColor('purple'); break;
        case 'metro': setSelectedColor('black'); break;
        case 'elegant': setSelectedColor('amber'); break;
        case 'tech': setSelectedColor('slate'); break;
        case 'horizontal': setSelectedColor('indigo'); break;
        default: setSelectedColor('blue');
    }
  }, [templateId]);

  const theme = colorSchemes[selectedColor];

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('resume-content');
    if (!element) { setIsDownloading(false); return; }

    const opt = {
      margin: 0, // Zero margin here, control via CSS padding to fit more content
      filename: `CV-${info.fullName.replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false)).catch((e:any) => {
        console.error(e); setIsDownloading(false);
    });
  };

  const handleDownloadWord = () => {
    // Generate a simple HTML for Word export
    // Note: Inline styles are used because CSS classes might not be fully supported by Word's HTML engine
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${info.fullName}</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="font-size: 24px; margin-bottom: 5px;">${info.fullName}</h1>
        <p style="font-size: 16px; color: #555;">${info.role}</p>
        <p style="font-size: 12px; margin-bottom: 20px;">
          ${info.contact.email} | ${info.contact.phone} | ${info.contact.location}
        </p>

        <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px;">Resumo</h2>
        <p>${info.summary}</p>

        <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px;">Experiência</h2>
        <div>${data.markdown.replace(/\n/g, '<br/>')}</div>
        
        <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px;">Habilidades</h2>
        <p>${info.skills.join(', ')}</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV-${info.fullName.replace(/\s+/g, '-')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- SUB-COMPONENTS FOR LAYOUTS ---

  const ContactItem = ({ icon: Icon, text, className }: any) => {
      if (!text) return null;
      return <div className={`flex items-center gap-2 ${className}`}><Icon className="w-4 h-4 shrink-0" /> <span>{text}</span></div>
  };

  const SectionTitle = ({ title, className }: any) => (
      <h3 className={`text-base font-bold uppercase tracking-wider mb-3 border-b-2 pb-1 ${className}`}>{title}</h3>
  );

  // --- LAYOUT RENDERERS ---

  // 1. VERTICAL (Sidebar)
  const SidebarLayout = () => (
      <div className="flex w-full h-full min-h-[296mm] bg-white">
          {/* Sidebar */}
          <div className={`w-[32%] ${theme.sidebarBg} ${theme.sidebarText} p-6 flex flex-col gap-6 shrink-0`}>
              <div className="text-center">
                  {userPhoto && (
                      <div className="w-32 h-32 mx-auto rounded-full border-4 border-white/20 mb-4 overflow-hidden relative">
                           <img src={userPhoto} className="w-full h-full object-cover" />
                      </div>
                  )}
                  <h1 className="text-2xl font-bold leading-tight mb-2">{info.fullName}</h1>
                  <p className="text-base opacity-90 font-medium">{info.role}</p>
              </div>

              <div className="space-y-3 text-sm opacity-90">
                  <ContactItem icon={Mail} text={info.contact.email} />
                  <ContactItem icon={Phone} text={info.contact.phone} />
                  <ContactItem icon={MapPin} text={info.contact.location} />
                  <ContactItem icon={Linkedin} text={info.contact.linkedin} />
                  <ContactItem icon={Globe} text={info.contact.website} />
              </div>

              <div>
                  <h3 className="font-bold border-b border-white/30 pb-1 mb-3 uppercase text-sm tracking-wider">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                      {info.skills?.map((s,i) => (
                          <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">{s}</span>
                      ))}
                  </div>
              </div>

              {info.languages?.length > 0 && (
                  <div>
                      <h3 className="font-bold border-b border-white/30 pb-1 mb-3 uppercase text-sm tracking-wider">Idiomas</h3>
                      <ul className="text-sm space-y-1">
                          {info.languages.map((l,i) => <li key={i}>• {l}</li>)}
                      </ul>
                  </div>
              )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 text-slate-800">
              <div className="mb-6">
                  <SectionTitle title="Perfil Profissional" className={`${theme.border} ${theme.primary}`} />
                  <p className="text-[15px] leading-normal text-slate-700">{info.summary}</p>
              </div>

              <div className="mb-6">
                  <SectionTitle title="Experiência" className={`${theme.border} ${theme.primary}`} />
                  {/* prose-base provides better readability than prose-sm */}
                  <div className="text-[15px] leading-snug prose prose-slate max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                      <MarkdownRenderer content={info.experience} />
                  </div>
              </div>

              <div>
                  <SectionTitle title="Formação" className={`${theme.border} ${theme.primary}`} />
                  <div className="text-[15px] leading-snug prose prose-slate max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                      <MarkdownRenderer content={info.education} />
                  </div>
              </div>
          </div>
      </div>
  );

  // 2. MODERN & CLASSIC & HORIZONTAL & MINIMAL & METRO
  const StandardLayout = ({ styleType }: { styleType: 'modern' | 'classic' | 'horizontal' | 'minimal' | 'metro' }) => {
      const isClassic = styleType === 'classic';
      const isMetro = styleType === 'metro';
      const isMinimal = styleType === 'minimal';
      const isHorizontal = styleType === 'horizontal';
      
      const fontClass = isClassic ? 'font-serif' : 'font-sans';
      
      // Dynamic header styling based on selected color
      let headerBg = '';
      let headerText = '';
      let titleColorClass = theme.primary;
      let borderColorClass = theme.border;

      if (isMetro) {
          headerBg = `${theme.sidebarBg} p-8`;
          headerText = 'text-white';
          titleColorClass = `${theme.primary} border-black`; // Metro keeps black borders usually, or use theme
          borderColorClass = 'border-black';
      } else if (isHorizontal) {
          headerBg = `${theme.sidebarBg} p-8`;
          headerText = 'text-white';
          titleColorClass = theme.primary;
      } else {
          // Classic, Modern, Minimal
          headerBg = 'border-b-2 pb-6 mb-6 ' + theme.border;
          headerText = 'text-slate-900';
      }
      
      return (
          // Reduced padding from p-[2cm] to p-10 (approx 2.5rem) to fit more on one page
          <div className={`w-full h-full min-h-[296mm] bg-white p-10 ${fontClass} text-slate-900`}>
               {/* Header */}
               <div className={`${headerBg} ${isMetro || isHorizontal ? '-mx-10 -mt-10 mb-8' : ''}`}>
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                            <h1 className={`text-3xl font-bold uppercase tracking-tight mb-2 ${headerText} ${!isMetro && !isHorizontal ? theme.primary : ''}`}>{info.fullName}</h1>
                            <p className={`text-xl mb-4 ${isMetro || isHorizontal ? 'text-white/90' : 'text-slate-600'}`}>{info.role}</p>
                            
                            <div className={`flex flex-wrap gap-x-5 gap-y-2 text-sm ${isMetro || isHorizontal ? 'text-white/80' : 'text-slate-600'}`}>
                                <ContactItem icon={Mail} text={info.contact.email} />
                                <ContactItem icon={Phone} text={info.contact.phone} />
                                <ContactItem icon={MapPin} text={info.contact.location} />
                                {info.contact.linkedin && <ContactItem icon={Linkedin} text={info.contact.linkedin} />}
                            </div>
                        </div>
                        {userPhoto && (
                            <div className={`w-32 h-32 shrink-0 overflow-hidden bg-white ${isMinimal ? 'grayscale' : ''} ${isClassic ? 'rounded-md' : 'rounded-full border-4 border-white shadow-sm'}`}>
                                <img src={userPhoto} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
               </div>

               {/* Grid for content if Horizontal/Modern, else stacked */}
               <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                   {/* Main Column */}
                   <div>
                       <div className="mb-6">
                           <h3 className={`font-bold uppercase text-base border-b-2 mb-3 pb-1 ${titleColorClass} ${isMetro ? borderColorClass : theme.border}`}>Resumo</h3>
                           <p className="text-[15px] leading-normal text-slate-700">{info.summary}</p>
                       </div>

                       <div className="mb-6">
                            <h3 className={`font-bold uppercase text-base border-b-2 mb-3 pb-1 ${titleColorClass} ${isMetro ? borderColorClass : theme.border}`}>Experiência Profissional</h3>
                            <div className="text-[15px] leading-snug prose prose-slate max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                                <MarkdownRenderer content={info.experience} />
                            </div>
                       </div>

                       <div>
                            <h3 className={`font-bold uppercase text-base border-b-2 mb-3 pb-1 ${titleColorClass} ${isMetro ? borderColorClass : theme.border}`}>Formação Acadêmica</h3>
                            <div className="text-[15px] leading-snug prose prose-slate max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                                <MarkdownRenderer content={info.education} />
                            </div>
                       </div>
                   </div>

                   {/* Side Column (Skills, etc) */}
                   <div className="space-y-6">
                        <div>
                            <h3 className={`font-bold uppercase text-base border-b-2 mb-3 pb-1 ${titleColorClass} ${isMetro ? borderColorClass : theme.border}`}>Competências</h3>
                            <div className="flex flex-wrap gap-2">
                                {info.skills?.map((s,i) => (
                                    <span key={i} className={`text-xs px-2.5 py-1.5 rounded border font-medium ${isClassic ? 'border-stone-300 bg-stone-50' : `${theme.border} ${theme.bg}`}`}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {info.projects && (
                            <div>
                                <h3 className={`font-bold uppercase text-base border-b-2 mb-3 pb-1 ${titleColorClass} ${isMetro ? borderColorClass : theme.border}`}>Projetos</h3>
                                <div className="text-sm prose prose-slate leading-snug">
                                    <MarkdownRenderer content={info.projects} />
                                </div>
                            </div>
                        )}

                         {info.certifications && (
                            <div>
                                <h3 className={`font-bold uppercase text-base border-b-2 mb-3 pb-1 ${titleColorClass} ${isMetro ? borderColorClass : theme.border}`}>Certificados</h3>
                                <div className="text-sm prose prose-slate leading-snug">
                                    <MarkdownRenderer content={info.certifications} />
                                </div>
                            </div>
                        )}
                   </div>
               </div>
          </div>
      );
  };

  // 3. CREATIVE
  const CreativeLayout = () => (
      <div className="w-full h-full min-h-[296mm] bg-white font-sans text-slate-800">
           {/* Uses theme color for header */}
           <div className={`${theme.sidebarBg} text-white p-10 pb-24 relative overflow-hidden`}>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{info.fullName}</h1>
                        <p className="text-xl opacity-90">{info.role}</p>
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10">
                    <Star className="w-64 h-64 -mb-10 -mr-10" />
                </div>
           </div>
           
           <div className="px-10 -mt-16 relative z-20 grid grid-cols-[1fr_2fr] gap-8">
                {/* Left Col */}
                <div className="space-y-6">
                    {userPhoto && (
                        <div className="w-40 h-40 bg-white p-1 rounded-full shadow-lg mx-auto md:mx-0">
                            <img src={userPhoto} className="w-full h-full object-cover rounded-full" />
                        </div>
                    )}
                    <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-100 text-sm space-y-3">
                         <ContactItem icon={Mail} text={info.contact.email} />
                         <ContactItem icon={Phone} text={info.contact.phone} />
                         <ContactItem icon={MapPin} text={info.contact.location} />
                         <ContactItem icon={Globe} text={info.contact.website} />
                    </div>
                    <div>
                        <h3 className={`font-bold mb-2 ${theme.primary}`}>Skills</h3>
                        <div className="flex flex-wrap gap-2">
                             {info.skills?.map((s,i) => (
                                <span key={i} className={`px-2 py-1 rounded text-xs font-medium ${theme.badge}`}>{s}</span>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Right Col */}
                <div className="pt-4 space-y-6">
                     <div>
                        <h3 className={`text-xl font-bold text-slate-800 border-b-2 pb-2 mb-3 ${theme.border}`}>Sobre</h3>
                        <p className="text-[15px] leading-normal text-slate-600">{info.summary}</p>
                     </div>
                     <div>
                        <h3 className={`text-xl font-bold text-slate-800 border-b-2 pb-2 mb-3 ${theme.border}`}>Experiência</h3>
                        <div className="text-[15px] leading-snug prose prose-slate max-w-none">
                            <MarkdownRenderer content={info.experience} />
                        </div>
                     </div>
                     <div>
                        <h3 className={`text-xl font-bold text-slate-800 border-b-2 pb-2 mb-3 ${theme.border}`}>Educação</h3>
                        <div className="text-[15px] leading-snug prose prose-slate max-w-none">
                            <MarkdownRenderer content={info.education} />
                        </div>
                     </div>
                </div>
           </div>
      </div>
  );


  // --- RENDERER SWITCHER ---
  const renderLayout = () => {
    switch (templateId) {
        case 'vertical': 
        case 'informal':
        case 'tech':
            return <SidebarLayout />; // Sidebar layout now uses dynamic theme
        
        case 'creative':
            return <CreativeLayout />;
        
        case 'modern':
            return <StandardLayout styleType="modern" />;
        case 'classic':
            return <StandardLayout styleType="classic" />;
        case 'minimal':
            return <StandardLayout styleType="minimal" />;
        case 'horizontal':
            return <StandardLayout styleType="horizontal" />;
        case 'metro':
            return <StandardLayout styleType="metro" />;
        case 'elegant': // Elegant maps to Standard with specific colors via useEffect
            return <StandardLayout styleType="modern" />;
        
        default:
            return <StandardLayout styleType="modern" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 no-print bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Auto-Save Indicator */}
            <div className="hidden md:flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <Check className="w-3 h-3" /> Salvo em Histórico
            </div>

            <div className="w-px h-8 bg-slate-200 mx-2 hidden lg:block"></div>

            {/* Template Selector */}
             <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <Palette className="w-4 h-4 text-slate-500 ml-2 mr-2" />
                <select 
                    value={templateId} 
                    onChange={(e) => onChangeTemplate(e.target.value as TemplateId)}
                    className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer py-1 pr-8 outline-none"
                >
                    <option value="modern">Moderno</option>
                    <option value="vertical">Coluna Lateral</option>
                    <option value="informal">Informal</option>
                    <option value="horizontal">Horizontal Pro</option>
                    <option value="classic">Clássico</option>
                    <option value="metro">Urbano</option>
                    <option value="creative">Criativo</option>
                    <option value="minimal">Minimalista</option>
                    <option value="tech">Tech</option>
                    <option value="elegant">Elegante</option>
                </select>
            </div>

            {/* Color Picker - NEW */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">Cor:</span>
                <div className="flex gap-1.5 flex-wrap justify-center">
                    {Object.keys(colorSchemes).map(key => (
                        <button 
                            key={key}
                            onClick={() => setSelectedColor(key)}
                            className={`w-6 h-6 rounded-full ${colorSchemes[key].accent} border-2 transition-all ${selectedColor === key ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                            title={colorSchemes[key].name}
                        />
                    ))}
                </div>
            </div>

            <div className="w-px h-8 bg-slate-200 mx-2 hidden lg:block"></div>

            <button onClick={() => window.print()} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium transition-colors">
                <Printer className="w-5 h-5" />
            </button>
            <button onClick={handleDownloadWord} className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <FileText className="w-5 h-5" /> Baixar Word
            </button>
            <button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                {isDownloading ? 'Gerando...' : <><DownloadCloud className="w-5 h-5" /> Baixar PDF</>}
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex flex-col gap-2 no-print shrink-0">
             <button
                onClick={() => setActiveTab('resume')}
                className={`text-left px-5 py-4 rounded-xl font-medium transition-all flex items-center gap-3
                    ${activeTab === 'resume' ? 'bg-white shadow-md text-blue-700 border border-blue-100' : 'text-slate-500 hover:bg-white/50'}
                `}
            >
                <FileText className="w-5 h-5" /> Visualizar Currículo
            </button>
            <button
                onClick={() => setActiveTab('suggestions')}
                className={`text-left px-5 py-4 rounded-xl font-medium transition-all flex items-center gap-3
                    ${activeTab === 'suggestions' ? 'bg-white shadow-md text-amber-700 border border-amber-100' : 'text-slate-500 hover:bg-white/50'}
                `}
            >
                <Lightbulb className="w-5 h-5" /> Sugestões da IA
            </button>
        </div>

        {/* Paper Display */}
        <div className="flex-1 w-full flex justify-center">
             {activeTab === 'suggestions' ? (
                 <div className="w-full bg-white p-8 rounded-xl shadow-lg border-t-4 border-amber-400">
                     <h2 className="text-xl font-bold text-amber-700 mb-6 flex items-center gap-2"><Lightbulb /> Dicas de Melhoria</h2>
                     <div className="prose prose-slate max-w-none">
                         <MarkdownRenderer content={data.suggestions} />
                     </div>
                 </div>
             ) : (
                <div id="resume-content" className="print-container shadow-2xl transition-all duration-500">
                    {renderLayout()}
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
