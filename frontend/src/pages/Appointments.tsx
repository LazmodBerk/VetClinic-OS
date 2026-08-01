import React, { useState } from 'react';
import { Plus, Search, Clock, MoreVertical, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
  const { appointments, addAppointment, patients, addTransaction } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [patientName, setPatientName] = useState('');
  const [type, setType] = useState('Muayene');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !date || !time) { toast.error('Lütfen zorunlu alanları doldurun.'); return; }
    const existing = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
    const owner = existing ? existing.owner : 'Bilinmiyor';
    addAppointment({ patient: patientName, owner, type, date, time, status: 'Bekliyor', color: 'bg-blue-100 text-blue-800' });
    
    // İşlem ücreti girildiyse otomatik muhasebeye işle
    if (price && Number(price) > 0) {
      addTransaction({
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
  };

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    'Bekliyor':    { color: 'bg-blue-100 text-blue-800',   icon: <AlertCircle className="h-3 w-3" /> },
    'Tamamlandı':  { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
    'Onaylandı':   { color: 'bg-indigo-100 text-indigo-800', icon: <CheckCircle className="h-3 w-3" /> },
    'İptal':       { color: 'bg-red-100 text-red-800',     icon: <XCircle className="h-3 w-3" /> },
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Randevu Takvimi</h2>
          <p className="mt-1 text-sm text-gray-500">Klinik randevularınızı, operasyonlarınızı ve kontrolleri yönetin.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
          <Plus className="h-4 w-4" /> Yeni Randevu
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2">
            {['Gün', 'Hafta', 'Ay'].map(v => (
              <button key={v} onClick={() => toast.info(`Takvim görünümü: ${v}`)} className={`px-3 py-1.5 text-sm font-medium rounded-lg ${v === 'Hafta' ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-700 shadow-sm border border-gray-200'}`}>{v}</button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Hasta veya Sahip Ara..." className="w-full border rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-slate-50/50">
              <tr>
                {['Zaman', 'Hasta / Sahip', 'İşlem Tipi', 'Durum', 'İşlemler'].map((h, i) => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {appointments.map((apt) => {
                const patientRecord = patients.find(p => p.name === apt.patient);
                const cfg = statusConfig[apt.status] ?? { color: 'bg-gray-100 text-gray-700', icon: null };

                return (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-semibold">{apt.time}</span>
                        <span className="text-gray-500 ml-2 text-xs">({apt.date})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
                          {apt.patient.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-bold text-gray-900">{apt.patient}</div>
                          <div className="text-xs text-gray-500">{apt.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-md ${cfg.color}`}>
                        {cfg.icon}{apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
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
                          <button onClick={() => setOpenDropdownId(openDropdownId === apt.id ? null : apt.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {openDropdownId === apt.id && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                              <button onClick={() => { openWhatsApp(patientRecord?.phone, `Merhaba ${apt.owner} Hanım/Bey,\n${apt.patient} için ${apt.date} ${apt.time} randevunuz onaylanmıştır. ✅`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#25D366] hover:bg-green-50 flex items-center gap-2 font-medium">
                                ✅ Onay Mesajı Gönder
                              </button>
                              <button onClick={() => { openWhatsApp(patientRecord?.phone, `Merhaba ${apt.owner} Hanım/Bey,\n${apt.patient} için planlanan randevumuz maalesef iptal edilmiştir. Yeni randevu için lütfen bizi arayınız. 🐾`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                ❌ İptal Mesajı Gönder
                              </button>
                            </div>
                          )}
                        </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta Adı *</label>
              <input required value={patientName} onChange={e => setPatientName(e.target.value)} list="patient-list" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Kayıtlı hastanın adını girin..." />
              <datalist id="patient-list">{patients.map(p => <option key={p.id} value={p.name} />)}</datalist>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
              <input required value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Saat *</label>
              <input required value={time} onChange={e => setTime(e.target.value)} type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Tipi</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Muayene</option><option>Aşı (Karma)</option><option>Aşı (Kuduz)</option>
                <option>Kontrol</option><option>Operasyon</option><option>Tıraş & Bakım</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Ücreti (₺)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: 450" />
              <p className="text-[10px] text-gray-400 mt-1">Doldurulursa muhasebeye eklenir.</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] shadow-sm shadow-[#1B4332]/30">Kaydet & WA Gönder</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
