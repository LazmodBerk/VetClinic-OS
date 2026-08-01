import React, { useState } from 'react';
import { Send, MessageCircle, Users, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext, honorific } from '../context/AppContext';

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('90')) return d;
  if (d.startsWith('0')) return '90' + d.slice(1);
  if (d.startsWith('5')) return '90' + d;
  return d;
}

function openWhatsApp(phone: string, message: string) {
  window.open(`https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`, '_blank');
}

const TEMPLATES = [
  {
    id: 'appointment',
    icon: '📅',
    label: 'Randevu Hatırlatıcısı',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    text: (name: string, owner: string) =>
      `Merhaba ${owner} Hanım/Bey,\n${name} için randevunuz yaklaşıyor. Kliniğimizde görüşmek üzere! 🐾`,
  },
  {
    id: 'vaccine',
    icon: '💉',
    label: 'Aşı Hatırlatıcısı',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    text: (name: string, owner: string) =>
      `Merhaba ${owner} Hanım/Bey,\n${name} adlı dostunuzun aşı zamanı yaklaşıyor. Lütfen kliniğimizle iletişime geçiniz. 🐾`,
  },
  {
    id: 'checkup',
    icon: '🩺',
    label: 'Kontrol Zamanı',
    color: 'bg-green-50 border-green-200 text-green-700',
    text: (name: string, owner: string) =>
      `Merhaba ${owner} Hanım/Bey,\n${name} için periyodik kontrol zamanı geldi. Sağlığı için muayene yaptırmanızı öneririz. 🐾`,
  },
  {
    id: 'custom',
    icon: '✏️',
    label: 'Özel Mesaj',
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    text: () => '',
  },
];

export function Communication() {
  const { patients, appointments, vaccines } = useAppContext();
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [customText, setCustomText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'treatment' | 'vaccine_due' | 'appointment_tomorrow'>('all');
  const [sentCount, setSentCount] = useState(0);

  const template = TEMPLATES.find(t => t.id === selectedTemplate)!;

  // Müşteri gruplarını belirle
  const groups: Record<string, typeof patients> = {
    all: patients.filter(p => p.phone),
    treatment: patients.filter(p => p.phone && p.status === 'Tedavide'),
    vaccine_due: patients.filter(p => {
      const v = vaccines.find(v => v.patient === p.name && v.status === 'Gecikmiş');
      return p.phone && !!v;
    }),
    appointment_tomorrow: patients.filter(p => {
      const a = appointments.find(a => a.patient === p.name && a.date === 'Yarın');
      return p.phone && !!a;
    }),
  };

  const recipients = groups[selectedGroup];

  function buildMessage(patient: typeof patients[0]) {
    if (selectedTemplate === 'custom') return customText;
    return template.text(patient.name, patient.owner);
  }

  function sendToAll() {
    if (recipients.length === 0) {
      toast.error('Bu grupta telefon numarası kayıtlı müşteri yok.');
      return;
    }
    if (selectedTemplate === 'custom' && !customText.trim()) {
      toast.error('Lütfen mesaj yazın.');
      return;
    }

    let count = 0;
    recipients.forEach((p, i) => {
      setTimeout(() => {
        openWhatsApp(p.phone ?? '', buildMessage(p));
        count++;
        if (count === recipients.length) {
          setSentCount(prev => prev + count);
          toast.success(`${count} kişiye WhatsApp açıldı! Her birinde "Gönder" butonuna basmanız yeterli.`);
        }
      }, i * 800); // Her pencereyi 0.8s arayla aç (tarayıcı popup engelini aş)
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">İletişim & Mesajlaşma</h2>
        <p className="mt-1 text-sm text-gray-500">Müşterilerinize WhatsApp üzerinden tek tıkla mesaj gönderin — sunucu gerekmez.</p>
      </div>

      {/* Nasıl çalışır banner */}
      <div className="bg-gradient-to-r from-[#25D366]/10 to-green-50 border border-[#25D366]/30 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">Nasıl çalışır?</p>
          <p className="text-xs text-gray-600 mt-1">
            "Gönder" butonuna basınca her müşteri için WhatsApp penceresi açılır, mesaj hazır yazılı gelir.
            Siz sadece WhatsApp'taki <strong>Gönder</strong> butonuna basarsınız. Uygulama veya sunucu gerekmez! 🚀
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sol: Şablon seçici */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MessageCircle className="h-5 w-5 text-[#25D366]" /> Mesaj Şablonu</h3>
          <div className="space-y-2">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-2 ${selectedTemplate === t.id ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
              >
                <span className="text-lg">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {selectedTemplate === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınızı yazın</label>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#25D366] focus:border-[#25D366] resize-none"
                placeholder="Merhaba {isim}, ..."
              />
            </div>
          )}

          {/* İstatistik */}
          {sentCount > 0 && (
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-sm font-semibold text-green-700">✅ Bu oturumda {sentCount} mesaj açıldı</p>
            </div>
          )}
        </div>

        {/* Orta: Alıcı grubu */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Users className="h-5 w-5 text-[#1B4332]" /> Alıcı Grubu</h3>

          {[
            { key: 'all', label: 'Tüm Müşteriler', icon: '👥', count: groups.all.length },
            { key: 'appointment_tomorrow', label: 'Yarın Randevusu Olanlar', icon: '📅', count: groups.appointment_tomorrow.length },
            { key: 'vaccine_due', label: 'Aşısı Gecikmiş Olanlar', icon: '💉', count: groups.vaccine_due.length },
            { key: 'treatment', label: 'Tedavide Olanlar', icon: '🩺', count: groups.treatment.length },
          ].map(g => (
            <button
              key={g.key}
              onClick={() => setSelectedGroup(g.key as any)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${selectedGroup === g.key ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-lg">{g.icon}</span> {g.label}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${selectedGroup === g.key ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-gray-600'}`}>
                {g.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sağ: Önizleme & Gönder */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-5 space-y-4 flex flex-col">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Phone className="h-5 w-5 text-[#25D366]" /> Önizleme & Gönder</h3>

          {/* WhatsApp önizleme */}
          <div className="flex-1 bg-[#e5ddd5] dark:bg-[#0b141a] rounded-xl p-3 min-h-[180px] border border-transparent dark:border-slate-700">
            <div className="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%] text-sm">
              <p className="font-semibold text-[#1B4332] dark:text-[#00a884] mb-1 text-xs">Klinik</p>
              <p className="text-gray-800 dark:text-[#e9edef] whitespace-pre-wrap text-xs leading-relaxed">
                {selectedTemplate === 'custom'
                  ? (customText || '(Mesajınızı yazın...)')
                  : template.text(recipients[0]?.name || 'Tarçın', recipients[0]?.owner || 'Ahmet Bey')}
              </p>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block text-right">şimdi ✓✓</span>
            </div>
          </div>

          {/* Alıcı listesi */}
          <div className="max-h-36 overflow-y-auto space-y-1">
            {recipients.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Bu grupta telefon numarası kayıtlı kimse yok</p>
            ) : recipients.map(p => (
              <div key={p.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-700">{p.owner} <span className="text-gray-400">({p.name})</span></span>
                <button
                  onClick={() => openWhatsApp(p.phone ?? '', buildMessage(p))}
                  className="text-xs text-[#25D366] hover:text-[#20bd5a] font-semibold"
                >
                  💬 Gönder
                </button>
              </div>
            ))}
          </div>

          {/* Toplu gönder butonu */}
          <button
            onClick={sendToAll}
            disabled={recipients.length === 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:bg-[#20bd5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#25D366]/30"
          >
            <Send className="h-4 w-4" />
            {recipients.length > 0
              ? `${recipients.length} Kişiye WhatsApp Gönder`
              : 'Uygun müşteri yok'}
          </button>
          <p className="text-xs text-gray-400 text-center">Her pencerede WhatsApp'taki "Gönder" butonuna basın</p>
        </div>
      </div>

      {/* Bireysel hızlı mesaj */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">⚡ Hızlı Bireysel Mesaj</h3>
          <span className="text-xs text-gray-400">{patients.filter(p => p.phone).length} müşteride telefon kayıtlı</span>
        </div>
        <div className="divide-y divide-gray-50">
          {patients.map(p => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
              <div>
                <span className="text-sm font-semibold text-gray-800">{p.owner}</span>
                <span className="text-xs text-gray-500 ml-2">({p.name} · {p.species})</span>
                {!p.phone && <span className="text-xs text-red-400 ml-2">📵 Telefon yok</span>}
              </div>
              <div className="flex items-center gap-2">
                {p.phone ? (
                  <>
                    <button onClick={() => openWhatsApp(p.phone ?? '', `Merhaba ${p.owner} Hanım/Bey,\n${p.name} ile ilgili bilgilendirme yapmak istiyoruz. 🐾`)} className="text-xs px-3 py-1.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] font-medium">💬 Mesaj</button>
                    <button onClick={() => openWhatsApp(p.phone ?? '', `Merhaba ${p.owner} Hanım/Bey,\n${p.name} için randevunuzu hatırlatmak istedik. 📅`)} className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium">📅 Hatırlat</button>
                    <button onClick={() => openWhatsApp(p.phone ?? '', `Merhaba ${p.owner} Hanım/Bey,\n${p.name} adlı dostunuzun aşı zamanı geldi! 💉`)} className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium">💉 Aşı</button>
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">Hasta kartından telefon ekleyin</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
