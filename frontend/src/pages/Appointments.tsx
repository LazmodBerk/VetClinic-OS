import React, { useState } from 'react';
import { Plus, Search, Calendar as CalendarIcon, Clock, MoreVertical, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

export function Appointments() {
  const { appointments, addAppointment, patients } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [patientName, setPatientName] = useState('');
  const [type, setType] = useState('Muayene');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !date || !time) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }
    
    // Attempt to find owner if patient exists
    const existingPatient = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
    const owner = existingPatient ? existingPatient.owner : 'Bilinmiyor';
    
    addAppointment({
      patient: patientName,
      owner,
      type,
      date,
      time,
      status: 'Bekliyor',
      color: 'bg-blue-100 text-blue-800'
    });
    
    toast.success('Randevu başarıyla eklendi!');
    setIsModalOpen(false);
    // Reset form
    setPatientName(''); setType('Muayene'); setDate(''); setTime('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Randevu Takvimi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Klinik randevularınızı, operasyonlarınızı ve kontrolleri yönetin.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
            <Plus className="h-4 w-4" />
            Yeni Randevu
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2">
            <button onClick={() => toast.info('Demo: Takvim görünümü (Günlük)')} className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200">Gün</button>
            <button onClick={() => toast.info('Demo: Takvim görünümü (Haftalık)')} className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg">Hafta</button>
            <button onClick={() => toast.info('Demo: Takvim görünümü (Aylık)')} className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200">Ay</button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Hasta veya Sahip Ara..." className="w-full border rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3" />
            </div>
            <button onClick={() => toast.info('Demo: Filtreler açıldı')} className="flex items-center justify-center rounded-lg bg-white px-3 py-2 text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zaman</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta / Sahip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem Tipi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {appointments.map((apt) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {apt.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${apt.color}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => toast.success('Demo: Detaylar açıldı')} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Yeni Randevu Ekle"
        description="Klinik takvimine yeni bir randevu eklemek için formu doldurun."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta Adı *</label>
              <input required value={patientName} onChange={e => setPatientName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Kayıtlı hastanın adını girin..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
              <input required value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Saat *</label>
              <input required value={time} onChange={e => setTime(e.target.value)} type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Tipi</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Muayene</option>
                <option>Aşı (Karma)</option>
                <option>Aşı (Kuduz)</option>
                <option>Kontrol</option>
                <option>Operasyon</option>
                <option>Tıraş & Bakım</option>
              </select>
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
