import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Clock, AlertCircle, BrainCircuit } from 'lucide-react';

const revenueData = [
  { month: 'Nis', actual: 20000, predicted: null },
  { month: 'May', actual: 25000, predicted: null },
  { month: 'Haz', actual: 28000, predicted: null },
  { month: 'Haz', actual: null, predicted: 28000 },
  { month: 'Tem (Tahmin)', actual: null, predicted: 32000 },
  { month: 'Ağu (Tahmin)', actual: null, predicted: 38000 },
  { month: 'Eyl (Tahmin)', actual: null, predicted: 42000 },
];

const aiPredictionData = [
  { name: 'Kuduz', mevcut: 45, tahmin: 60 },
  { name: 'Karma', mevcut: 80, tahmin: 110 },
  { name: 'Lyme', mevcut: 30, tahmin: 40 },
  { name: 'Lösemi', mevcut: 25, tahmin: 35 },
];

const densityData = [
  { time: '09:00', value: 30 },
  { time: '11:00', value: 80 },
  { time: '14:00', value: 95 },
  { time: '16:00', value: 60 },
  { time: '18:00', value: 40 },
];

export function AiInsights() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Brain className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">İş Zekası (AI Insights)</h2>
            <p className="text-sm text-gray-500">
              Makine öğrenmesi destekli büyüme ve operasyonel tahminler.
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium">Klinik Büyüme Skoru</p>
          <div className="flex items-center justify-end gap-1 text-3xl font-bold text-green-600">
            87 <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf: Grafikler */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gelir Tahmin Modeli */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-bold text-gray-900">Gelir Tahmin Modeli</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Geçmiş verilere dayanarak önümüzdeki 3 ayın gelir beklentisi.</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4B5563" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4B5563" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₺${val/1000}k`} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="actual" stroke="#4B5563" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Gerçekleşen" connectNulls />
                  <Area type="monotone" dataKey="predicted" stroke="#EC4899" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="Yapay Zeka Tahmini" connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-600"></div> Gerçekleşen (₺)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div> Yapay Zeka Tahmini (₺)</div>
            </div>
          </div>

          {/* Yoğunluk Analizi */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-bold text-gray-900">Yoğunluk Analizi</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Randevu ve giriş çıkış verilerine göre günün en yoğun saatleri. Personel planlaması için kullanabilirsiniz.</p>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={densityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <RechartsTooltip cursor={{ fill: '#F3F4F6' }} />
                  <Bar dataKey="value" fill="#1F2937" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Aşı Tahmini */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <BrainCircuit className="h-24 w-24 text-[#1B4332]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2 relative z-10">
              <BrainCircuit className="h-5 w-5 text-[#1B4332]" /> AI Aşı Tahmini
            </h3>
            <p className="text-sm text-gray-500 mb-6">Mevsimsel ve dönemsel verilere göre gelecek ayki tahmini stok ihtiyaçlarınız.</p>
            <div className="h-64 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiPredictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Bar dataKey="mevcut" name="Geçen Ay" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tahmin" name="AI Tahmini" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Sağ Taraf: Akıllı Uyarılar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-gray-900">Akıllı Uyarılar</h3>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 leading-relaxed">
              <strong>Kuduz Aşısı</strong> stok tüketim hızı %40 arttı. 4 gün içinde tükenebilir.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-900 leading-relaxed">
              Son 6 aydır ziyarete gelmeyen <strong>42 kayıtlı hasta</strong> tespit edildi. Otomatik 'Özledik' SMS'i planlanabilir.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Havaların ısınmasıyla <strong>'Kene/Pire'</strong> şikayetleri %60 arttı. Kampanya düzenlenmesi önerilir.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
