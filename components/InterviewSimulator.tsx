import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Briefcase, User, ChevronDown, ChevronUp } from 'lucide-react';
import { simulateInterview } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

const InterviewSimulator: React.FC<Props> = ({ onBack }) => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('Júnior');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const handleSimulate = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const data = await simulateInterview(role, level);
      setResult(data);
    } catch (e) {
      alert("Erro ao gerar simulação.");
    } finally {
      setLoading(false);
    }
  };

  const QuestionCard = ({ q, i, type }: any) => (
      <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
          <button 
            onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
            className="w-full text-left p-4 bg-white hover:bg-slate-50 flex justify-between items-center transition-colors"
          >
              <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${type === 'hard' ? 'bg-red-500' : (type === 'tech' ? 'bg-blue-500' : 'bg-green-500')}`}></span>
                {q.question}
              </span>
              {openQuestion === i ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
          </button>
          {openQuestion === i && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm">
                  <p className="font-bold text-slate-500 text-xs uppercase mb-1">Resposta Ideal Sugerida:</p>
                  <p className="text-slate-600 leading-relaxed">{q.idealAnswer}</p>
              </div>
          )}
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden pb-8">
      <div className="bg-orange-500 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><MessageSquare /> Simulador de Entrevista</h2>
        <p className="opacity-90">Prepare-se para perguntas reais da sua área.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8">
        {!result ? (
            <div className="space-y-6 max-w-lg mx-auto">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cargo Alvo</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        <input 
                            className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Ex: Desenvolvedor Front-end, Vendedor..."
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nível de Experiência</label>
                    <div className="relative">
                         <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        <select 
                            className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            <option>Estágio / Jovem Aprendiz</option>
                            <option>Júnior</option>
                            <option>Pleno</option>
                            <option>Sênior</option>
                            <option>Gerência</option>
                        </select>
                    </div>
                </div>
                <button 
                    onClick={handleSimulate}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                >
                    {loading ? 'Preparando Perguntas...' : 'Gerar Simulação'}
                </button>
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in">
                
                {/* Feedback Box */}
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 text-orange-800 text-sm leading-relaxed">
                    <strong>Dica do Especialista:</strong> {result.feedback}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Perguntas Comuns</h3>
                        {result.commonQuestions?.map((q: any, i: number) => <QuestionCard key={i} q={q} i={i} type="common" />)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Perguntas Técnicas</h3>
                        {result.techQuestions?.map((q: any, i: number) => <QuestionCard key={i+10} q={q} i={i+10} type="tech" />)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Perguntas Desafiadoras</h3>
                        {result.hardQuestions?.map((q: any, i: number) => <QuestionCard key={i+20} q={q} i={i+20} type="hard" />)}
                    </div>
                </div>

                <button 
                    onClick={() => setResult(null)}
                    className="block mx-auto text-slate-500 hover:text-orange-600 font-medium"
                >
                    Nova Simulação
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;