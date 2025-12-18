
import React, { useState } from 'react';
import { X, Zap, Check, CreditCard, ShieldCheck, Sparkles, Star } from 'lucide-react';

interface Props {
  onClose: () => void;
  onPurchase: (amount: number) => void;
  currentBalance: number;
}

const packages = [
  {
    id: 'basic',
    name: 'Essencial',
    credits: 5,
    price: 'R$ 9,90',
    description: 'Ideal para um único currículo e uma foto profissional.',
    color: 'blue',
    popular: false
  },
  {
    id: 'pro',
    name: 'Profissional',
    credits: 20,
    price: 'R$ 29,90',
    description: 'Perfeito para quem está buscando vagas ativamente e quer testar vários estilos.',
    color: 'indigo',
    popular: true
  },
  {
    id: 'elite',
    name: 'Ilimitado (Dia)',
    credits: 50,
    price: 'R$ 49,90',
    description: 'Acesso total para transformar completamente seu perfil profissional.',
    color: 'emerald',
    popular: false
  }
];

const PaymentModal: React.FC<Props> = ({ onClose, onPurchase, currentBalance }) => {
  const [selectedPkg, setSelectedPkg] = useState('pro');
  const [loading, setLoading] = useState(false);

  const handlePurchase = () => {
    setLoading(true);
    const pkg = packages.find(p => p.id === selectedPkg);
    if (!pkg) return;

    // Simulação de processamento de pagamento
    setTimeout(() => {
      onPurchase(pkg.credits);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full z-10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Summary & Trust */}
        <div className="w-full md:w-1/3 bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold mb-6">
              <Zap className="w-5 h-5 fill-current" />
              <span>SISTEMA DE CRÉDITOS</span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Recarregue seu saldo</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Cada ação de IA (Gerar, Otimizar, Foto Profissional) consome 1 crédito.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Atual</p>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-slate-800">{currentBalance}</span>
                    <span className="text-xs font-medium text-slate-500">créditos disponíveis</span>
                </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 text-green-600 rounded-full mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs text-slate-600">Acesso instantâneo às ferramentas</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 text-green-600 rounded-full mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs text-slate-600">Download em PDF e Word ilimitado</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 text-green-600 rounded-full mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs text-slate-600">IA Premium Google Gemini 2.5</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
               <ShieldCheck className="w-4 h-4" /> Pagamento 100% Seguro
            </div>
          </div>
        </div>

        {/* Right Side: Packages */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="grid grid-cols-1 gap-4 mb-8">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all relative flex flex-col sm:flex-row sm:items-center justify-between gap-4
                  ${selectedPkg === pkg.id 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600' 
                    : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'}
                `}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Mais Popular
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner
                    ${pkg.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                      pkg.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}
                  `}>
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      {pkg.name} 
                      <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">{pkg.credits} Créditos</span>
                    </h3>
                    <p className="text-xs text-slate-500 max-w-[240px]">{pkg.description}</p>
                  </div>
                </div>

                <div className="text-right">
                   <p className="text-2xl font-black text-slate-800">{pkg.price}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Pagamento Único</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}
              `}
            >
              {loading ? (
                <>Processando... <Sparkles className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Comprar Agora <CreditCard className="w-5 h-5" /></>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-400">
              Ao clicar em comprar, você será redirecionado para o checkout seguro. <br/>
              Dúvidas? <a href="mailto:ajuda@cvmaster.com" className="text-indigo-500 hover:underline">Entre em contato</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
