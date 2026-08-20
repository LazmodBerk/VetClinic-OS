import {
  ArrowRight, Calendar, CheckCircle2, CircleDollarSign, Package, PawPrint,
  Plus, Sparkles, Syringe, TrendingDown, TrendingUp, UserPlus,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const moneyValue = (value: string) => {
  const normalized = value.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]+/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number) => new Intl.NumberFormat('tr-TR', {
  style: 'currency', currency: 'TRY', maximumFractionDigits: 0,
}).format(value);

const isToday = (date: string) => {
  const normalized = date.toLocaleLowerCase('tr-TR').trim();
  return normalized === 'bugün' || normalized === new Date().toLocaleDateString('tr-TR').toLocaleLowerCase('tr-TR');
};

export function Dashboard() {
  const { patients, appointments, vaccines, inventoryItems, transactions, settings } = useAppContext();
  const navigate = useNavigate();

  const criticalStock = inventoryItems.filter((item) => item.status === 'Kritik' || item.stock <= item.minStock);
  const waitingVaccines = vaccines.filter((vaccine) => vaccine.status === 'Bekliyor' || vaccine.status === 'Planlandı');
  const todayAppointments = appointments
    .filter((appointment) => isToday(appointment.date) && appointment.status !== 'İptal')
    .sort((a, b) => a.time.localeCompare(b.time, 'tr'));

  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + moneyValue(item.amount), 0);
  const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + moneyValue(item.amount), 0);
  const balance = income - expense;
  const completedToday = todayAppointments.filter((item) => ['Tamamlandı', 'Onaylandı'].includes(item.status)).length;
  const financialSeries = [...transactions].reverse().slice(-8).map((item, index) => ({
    label: item.date || `${index + 1}. işlem`,
    gelir: item.type === 'income' ? moneyValue(item.amount) : 0,
    gider: item.type === 'expense' ? moneyValue(item.amount) : 0,
  }));

  const stats = [
    { label: 'Aktif hasta', value: patients.length.toLocaleString('tr-TR'), detail: `${new Set(patients.map((item) => item.owner)).size} hasta sahibi`, icon: PawPrint, accent: 'emerald', path: '/patients' },
    { label: 'Bugünkü randevu', value: todayAppointments.length.toLocaleString('tr-TR'), detail: `${completedToday} tamamlanan / onaylı`, icon: Calendar, accent: 'blue', path: '/appointments' },
    { label: 'Bekleyen aşı', value: waitingVaccines.length.toLocaleString('tr-TR'), detail: waitingVaccines.length ? 'Takip gerektiriyor' : 'Takvim güncel', icon: Syringe, accent: 'amber', path: '/vaccines' },
    { label: 'Net bakiye', value: formatCurrency(balance), detail: `${formatCurrency(income)} toplam gelir`, icon: CircleDollarSign, accent: balance >= 0 ? 'emerald' : 'rose', path: '/accounting' },
  ];

  const accentStyles: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
  };
  const todayLabel = new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <div className="space-y-7 pb-8 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#153b2d] px-6 py-7 text-white shadow-[0_24px_70px_-34px_rgba(21,59,45,0.75)] sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[42px] border-white/[0.04]" />
        <div className="absolute bottom-0 right-28 h-32 w-32 rounded-full bg-[#95D5B2]/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#95D5B2]">
              <span className="h-2 w-2 rounded-full bg-[#95D5B2] shadow-[0_0_0_5px_rgba(149,213,178,0.12)]" /> Klinik operasyon merkezi
            </div>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Günaydın, {settings.clinicName}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/70 sm:text-base">
              {todayLabel.charAt(0).toLocaleUpperCase('tr-TR') + todayLabel.slice(1)} için kliniğinizin öncelikleri ve performansı burada.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/patients')} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#95D5B2]">
              <UserPlus className="h-4 w-4" /> Yeni hasta
            </button>
            <button onClick={() => navigate('/appointments')} className="inline-flex items-center gap-2 rounded-xl bg-[#95D5B2] px-4 py-3 text-sm font-bold text-[#153b2d] shadow-lg shadow-black/10 transition hover:bg-[#b7e4c7] focus:outline-none focus:ring-2 focus:ring-white">
              <Plus className="h-4 w-4" /> Randevu oluştur
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Klinik göstergeleri">
        {stats.map((stat) => (
          <button key={stat.label} onClick={() => navigate(stat.path)} className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-[0_10px_35px_-24px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className={`rounded-xl p-2.5 ${accentStyles[stat.accent]}`}><stat.icon className="h-5 w-5" /></div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#2D6A4F] dark:text-slate-600" />
            </div>
            <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{stat.value}</p>
            <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">{stat.detail}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.45)] sm:p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Finansal görünüm</p><h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">Son işlemlerde nakit akışı</h2></div>
            <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#2D6A4F]" /> Gelir</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#E07A5F]" /> Gider</span></div>
          </div>
          {financialSeries.length ? (
            <div className="mt-5 h-64 sm:h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={financialSeries} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <defs><linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.25} /><stop offset="100%" stopColor="#2D6A4F" stopOpacity={0} /></linearGradient><linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E07A5F" stopOpacity={0.22} /><stop offset="100%" stopColor="#E07A5F" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 6" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(15,23,42,.10)' }} />
              <Area type="monotone" dataKey="gelir" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#incomeGradient)" /><Area type="monotone" dataKey="gider" stroke="#E07A5F" strokeWidth={2.5} fill="url(#expenseGradient)" />
            </AreaChart></ResponsiveContainer></div>
          ) : (
            <div className="mt-5 flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 text-center dark:border-slate-700 dark:bg-slate-900/40"><CircleDollarSign className="h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">Henüz finansal işlem yok</p><button onClick={() => navigate('/accounting')} className="mt-2 text-xs font-bold text-[#2D6A4F] dark:text-[#95D5B2]">İlk işlemi ekle</button></div>
          )}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-700 sm:grid-cols-3">
            <div><p className="text-xs font-semibold text-slate-400">Gelir</p><p className="mt-1 flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300"><TrendingUp className="h-4 w-4" /> {formatCurrency(income)}</p></div>
            <div><p className="text-xs font-semibold text-slate-400">Gider</p><p className="mt-1 flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-300"><TrendingDown className="h-4 w-4" /> {formatCurrency(expense)}</p></div>
            <button onClick={() => navigate('/accounting')} className="col-span-2 flex items-end justify-end text-xs font-bold text-[#2D6A4F] hover:underline dark:text-[#95D5B2] sm:col-span-1">Finansı aç <ArrowRight className="ml-1 h-4 w-4" /></button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_-24px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-700"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Günün akışı</p><h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">Bugünkü randevular</h2></div><button onClick={() => navigate('/appointments')} aria-label="Randevulara git" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#2D6A4F] dark:hover:bg-slate-700"><ArrowRight className="h-5 w-5" /></button></div>
          <div className="max-h-[360px] space-y-1 overflow-y-auto p-3 custom-scrollbar">
            {todayAppointments.length ? todayAppointments.slice(0, 6).map((item) => (
              <button key={item.id} onClick={() => navigate('/appointments')} className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/60"><div className="w-14 shrink-0 rounded-lg bg-slate-100 px-2 py-2 text-center text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">{item.time}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.patient}</p><p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{item.owner} · {item.type}</p></div><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#95D5B2] ring-4 ring-[#95D5B2]/15" /></button>
            )) : (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><CheckCircle2 className="h-9 w-9 text-emerald-400" /><p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">Bugün planlı randevu yok</p><p className="mt-1 text-xs leading-5 text-slate-400">Yeni bir randevu oluşturarak günü planlayabilirsiniz.</p></div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Öncelikler</p><h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">Dikkat gerektirenler</h2></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">{criticalStock.length + waitingVaccines.length} kayıt</span></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button onClick={() => navigate('/inventory')} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-rose-200 hover:bg-rose-50/50 dark:border-slate-700 dark:hover:bg-rose-400/5"><div className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"><Package className="h-5 w-5" /></div><div><p className="text-sm font-bold text-slate-800 dark:text-slate-100">Kritik stok</p><p className="mt-0.5 text-xs text-slate-500">{criticalStock.length} ürün sipariş bekliyor</p></div></button>
            <button onClick={() => navigate('/vaccines')} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-amber-200 hover:bg-amber-50/50 dark:border-slate-700 dark:hover:bg-amber-400/5"><div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300"><Syringe className="h-5 w-5" /></div><div><p className="text-sm font-bold text-slate-800 dark:text-slate-100">Aşı takibi</p><p className="mt-0.5 text-xs text-slate-500">{waitingVaccines.length} uygulama planlanmalı</p></div></button>
          </div>
        </div>
        <button onClick={() => navigate('/ai-assistant')} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#153b2d] p-6 text-left text-white shadow-[0_18px_50px_-28px_rgba(21,59,45,0.8)] transition hover:-translate-y-0.5">
          <Sparkles className="absolute -bottom-5 -right-4 h-28 w-28 text-white/[0.06] transition group-hover:scale-110" /><div className="relative"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#95D5B2]"><Sparkles className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-bold">CanVet AI ile hız kazanın</h2><p className="mt-2 max-w-md text-sm leading-6 text-emerald-50/70">Hasta kayıtları, stok ve klinik performansı hakkında doğal dilde sorular sorun.</p><span className="mt-4 inline-flex items-center text-xs font-bold text-[#95D5B2]">Asistanı aç <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" /></span></div>
        </button>
      </section>
    </div>
  );
}
