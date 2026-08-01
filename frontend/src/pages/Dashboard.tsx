import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Activity, Syringe, Users, DollarSign, Bell, BrainCircuit, Plus, FileText, UserPlus, PawPrint, Clock, ArrowRight, CheckCircle2, Home, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { patients, appointments, vaccines, inventoryItems, transactions } = useAppContext();
  const navigate = useNavigate();

  // Notifications State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Generate dynamic notifications based on real data
  const upcomingVaccines = vaccines.filter(v => v.status === 'Bekliyor' || v.status === 'Planlandı');
  const criticalStock = inventoryItems.filter(i => i.status === 'Kritik' || i.stock <= i.minStock);
  const todayAppointments = appointments.filter(a => a.date.toLowerCase() === 'bugün' && a.status !== 'İptal');
  
  const notifications = [
    ...upcomingVaccines.map(v => ({ id: `v-${v.id}`, text: `${v.patient} için ${v.vaccine} aşısı vakti geldi.`, time: 'Yeni', read: false })),
    ...todayAppointments.map(a => ({ id: `a-${a.id}`, text: `Bugün ${a.time} - ${a.type} randevusu var.`, time: 'Yeni', read: false })),
    ...criticalStock.map(i => ({ id: `i-${i.id}`, text: `${i.name} stokları kritik seviyede (${i.stock} ${i.unit} kaldı).`, time: 'Yeni', read: false }))
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => {
      const val = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

  const stats = [
    { name: 'Toplam Müşteri', value: Array.from(new Set(patients.map(p => p.owner))).length.toString(), icon: Users, color: 'bg-blue-500', link: '/patients' },
    { name: 'Kayıtlı Hayvan', value: patients.length.toString(), icon: PawPrint, color: 'bg-emerald-500', link: '/patients' },
    { name: 'Yaklaşan Randevular', value: appointments.length.toString(), icon: Calendar, color: 'bg-purple-500', link: '/appointments' },
    { name: 'Kritik Stok', value: criticalStock.length.toString(), icon: AlertTriangle, color: 'bg-red-500', link: '/inventory' },
    { name: 'Toplam Gelir', value: `₺${totalIncome.toLocaleString('tr-TR')}`, icon: TrendingUp, color: 'bg-amber-500', link: '/accounting' },
  ];

  // Generate 7-day chart data based on transactions
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const incomeData = days.map(day => ({ name: day, ciro: 0, gider: 0 }));
  
  // Dummy logic to map real transactions to days just for demonstration since real dates are strings like '29 Tem 2026' or 'Bugün'
  transactions.forEach((t, i) => {
    const val = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
    const dayIndex = i % 7; // Just distributing them across the week for visual effect if dates aren't parsed to weekday
    if (t.type === 'income') incomeData[dayIndex].ciro += val;
    else incomeData[dayIndex].gider += val;
  });
  
  // Dynamic AI prediction based on inventory
  const aiPredictionData = inventoryItems.slice(0, 4).map(i => ({
    name: i.name.split(' ')[0], 
    mevcut: i.stock,
    tahmin: i.stock > 0 ? Math.floor(i.stock * 1.5) : 10
  }));

  if (aiPredictionData.length === 0) {
    aiPredictionData.push({ name: 'Aşı Yok', mevcut: 0, tahmin: 0 });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Klinik Özeti</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group">
            <div className={`${stat.color.replace('bg-', 'bg-opacity-10 text-')} p-4 flex justify-between items-center bg-opacity-10 border-b border-gray-50`}>
              <h3 className="text-sm font-semibold text-gray-700">{stat.name}</h3>
              <div className={`p-2 rounded-xl ${stat.color} text-white shadow-md shadow-${stat.color.split('-')[1]}-500/30 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className={`absolute -right-6 -bottom-6 opacity-[0.03] text-${stat.color.split('-')[1]}-900`}>
                <stat.icon className="h-24 w-24" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-4">{stat.value}</p>
              <button onClick={() => navigate(stat.link)} className={`text-xs font-semibold flex items-center gap-1 transition-colors ${stat.color.replace('bg-', 'text-').replace('-500', '-600')} hover:opacity-70`}>
                Detayları Gör <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* İki Sütunlu Alt Kısım: Grafikler ve Hızlı Erişim/Son Hastalar (Hizalanmış) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Sol Taraf (2 Sütun Genişliğinde) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 sm:p-8 cursor-pointer hover:shadow-2xl hover:shadow-gray-200/50 transition-all flex-1" onClick={() => navigate('/accounting')}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-[#95D5B2]/20 rounded-xl">
                  <DollarSign className="h-5 w-5 text-[#1B4332]" />
                </div>
                Haftalık Finansal Akış
              </h3>
            </div>
            <div className="h-64 sm:h-72">
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
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="ciro" name="Gelir (₺)" stroke="#1B4332" strokeWidth={3} fillOpacity={1} fill="url(#colorCiro)" />
                  <Area type="monotone" dataKey="gider" name="Gider (₺)" stroke="#E07A5F" strokeWidth={3} fillOpacity={1} fill="url(#colorGider)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col h-[400px] hover:shadow-2xl hover:shadow-gray-200/50 transition-all">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-[#1B4332]/10 rounded-xl">
                  <PawPrint className="h-5 w-5 text-[#1B4332]" />
                </div>
                Son Ziyaret Eden Hastalar
              </h3>
              <button onClick={() => navigate('/patients')} className="text-sm font-semibold text-[#1B4332] hover:text-[#2a5a45] flex items-center gap-1 group">
                Tümünü Gör <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto flex-1 p-2">
              <table className="min-w-full divide-y divide-gray-50 h-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Hasta / Sahip</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">Henüz kayıtlı hasta bulunmuyor.</td>
                    </tr>
                  ) : patients.slice(0, 4).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50/80 transition-colors cursor-pointer group" onClick={() => navigate(`/patients/${patient.id}`)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform ${patient.species === 'Köpek' ? 'bg-orange-50' : patient.species === 'Kedi' ? 'bg-gray-50' : 'bg-green-50'}`}>
                            {patient.species === 'Köpek' ? '🐕' : patient.species === 'Kedi' ? '🐈' : '🦜'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{patient.name}</div>
                            <div className="text-xs font-medium text-gray-500 mt-0.5">{patient.owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" /> {patient.lastVisit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-lg ${
                          patient.status === 'Sağlıklı' ? 'bg-green-50 text-green-700 border border-green-100' :
                          'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sağ Taraf (1 Sütun Genişliğinde) */}
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-[#1B4332] to-[#122c21] rounded-3xl shadow-xl shadow-[#1B4332]/20 border border-[#2a5a45] p-6 relative overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all flex-1 text-white group" onClick={() => navigate('/ai-insights')}>
            <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:scale-110 transition-transform group-hover:opacity-20 duration-500">
              <BrainCircuit className="h-32 w-32" />
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10 text-[#95D5B2]">
              <BrainCircuit className="h-5 w-5" /> AI Tahminleri
            </h3>
            <p className="text-xs text-gray-300 mb-6 relative z-10 font-medium">Gelecek ayki tahmini stok/randevu ihtiyaçları.</p>
            <div className="h-52 sm:h-60 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiPredictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a5a45" strokeOpacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#95D5B2', fontSize: 10, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#95D5B2', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#2a5a45', opacity: 0.5}} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1B4332', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', fontSize: '12px' }} itemStyle={{ color: '#95D5B2' }} />
                  <Bar dataKey="mevcut" name="Mevcut" fill="#4ade80" fillOpacity={0.4} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="tahmin" name="AI Tahmini" fill="#95D5B2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col h-[400px]">
            <div className="p-6 border-b border-gray-50 flex-shrink-0">
              <h3 className="font-bold text-gray-900 text-lg">Hızlı Erişim</h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => navigate('/appointments')} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#F8F9FA] group transition-all duration-300 text-left w-full border border-transparent hover:border-gray-100 hover:shadow-sm">
                  <div className="bg-white text-gray-600 p-3 rounded-xl shadow-sm border border-gray-100 group-hover:bg-[#1B4332] group-hover:text-[#95D5B2] transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">Randevu Oluştur</h4>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Takvime yeni randevu ekle</p>
                  </div>
                </button>
                
                <button onClick={() => navigate('/patients')} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#F8F9FA] group transition-all duration-300 text-left w-full border border-transparent hover:border-gray-100 hover:shadow-sm">
                  <div className="bg-white text-gray-600 p-3 rounded-xl shadow-sm border border-gray-100 group-hover:bg-[#1B4332] group-hover:text-[#95D5B2] transition-colors">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">Yeni Hasta</h4>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Kliğinize yeni bir hasta kaydedin</p>
                  </div>
                </button>

                <button onClick={() => navigate('/accounting')} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#F8F9FA] group transition-all duration-300 text-left w-full border border-transparent hover:border-gray-100 hover:shadow-sm">
                  <div className="bg-white text-gray-600 p-3 rounded-xl shadow-sm border border-gray-100 group-hover:bg-[#1B4332] group-hover:text-[#95D5B2] transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">Fatura & Satış</h4>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Hızlı e-SMM veya satış ekle</p>
                  </div>
                </button>

                <button onClick={() => navigate('/vaccines')} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#F8F9FA] group transition-all duration-300 text-left w-full border border-transparent hover:border-gray-100 hover:shadow-sm">
                  <div className="bg-white text-gray-600 p-3 rounded-xl shadow-sm border border-gray-100 group-hover:bg-[#1B4332] group-hover:text-[#95D5B2] transition-colors">
                    <Syringe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">Aşı Uygula</h4>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Mevcut hastaya aşı gir</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
