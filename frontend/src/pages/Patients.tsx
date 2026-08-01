import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Calendar, User, Syringe, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext, honorific } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';

// ─── WhatsApp yardımcıları ───────────────────────────────
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('90')) return digits;
  if (digits.startsWith('0')) return '90' + digits.slice(1);
  if (digits.startsWith('5')) return '90' + digits;
  return digits;
}

function openWhatsApp(phone: string | undefined, message: string) {
  if (!phone) { toast.error('Bu müşterinin telefon numarası kayıtlı değil.'); return; }
  window.open(`https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`, '_blank');
}
// ────────────────────────────────────────────────────────

export function Patients() {
  const { patients, addPatient, deletePatient } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Köpek');
  const [breed, setBreed] = useState('');
  const [owner, setOwner] = useState('');
  const [ownerGender, setOwnerGender] = useState<'bay' | 'bayan'>('bay');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');

  const resetForm = () => {
    setName(''); setSpecies('Köpek'); setBreed('');
    setOwner(''); setOwnerGender('bay'); setPhone(''); setWeight('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !owner) { toast.error('Lütfen zorunlu alanları doldurun.'); return; }
    addPatient({
      name, species,
      breed: breed || 'Belirtilmedi',
      owner, ownerGender, phone,
      weight: weight ? `${weight} kg` : '-',
      lastVisit: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Sağlıklı'
    });
    toast.success(`${name} başarıyla eklendi!`);
    setIsModalOpen(false);
    resetForm();
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Hasta Kayıtları</h2>
          <p className="mt-1 text-sm text-gray-500">Tüm hasta detaylarına, geçmiş tedavilere ve karne bilgilerine buradan ulaşabilirsiniz.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
          <Plus className="h-4 w-4" /> Yeni Hasta Ekle
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-gray-900">
            Hasta Listesi <span className="text-gray-400 text-sm font-normal">({filtered.length} kayıt)</span>
          </h3>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Hasta veya Sahip Ara..."
              className="w-full border rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/30">
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <p className="text-lg">Kayıt bulunamadı</p>
              <p className="text-sm mt-1">Yeni hasta eklemek için "Yeni Hasta Ekle" butonuna tıklayın.</p>
            </div>
          )}
          {filtered.map((patient) => {
            const title = honorific(patient.ownerGender);
            return (
              <div key={patient.id} className="bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl shadow-inner ${patient.species === 'Köpek' ? 'bg-orange-100' : patient.species === 'Kedi' ? 'bg-gray-100' : 'bg-green-100'}`}>
                      {patient.species === 'Köpek' ? '🐕' : patient.species === 'Kedi' ? '🐈' : '🦜'}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.species} • {patient.breed}</p>
                    </div>
                  </div>
                  {/* Dropdown menü */}
                  <div className="relative">
                    <button onClick={() => setOpenDropdownId(openDropdownId === patient.id ? null : patient.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {openDropdownId === patient.id && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                        <button onClick={() => { navigate(`/patients/${patient.id}`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <User className="h-4 w-4" /> Profili Gör
                        </button>
                        <button onClick={() => { navigate('/appointments'); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> Randevu Ver
                        </button>
                        <button onClick={() => { navigate('/vaccines'); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Syringe className="h-4 w-4" /> Aşı Ekle
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button onClick={() => { openWhatsApp(patient.phone, `Merhaba ${patient.owner} ${title},\n${patient.name} ile ilgili bilgilendirme yapmak istiyoruz. Müsait bir zamanda kliniğimizle iletişime geçebilir misiniz? 🐾`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#25D366] hover:bg-green-50 flex items-center gap-2 font-medium">
                          💬 WhatsApp Mesaj Gönder
                        </button>
                        <button onClick={() => { openWhatsApp(patient.phone, `Merhaba ${patient.owner} ${title},\n${patient.name} adlı ${(patient.species || '').toLowerCase() || 'dostunuzun'} randevusunu hatırlatmak istedik. 📅\nBeklenmedik bir durum varsa lütfen önceden bildiriniz. 🐾`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#25D366] hover:bg-green-50 flex items-center gap-2 font-medium">
                          📅 Randevu Hatırlatıcısı
                        </button>
                        <button onClick={() => { openWhatsApp(patient.phone, `Merhaba ${patient.owner} ${title},\n${patient.name} adlı ${(patient.species || '').toLowerCase() || 'dostunuzun'} aşı zamanı yaklaşıyor! 💉\nLütfen kliniğimizle iletişime geçerek randevu alınız. 🐾`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#25D366] hover:bg-green-50 flex items-center gap-2 font-medium">
                          💉 Aşı Hatırlatıcısı
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button onClick={() => { deletePatient(patient.id); toast.success(`${patient.name} sistemden silindi.`); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="h-4 w-4" /> Hastayı Sil
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 mb-4 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sahibi:</span>
                    <span className="font-medium text-gray-900">{patient.owner} {title}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Telefon:</span>
                      <span className="font-medium text-gray-900">{patient.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Son Ziyaret:</span>
                    <span className="font-medium text-gray-900">{patient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ağırlık:</span>
                    <span className="font-medium text-gray-900">{patient.weight}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${patient.status === 'Sağlıklı' ? 'bg-green-100 text-green-700' : patient.status === 'Tedavide' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {patient.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      id={`whatsapp-btn-${patient.id}`}
                      onClick={() => openWhatsApp(patient.phone, `Merhaba ${patient.owner} ${title},\n${patient.name} ile ilgili bilgilendirme yapmak istiyoruz. 🐾`)}
                      title="WhatsApp ile mesaj gönder"
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors shadow-sm"
                    >
                      💬 WA
                    </button>
                    <button onClick={() => navigate(`/patients/${patient.id}`)} className="text-sm font-semibold text-[#1B4332] hover:text-[#122c21]">
                      Profili Gör →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yeni Hasta Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title="Yeni Hasta Ekle" description="Kliniğinize yeni bir hasta kaydetmek için aşağıdaki bilgileri doldurun.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Hasta adı */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta Adı *</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: Tarçın" />
            </div>
            {/* Tür */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
              <select value={species} onChange={e => setSpecies(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Köpek</option><option>Kedi</option><option>Kuş</option><option>Egzotik</option>
              </select>
            </div>
            {/* Irk */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Irk</label>
              <input value={breed} onChange={e => setBreed(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: Golden Retriever" />
            </div>
            {/* Hasta Sahibi */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta Sahibi *</label>
              <input required value={owner} onChange={e => setOwner(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: Ahmet Yılmaz" />
            </div>
            {/* Cinsiyet */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sahip Cinsiyeti</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOwnerGender('bay')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${ownerGender === 'bay' ? 'border-[#1B4332] bg-[#1B4332] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  👨 Bay
                </button>
                <button
                  type="button"
                  onClick={() => setOwnerGender('bayan')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${ownerGender === 'bayan' ? 'border-[#1B4332] bg-[#1B4332] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  👩 Bayan
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">WhatsApp mesajlarında "Hanım" veya "Bey" olarak kullanılır</p>
            </div>
            {/* Telefon */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">📱 Telefon (WhatsApp)</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="5551234567" />
            </div>
            {/* Kilo */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilo (kg)</label>
              <input value={weight} onChange={e => setWeight(e.target.value)} type="number" step="0.1" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: 28" />
            </div>
          </div>
          {/* Önizleme */}
          {owner && (
            <div className="bg-[#e5ddd5] rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">📱 WhatsApp mesaj önizlemesi:</p>
              <p className="text-xs text-gray-800">
                Merhaba {owner} {honorific(ownerGender)},<br />
                {name || 'Hayvanınız'} ile ilgili bilgilendirme yapmak istiyoruz. 🐾
              </p>
            </div>
          )}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] shadow-sm shadow-[#1B4332]/30">Kaydet</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
