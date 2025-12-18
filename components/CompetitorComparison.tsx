
import React from 'react';
import { ArrowLeft, Check, X, Crown } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const CompetitorComparison: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden pb-8">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><Crown className="w-8 h-8 text-yellow-400" /> Comparativo</h2>
        <p className="opacity-90">Por que o CV Master IA é a melhor escolha para sua carreira.</p>
        <button onClick={onBack} className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-8 overflow-x-auto">
        <table className="w-full min-w-[600px]">
            <thead>
                <tr>
                    <th className="text-left p-4 pb-6 text-slate-500 font-medium w-1/4">Recurso</th>
                    <th className="text-center p-4 pb-6 w-1/4">
                        <div className="font-bold text-slate-700 text-lg">Editores Comuns</div>
                        <div className="text-xs text-slate-400">Word, Canva</div>
                    </th>
                    <th className="text-center p-4 pb-6 w-1/4">
                        <div className="font-bold text-slate-700 text-lg">Sites de CV Pagos</div>
                        <div className="text-xs text-slate-400">Assinaturas Mensais</div>
                    </th>
                    <th className="text-center p-4 pb-6 w-1/4 bg-blue-50 rounded-t-xl border-t border-x border-blue-100 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Recomendado
                        </div>
                        <div className="font-bold text-blue-700 text-xl">CV Master IA</div>
                    </th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {[
                    { name: 'Otimização com Master AI Exclusiva', common: false, paid: true, us: true },
                    { name: 'Compatibilidade ATS (Robôs)', common: false, paid: 'Parcial', us: true },
                    { name: 'Correção de Texto Automática', common: false, paid: true, us: true },
                    { name: 'Foto Profissional (IA Studio)', common: false, paid: false, us: true },
                    { name: 'Custo', common: 'Grátis (Difícil)', paid: 'R$ 49/mês', us: '100% Gratuito' },
                    { name: 'Design Focado em Recrutadores', common: false, paid: true, us: true },
                    { name: 'Gerador de LinkedIn', common: false, paid: false, us: true },
                    { name: 'Simulador de Entrevista', common: false, paid: false, us: true },
                    { name: 'Busca de Vagas em Tempo Real', common: false, paid: false, us: true },
                ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-semibold text-slate-700">{row.name}</td>
                        <td className="p-4 text-center text-slate-500">
                            {row.common === true ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : (row.common === false ? <X className="w-5 h-5 text-red-300 mx-auto" /> : row.common)}
                        </td>
                        <td className="p-4 text-center text-slate-500">
                            {row.paid === true ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : (row.paid === false ? <X className="w-5 h-5 text-red-300 mx-auto" /> : row.paid)}
                        </td>
                        <td className="p-4 text-center font-bold text-blue-800 bg-blue-50/50 border-x border-blue-100">
                             {row.us === true ? <Check className="w-6 h-6 text-blue-600 mx-auto" /> : row.us}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorComparison;
