import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, FileText, Search, Plus, Filter, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

const incomeData = [
  { name: 'Pzt', ciro: 4000, gider: 2400 },
  { name: 'Sal', ciro: 3000, gider: 1398 },
  { name: 'Çar', ciro: 2000, gider: 9800 },
  { name: 'Per', ciro: 2780, gider: 3908 },
  { name: 'Cum', ciro: 1890, gider: 4800 },
  { name: 'Cmt', ciro: 2390, gider: 3800 },
  { name: 'Paz', ciro: 3490, gider: 4300 },
];

export function Accounting() {
  const { transactions, addTransaction } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [method, setMethod] = useState('Kredi Kartı');
  const [eInvoice, setEInvoice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }
    
    addTransaction({
      date: 'Bugün',
      description,
      type,
      amount: type === 'income' ? `+₺${amount}` : `-₺${amount}`,
      method,
      eInvoice
    });
    
    toast.success('İşlem başarıyla kaydedildi!');
    setIsModalOpen(false);
    setDescription(''); setAmount(''); setType('income'); setMethod('Kredi Kartı'); setEInvoice(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Muhasebe ve Finans</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gelir-gider takibi, e-fatura kesimi ve finansal raporlamalar.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button onClick={() => toast.success('Demo: Rapor Dışa Aktarıldı')} className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Rapor Al
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
            <Plus className="h-4 w-4" />
            Yeni İşlem
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Gelir (Aylık)</p>
              <p className="text-2xl font-bold text-gray-900">₺142,500</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-semibold flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> 12%</span>
            <span className="text-gray-500 ml-2">geçen aya göre</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Gider (Aylık)</p>
              <p className="text-2xl font-bold text-gray-900">₺48,200</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-semibold flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> 4%</span>
            <span className="text-gray-500 ml-2">geçen aya göre</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Kâr (Aylık)</p>
              <p className="text-2xl font-bold text-gray-900">₺94,300</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-[#1B4332]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-semibold flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> 18%</span>
            <span className="text-gray-500 ml-2">geçen aya göre</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Finansal Akış</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCiro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="ciro" name="Gelir (₺)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCiro)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-slate-50/50">
            <h3 className="font-semibold text-gray-900">Son İşlemler</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5 text-green-600" /> : <ArrowDownRight className="h-5 w-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{tx.date}</span>
                      <span className="text-xs text-gray-400">• {tx.method}</span>
                      {tx.eInvoice && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">e-Arşiv</span>}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button onClick={() => toast.info('Demo: Tüm işlemlere gidiliyor')} className="w-full py-2 text-sm font-semibold text-[#1B4332] hover:text-[#122c21] transition-colors">
              Tümünü Gör
            </button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Yeni Finansal İşlem"
        description="Gelir veya gider kaydını deftere işleyin."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Açıklaması *</label>
              <input required value={description} onChange={e => setDescription(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: Muayene Ücreti veya Elektrik Faturası" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (₺) *</label>
              <input required value={amount} onChange={e => setAmount(e.target.value)} type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: 450" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Tipi *</label>
              <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option value="income">Gelir</option>
                <option value="expense">Gider</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Yöntemi</label>
              <select value={method} onChange={e => setMethod(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Kredi Kartı</option>
                <option>Nakit</option>
                <option>Havale/EFT</option>
                <option>Diğer</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center mt-6">
              <input type="checkbox" id="eInvoice" checked={eInvoice} onChange={e => setEInvoice(e.target.checked)} className="h-4 w-4 text-[#1B4332] focus:ring-[#1B4332] border-gray-300 rounded" />
              <label htmlFor="eInvoice" className="ml-2 block text-sm text-gray-900 font-medium">e-Fatura / e-Arşiv Kes</label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
              İptal
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] shadow-sm shadow-[#1B4332]/30">
              Kaydet
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
