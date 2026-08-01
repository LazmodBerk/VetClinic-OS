import React, { useState } from 'react';
import { Search, Filter, Plus, Syringe, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

export function Vaccines() {
  const { vaccines, addVaccine, updateVaccine, patients } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [patientName, setPatientName] = useState('');
  const [vaccineType, setVaccineType] = useState('Karma');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !date) {
      toast.error('Lütfen zorunlu alanları doldurun.');
      return;
    }
    
    const existingPatient = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
    const owner = existingPatient ? existingPatient.owner : 'Bilinmiyor';
    
    addVaccine({
      patient: patientName,
      owner,
      vaccine: vaccineType,
      date,
      status: 'Planlandı'
    });
    
    toast.success('Aşı planlaması başarıyla eklendi!');
    setIsModalOpen(false);
    setPatientName(''); setVaccineType('Karma'); setDate('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Aşı Takvimi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Aşı planlamalarını yapın, hatırlatmaları otomatik olarak hasta sahiplerine gönderin.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
            <Plus className="h-4 w-4" />
            Yeni Aşı Kaydı
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2">
            <button onClick={() => toast.info('Demo: Filtre uygulandı')} className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> Gecikenler (1)
            </button>
            <button onClick={() => toast.info('Demo: SMS Gönderiliyor...')} className="px-3 py-1.5 text-sm font-medium bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50">
              Toplu Hatırlatma Gönder
            </button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Hasta veya Aşı Ara..." className="w-full border rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3" />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aşı Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta / Sahip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planlanan Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {vaccines.map((vaccine) => (
                <tr key={vaccine.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-bold text-gray-900">
                      <Syringe className="h-4 w-4 text-[#1B4332] mr-2" />
                      {vaccine.vaccine}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{vaccine.patient}</div>
                    <div className="text-xs text-gray-500">{vaccine.owner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {vaccine.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                      vaccine.status === 'Bekliyor' ? 'bg-amber-100 text-amber-800' :
                      vaccine.status === 'Gecikmiş' ? 'bg-red-100 text-red-800' :
                      vaccine.status === 'Uygulandı' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {vaccine.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {vaccine.status !== 'Uygulandı' && (
                      <button onClick={() => {
                        updateVaccine({ ...vaccine, status: 'Uygulandı' });
                        toast.success('Aşı uygulandı olarak işaretlendi.');
                      }} className="text-green-600 hover:text-green-900 font-semibold bg-green-50 px-3 py-1.5 rounded-lg transition-colors mr-2">
                        Uygulandı Yap
                      </button>
                    )}
                    {vaccine.status === 'Uygulandı' && (
                      <span className="text-green-600 font-semibold px-3 py-1.5">Tamamlandı</span>
                    )}
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
        title="Yeni Aşı Planla"
        description="Hasta için takvime yeni bir aşı randevusu oluşturun."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta Adı *</label>
              <input required value={patientName} onChange={e => setPatientName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Kayıtlı hastanın adını girin..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Aşı Türü *</label>
              <select value={vaccineType} onChange={e => setVaccineType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Karma</option>
                <option>Kuduz</option>
                <option>Lyme</option>
                <option>Lösemi</option>
                <option>Mantar</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
              <input required value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" />
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
