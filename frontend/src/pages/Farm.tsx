import React, { useState } from 'react';
import { Tractor, Plus, Search, Filter, Activity, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

export function Farm() {
  const { farmAnimals, addFarmAnimal } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [tagNo, setTagNo] = useState('');
  const [type, setType] = useState('İnek');
  const [breed, setBreed] = useState('');
  const [status, setStatus] = useState('Sağlıklı');
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNo) {
      toast.error('Küpe no zorunludur.');
      return;
    }
    
    addFarmAnimal({
      tagNo,
      type,
      breed: breed || 'Bilinmiyor',
      status,
      nextCheckup: 'Belirlenmedi',
      inseminationDate: '-'
    });
    
    toast.success('Büyükbaş hayvan başarıyla eklendi!');
    setIsModalOpen(false);
    setTagNo(''); setType('İnek'); setBreed(''); setStatus('Sağlıklı');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Çiftlik Yönetimi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Büyükbaş/Küçükbaş sürü yönetimi, suni tohumlama ve gebelik takibi.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button onClick={() => toast.info('Demo: Çiftlik ziyaret rotası oluşturuldu.')} className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <MapPin className="h-4 w-4 text-[#1B4332]" />
            Rota Planla
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
            <Plus className="h-4 w-4" />
            Hayvan Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#1B4332] to-[#122c21] rounded-2xl p-6 shadow-xl shadow-[#1B4332]/20 text-white relative overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" onClick={() => toast.success('Demo: Sürü analiz raporu hazırlanıyor')}>
          <div className="absolute right-0 top-0 opacity-10">
            <Tractor className="h-48 w-48 -mr-8 -mt-8" />
          </div>
          <h3 className="text-xl font-bold mb-1 relative z-10 text-[#95D5B2]">Aktif Çiftlikler: 4</h3>
          <p className="text-gray-300 mb-6 relative z-10 text-sm">Toplam takip edilen büyükbaş sayısı: 142</p>
          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-[#95D5B2]/20">
              <p className="text-xs font-medium text-[#95D5B2] uppercase tracking-wider mb-1">Gebe</p>
              <p className="text-2xl font-bold">28</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-[#95D5B2]/20">
              <p className="text-xs font-medium text-[#95D5B2] uppercase tracking-wider mb-1">Tohumlanacak</p>
              <p className="text-2xl font-bold">14</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-[#95D5B2]/20">
              <p className="text-xs font-medium text-[#95D5B2] uppercase tracking-wider mb-1">Tedavide</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 flex flex-col justify-center transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#1B4332]" /> Yaklaşan Kontroller
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Yılmaz Çiftliği (3 İnek)</p>
                  <p className="text-xs text-gray-500">Gebelik Kontrolü</p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#1B4332]">Bugün 14:00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Demir Besicilik (1 Dana)</p>
                  <p className="text-xs text-gray-500">Aşı Uygulaması</p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#1B4332]">Yarın 09:30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-gray-900">Sürü Listesi</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Küpe No Ara..." className="w-full border rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Küpe No / Tür</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Irk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sonraki Kontrol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tohumlama Tarihi</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {farmAnimals.filter(a => a.tagNo.toLowerCase().includes(search.toLowerCase())).map((animal) => (
                <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm">
                        🐄
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-bold text-gray-900">{animal.tagNo}</div>
                        <div className="text-xs text-gray-500">{animal.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {animal.breed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                      animal.status === 'Gebe' ? 'bg-green-100 text-green-800' :
                      animal.status.includes('Tedavi') ? 'bg-red-100 text-red-800' :
                      animal.status === 'Sağlıklı' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {animal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {animal.nextCheckup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {animal.inseminationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => toast.success('Demo: Muayene formu açıldı.')} className="text-[#1B4332] hover:text-[#122c21] font-semibold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors mr-2">
                      Muayene Gir
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
        title="Yeni Büyükbaş/Küçükbaş Kaydı"
        description="Sürüye yeni bir hayvan küpesi tanımlayın."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Küpe No *</label>
              <input required value={tagNo} onChange={e => setTagNo(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: TR-42-0005" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tür *</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>İnek</option>
                <option>Düve</option>
                <option>Dana</option>
                <option>Buzağı</option>
                <option>Koyun/Keçi</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Irk</label>
              <input value={breed} onChange={e => setBreed(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]" placeholder="Örn: Holstein" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Genel Durum</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]">
                <option>Sağlıklı</option>
                <option>Tohumlama Bekliyor</option>
                <option>Gebe</option>
                <option>Tedavide</option>
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
