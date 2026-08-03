import React, { useState } from 'react';
import { Plus, Search, Clock, MoreVertical, CheckCircle, XCircle, AlertCircle, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

// ─── WhatsApp yardımcısı ──────────────────────────────────
function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('90')) return d;
  if (d.startsWith('0')) return '90' + d.slice(1);
  if (d.startsWith('5')) return '90' + d;
  return d;
}
function openWhatsApp(phone: string | undefined, message: string) {
  if (!phone) { toast.error('Bu müşterinin telefon numarası kayıtlı değil.'); return; }
  window.open(`https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`, '_blank');
}
// ────────────────────────────────────────────────────────────

export function Appointments() {
  const { appointments, addAppointment, updateAppointmentStatus, patients, addTransaction } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const [patientName, setPatientName] = useState('');
  const [type, setType] = useState('Muayene');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !date || !time) { toast.error('Lütfen zorunlu alanları doldurun.'); return; }
    const existing = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
    const owner = existing ? existing.owner : 'Bilinmiyor';
    
    try {
      await addAppointment({ patient: patientName, owner, type, date, time, status: 'Bekliyor', color: 'bg-blue-100 text-blue-800' });
      
      // İşlem ücreti girildiyse otomatik muhasebeye işle
      if (price && Number(price) > 0) {
        await addTransaction({
          date: date === 'Bugün' ? new Date().toLocaleDateString('tr-TR') : date,
          description: `${type} Ücreti (${patientName})`,
          type: 'income',
          amount: `+₺${price}`,
          method: 'Nakit',
          eInvoice: false
        });
        toast.success('İşlem ücreti muhasebeye Gelir olarak kaydedildi.');
      }
      
      // Randevu eklendikten sonra WhatsApp onay mesajı göndermeyi teklif et
      if (existing?.phone) {
        const msg = `Merhaba ${owner} Hanım/Bey,\n${patientName} için ${date} tarihinde saat ${time}'de ${type} randevunuz oluşturulmuştur. ✅\nBilgi için kliniğimizi arayabilirsiniz. 🐾`;
        setTimeout(() => {
          if (window.confirm('Randevu onay mesajını WhatsApp ile göndermek ister misiniz?')) {
            openWhatsApp(existing.phone, msg);
          }
        }, 300);
      }
      
      toast.success('Randevu başarıyla eklendi!');
      setIsModalOpen(false);
      setPatientName(''); setType('Muayene'); setDate(''); setTime(''); setPrice('');
    } catch (err: any) {
      toast.error(err.message || 'Randevu eklenirken bir hata oluştu');
    }
  };

  const handleApprove = async (id: number | string, apt: typeof appointments[0]) => {
    try {
      await updateAppointmentStatus(id, 'Onaylandı');
      const patientRecord = patients.find(p => p.name === apt.patient);
      toast.success(`${apt.patient} için randevu onaylandı!`);
      if (patientRecord?.phone) {
        setTimeout(() => {
          if (window.confirm('Onay mesajını WhatsApp ile göndermek ister misiniz?')) {
            openWhatsApp(patientRecord.phone, `Merhaba ${apt.owner} Hanım/Bey,\n${apt.patient} için ${apt.date} tarihinde saat ${apt.time}'deki ${apt.type} randevunuz onaylanmıştır. ✅\nSizi kliniğimizde bekliyoruz! 🐾`);
          }
        }, 300);
      }
    } catch (err: any) {
      toast.error(err.message || 'İşlem başarısız oldu');
    }
  };

  const handleReject = async (id: number | string, apt: typeof appointments[0]) => {
    try {
      await updateAppointmentStatus(id, 'İptal');
      const patientRecord = patients.find(p => p.name === apt.patient);
      toast.success(`${apt.patient} için randevu iptal edildi.`);
      if (patientRecord?.phone) {
        setTimeout(() => {
          if (window.confirm('İptal mesajını WhatsApp ile göndermek ister misiniz?')) {
            openWhatsApp(patientRecord.phone, `Merhaba ${apt.owner} Hanım/Bey,\n${apt.patient} için talep ettiğiniz randevu maalesef kabul edilememiştir. Farklı bir tarih için lütfen bizimle iletişime geçin. 🐾`);
          }
        }, 300);
      }
    } catch (err: any) {
      toast.error(err.message || 'İşlem başarısız oldu');
    }
  };

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    'Bekliyor':       { color: 'bg-blue-100 text-blue-800',     icon: <AlertCircle className="h-3 w-3" /> },
    'Tamamlandı':     { color: 'bg-green-100 text-green-800',   icon: <CheckCircle className="h-3 w-3" /> },
    'Onaylandı':      { color: 'bg-indigo-100 text-indigo-800', icon: <CheckCircle className="h-3 w-3" /> },
    'İptal':          { color: 'bg-red-100 text-red-800',       icon: <XCircle className="h-3 w-3" /> },
    'Onay Bekliyor':  { color: 'bg-amber-100 text-amber-800',   icon: <Bell className="h-3 w-3" /> },
  };

  const filterOptions = ['Tümü', 'Onay Bekliyor', 'Bekliyor', 'Onaylandı', 'Tamamlandı', 'İptal'];
  const pendingCount = appointments.filter(a => a.status === 'Onay Bekliyor').length;

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = activeFilter === 'Tümü' || apt.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Randevu Takvimi</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Klinik randevularınızı, operasyonlarınızı ve kontrolleri yönetin.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
          <Plus className="h-4 w-4" /> Yeni Randevu
        </button>
      </div>

      {/* Hasta Portalı Talepleri Banner */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-800/50 flex-shrink-0">
            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-amber-800 dark:text-amber-300">{pendingCount} adet hasta portal talebi bekliyor</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">Hasta portalından gelen randevu taleplerini inceleyip onaylayabilir veya reddedebilirsiniz.</p>
          </div>
          <button
            onClick={() => setActiveFilter('Onay Bekliyor')}
            className="px-4 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors"
          >
            İncele
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-slate-900/40 border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50 dark:bg-slate-900/30">
          {/* Filtreler */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeFilter === f
                    ? 'bg-[#1B4332] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 shadow-sm border border-gray-200 dark:border-slate-600 hover:border-[#1B4332] dark:hover:border-[#95D5B2]'
                }`}
              >
                {f === 'Onay Bekliyor' && pendingCount > 0 && (
                  <span className={`h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center ${activeFilter === f ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'}`}>
                    {pendingCount}
                  </span>
                )}
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Hasta veya Sahip Ara..."
              className="w-full border rounded-lg border-gray-300 dark:border-slate-600 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[350px] pb-12">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
            <thead className="bg-slate-50/50 dark:bg-slate-900/30">
              <tr>
                {['Zaman', 'Hasta / Sahip', 'İşlem Tipi', 'Durum', 'İşlemler'].map((h, i) => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-slate-400">
                    {activeFilter !== 'Tümü' ? `"${activeFilter}" statüsünde randevu bulunamadı.` : 'Henüz randevu bulunmuyor.'}
                  </td>
                </tr>
              ) : filteredAppointments.map((apt) => {
                const patientRecord = patients.find(p => p.name === apt.patient);
                const cfg = statusConfig[apt.status] ?? { color: 'bg-gray-100 text-gray-700', icon: null };
                const isPending = apt.status === 'Onay Bekliyor';

                return (
                  <tr key={apt.id} className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${isPending ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-slate-200">
                        <Clock className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                        <span className="font-semibold">{apt.time}</span>
                        <span className="text-gray-500 dark:text-slate-400 ml-2 text-xs">({apt.date})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-700 dark:text-orange-400 font-bold text-xs">
                          {apt.patient.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-bold text-gray-900 dark:text-slate-100">
                            {apt.patient}
                            {isPending && <span className="ml-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-md">PORTAL</span>}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400">{apt.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{apt.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-md ${cfg.color}`}>
                        {cfg.icon}{apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Onay Bekliyor ise Onayla/Reddet butonları */}
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApprove(apt.id, apt)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#1B4332] text-white rounded-lg hover:bg-[#122c21] transition-colors shadow-sm"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Onayla
                            </button>
                            <button
                              onClick={() => handleReject(apt.id, apt)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reddet
                            </button>
                          </>
                        ) : (
                          <>
                            {/* WhatsApp hatırlatma butonu */}
                            <button
                              id={`appt-wa-${apt.id}`}
                              onClick={() => openWhatsApp(
                                patientRecord?.phone,
                                `Merhaba ${apt.owner} Hanım/Bey,\n${apt.patient} için ${apt.date} tarihinde saat ${apt.time}'deki ${apt.type} randevunuzu hatırlatmak istedik. 📅\nBeklenmedik bir durum varsa lütfen önceden bildiriniz. 🐾`
                              )}
                              title="WhatsApp hatırlatıcısı gönder"
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors"
                            >
                              💬 Hatırlat
                            </button>
                            <div className="relative">
                              <button onClick={() => setOpenDropdownId(openDropdownId === apt.id ? null : apt.id)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                              {openDropdownId === apt.id && (
                                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-10">
                                  <button onClick={() => { openWhatsApp(patientRecord?.phone, `Merhaba ${apt.owner} Hanım/Bey,\n${apt.patient} için ${apt.date} ${apt.time} randevunuz onaylanmıştır. ✅`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#25D366] hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 font-medium">
                                    ✅ Onay Mesajı Gönder
                                  </button>
                                  <button onClick={() => { openWhatsApp(patientRecord?.phone, `Merhaba ${apt.owner} Hanım/Bey,\n${apt.patient} için planlanan randevumuz maalesef iptal edilmiştir. Yeni randevu için lütfen bizi arayınız. 🐾`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                    ❌ İptal Mesajı Gönder
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Randevu Ekle" description="Klinik takvimine yeni bir randevu eklemek için formu doldurun.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Hasta Adı *</label>
              <input required value={patientName} onChange={e => setPatientName(e.target.value)} list="patient-list" type="text" className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white dark:bg-slate-700 text-gray-900 dark:text-white" placeholder="Kayıtlı hastanın adını girin..." />
              <datalist id="patient-list">{patients.map(p => <option key={p.id} value={p.name} />)}</datalist>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tarih *</label>
              <input required value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Saat *</label>
              <input required value={time} onChange={e => setTime(e.target.value)} type="time" className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">İşlem Tipi</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                <option>Muayene</option><option>Aşı (Karma)</option><option>Aşı (Kuduz)</option>
                <option>Kontrol</option><option>Operasyon</option><option>Tıraş & Bakım</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">İşlem Ücreti (₺)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white dark:bg-slate-700 text-gray-900 dark:text-white" placeholder="Örn: 450" />
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">Doldurulursa muhasebeye eklenir.</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-700 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] shadow-sm shadow-[#1B4332]/30">Kaydet & WA Gönder</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
