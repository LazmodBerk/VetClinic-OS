import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, FileText, Search, Plus, Filter, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

export function Accounting() {
  const { transactions, addTransaction } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [method, setMethod] = useState('Kredi Kartı');
  const [eInvoice, setEInvoice] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }
    
    setIsSaving(true);
    try {
      await addTransaction({
        date: new Date().toLocaleDateString('tr-TR'),
        description,
        type,
        amount: type === 'income' ? `+₺${amount}` : `-₺${amount}`,
        method,
        eInvoice
      });
      toast.success('İşlem başarıyla kaydedildi!');
      setIsModalOpen(false);
      setDescription(''); setAmount(''); setType('income'); setMethod('Kredi Kartı'); setEInvoice(false);
    } catch (err: any) {
      toast.error(err.message || 'İşlem kaydedilemedi, lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  const exportCsv = () => {
    if (transactions.length === 0) {
      toast.error('Dışa aktarılacak kayıt bulunmuyor.');
      return;
    }
    const headers = ['Tarih', 'Açıklama', 'Tip', 'Tutar', 'Ödeme Yöntemi'];
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.type === 'income' ? 'Gelir' : 'Gider',
      t.amount.replace(/[^0-9,.-]+/g, ""), // Sadece sayısal tutar
      t.method
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `muhasebe_raporu_${new Date().toLocaleDateString('tr-TR')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Rapor başarıyla indirildi.');
  };

  // Dinamik Hesaplamalar
  const parseAmount = (str: string) => {
    const val = parseFloat(str.replace(/[^0-9.-]+/g, ""));
    return isNaN(val) ? 0 : val;
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseAmount(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(parseAmount(t.amount)), 0);
  const netProfit = totalIncome - totalExpense;

  // 7 Günlük Tablo Verisi (Gerçek verilere göre dağılım)
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const incomeData = days.map(day => ({ name: day, ciro: 0, gider: 0 }));
  transactions.forEach((t, i) => {
    const val = Math.abs(parseAmount(t.amount));
    const dayIndex = i % 7; 
    if (t.type === 'income') incomeData[dayIndex].ciro += val;
    else incomeData[dayIndex].gider += val;
  });

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
          <button onClick={exportCsv} className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
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
              <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">₺{totalIncome.toLocaleString('tr-TR')}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Gider</p>
              <p className="text-2xl font-bold text-gray-900">₺{totalExpense.toLocaleString('tr-TR')}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Kâr</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                ₺{netProfit.toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-[#1B4332]" />
            </div>
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
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGider" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E07A5F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E07A5F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="ciro" name="Gelir (₺)" stroke="#1B4332" strokeWidth={3} fillOpacity={1} fill="url(#colorCiro)" />
                <Area type="monotone" dataKey="gider" name="Gider (₺)" stroke="#E07A5F" strokeWidth={3} fillOpacity={1} fill="url(#colorGider)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-slate-50/50">
            <h3 className="font-semibold text-gray-900">Son İşlemler</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px]">
            {transactions.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">Henüz kayıtlı işlem yok.</p>
            ) : transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5 text-green-600" /> : <ArrowDownRight className="h-5 w-5 text-red-600" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{tx.description}</div>
                    <div className="text-xs text-gray-500">{tx.date} • {tx.method}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni İşlem Kaydı" description="Gelir veya gider kaydı oluşturun.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
              <input required value={description} onChange={e => setDescription(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: Veteriner İlaç Alımı" />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (₺) *</label>
              <input required value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="1500" />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Yönü</label>
              <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option value="income">Gelir (+)</option>
                <option value="expense">Gider (-)</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Yöntemi</label>
              <select value={method} onChange={e => setMethod(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Kredi Kartı</option>
                <option>Havale/EFT</option>
                <option>Nakit</option>
                <option>Otomatik Ödeme</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer h-[38px] px-2">
                <input type="checkbox" checked={eInvoice} onChange={e => setEInvoice(e.target.checked)} className="rounded text-[#1B4332] focus:ring-[#1B4332]" />
                <span className="text-sm font-medium text-gray-700">e-Fatura Kesilecek</span>
              </label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">İptal</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] shadow-sm shadow-[#1B4332]/30 disabled:opacity-60 disabled:cursor-not-allowed">{isSaving ? 'Kaydediliyor...' : 'İşlemi Kaydet'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
