import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Edit, Calendar, Syringe, FileText, Clock, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, appointments, vaccines, updatePatient } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'appointments' | 'vaccines' | 'notes'>('appointments');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const patient = patients.find(p => p.id === Number(id));
  const [editFormData, setEditFormData] = useState(patient || {
    id: 0, name: '', species: '', breed: '', owner: '', ownerGender: 'bay' as const, lastVisit: '', weight: '', status: ''
  });

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hasta Bulunamadı</h2>
        <p className="text-gray-500 mb-6">Aradığınız hasta kaydı sistemde mevcut değil veya silinmiş olabilir.</p>
        <button onClick={() => navigate('/patients')} className="bg-[#1B4332] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#122c21] transition-colors">
          Hastalara Dön
        </button>
      </div>
    );
  }

  const handleEditSubmit = () => {
    updatePatient(editFormData);
    setIsEditModalOpen(false);
    toast.success('Hasta bilgileri güncellendi.');
  };

  const handleOpenEdit = () => {
    setEditFormData(patient);
    setIsEditModalOpen(true);
  };

  // Filter related data
  const patientAppointments = appointments.filter(a => a.patient.toLowerCase() === patient.name.toLowerCase());
  const patientVaccines = vaccines.filter(v => v.patient.toLowerCase() === patient.name.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Geri Dön
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-[#1B4332] to-[#122c21]"></div>
        <div className="px-8 pb-8 pt-0 flex flex-col sm:flex-row gap-6 items-start sm:items-end relative">
          <div className="h-28 w-28 rounded-2xl bg-white p-2 shadow-lg -mt-14 relative z-10 flex-shrink-0">
            <div className={`h-full w-full rounded-xl flex items-center justify-center text-5xl shadow-inner ${patient.species === 'Köpek' ? 'bg-orange-100 text-orange-600' : patient.species === 'Kedi' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}>
              {patient.species === 'Köpek' ? '🐕' : patient.species === 'Kedi' ? '🐈' : '🦜'}
            </div>
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${patient.status === 'Sağlıklı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {patient.status}
              </span>
            </div>
            <p className="text-gray-500 font-medium">{patient.species} • {patient.breed} • {patient.weight}</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto pb-2">
            <button onClick={handleOpenEdit} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Edit className="h-4 w-4" /> Düzenle
            </button>
            <button onClick={() => navigate('/appointments')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-colors shadow-[#1B4332]/30">
              <Calendar className="h-4 w-4" /> Randevu Ver
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Owner & Info Details */}
        <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              Sahip Bilgileri
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                <p className="text-base font-semibold text-gray-900">{patient.owner}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm">+90 (555) 123 45 67</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">sahip@email.com</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                <span className="text-sm">Örnek Mah. Test Cad. No:123 Kadıköy / İstanbul</span>
              </div>
              <button onClick={() => toast.success('Demo: SMS Gönderiliyor...')} className="w-full mt-2 py-2 bg-blue-50 text-[#1B4332] font-semibold rounded-xl text-sm hover:bg-blue-100 transition-colors">
                SMS Gönder
              </button>
            </div>
          </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              Tıbbi Bilgiler
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Mikroçip No</span>
                <span className="text-sm font-mono font-medium text-gray-900">981020002341</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Doğum Tarihi</span>
                <span className="text-sm font-medium text-gray-900">12.04.2023 (3 Yaş)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Cinsiyet</span>
                <span className="text-sm font-medium text-gray-900">Erkek (Kısırlaştırılmış)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Kan Grubu</span>
                <span className="text-sm font-medium text-gray-900">DEA 1.1 Pozitif</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-2">Alerjiler</span>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-md border border-red-100">Penisilin</span>
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-md border border-red-100">Piliç Eti</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs (Appointments, Vaccines, Notes) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'appointments' ? 'text-[#1B4332] border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <Calendar className="h-4 w-4" /> Randevular
              </button>
              <button 
                onClick={() => setActiveTab('vaccines')}
                className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'vaccines' ? 'text-[#1B4332] border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <Syringe className="h-4 w-4" /> Aşı Karnesi
              </button>
              <button 
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'notes' ? 'text-[#1B4332] border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <FileText className="h-4 w-4" /> Tedavi Notları
              </button>
            </div>

            <div className="p-6 flex-1 bg-slate-50/30">
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  {patientAppointments.length > 0 ? patientAppointments.map(apt => (
                    <div key={apt.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm transition-all hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-1">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-[#1B4332]">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{apt.type}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4 mr-1" /> {apt.date} • {apt.time}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-md ${apt.color}`}>
                        {apt.status}
                      </span>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 py-10">Kayıtlı randevu bulunamadı.</p>
                  )}
                </div>
              )}

              {activeTab === 'vaccines' && (
                <div className="space-y-4">
                  {patientVaccines.length > 0 ? patientVaccines.map(vaccine => (
                    <div key={vaccine.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-1">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      <div className="flex items-center gap-4 pl-2">
                        <div className="bg-green-50 p-3 rounded-lg text-green-600">
                          <Syringe className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{vaccine.vaccine} Aşısı</p>
                          <p className="text-sm text-gray-500 mt-1">Tarih: {vaccine.date}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-md ${
                        vaccine.status === 'Bekliyor' ? 'bg-amber-100 text-amber-800' :
                        vaccine.status === 'Gecikmiş' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {vaccine.status}
                      </span>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 py-10">Kayıtlı aşı bulunamadı.</p>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:shadow-gray-200/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900">Genel Muayene Bulguları</span>
                      <span className="text-xs text-gray-500">12 Eki 2026</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Hastanın genel durumu iyi. Kilo kontrolü sağlandı. Diş taşlarında hafif artış var, bir sonraki ziyarette temizlik önerildi.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:shadow-gray-200/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900">Alerji Şüphesi</span>
                      <span className="text-xs text-gray-500">05 Mar 2026</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Tavuklu mamaya karşı intolerans gözlemlendi. Hipoalerjenik diyet mamasına geçiş yapıldı.
                    </p>
                  </div>
                  <button onClick={() => toast.success('Demo: Yeni Not Ekleme açıldı')} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-semibold hover:border-blue-400 hover:text-[#1B4332] transition-colors flex items-center justify-center gap-2">
                    + Yeni Tedavi Notu Ekle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Hasta Bilgilerini Düzenle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta Adı</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sahibi</label>
                <input 
                  type="text" 
                  value={editFormData.owner}
                  onChange={(e) => setEditFormData({...editFormData, owner: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                <select 
                  value={editFormData.species}
                  onChange={(e) => setEditFormData({...editFormData, species: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white"
                >
                  <option value="Köpek">Köpek</option>
                  <option value="Kedi">Kedi</option>
                  <option value="Kuş">Kuş</option>
                  <option value="Egzotik">Egzotik</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Irk</label>
                <input 
                  type="text" 
                  value={editFormData.breed}
                  onChange={(e) => setEditFormData({...editFormData, breed: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilo</label>
                <input 
                  type="text" 
                  value={editFormData.weight}
                  onChange={(e) => setEditFormData({...editFormData, weight: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sağlık Durumu</label>
                <select 
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white"
                >
                  <option value="Sağlıklı">Sağlıklı</option>
                  <option value="Tedavide">Tedavide</option>
                  <option value="Kritik">Kritik</option>
                  <option value="Kontrol Bekliyor">Kontrol Bekliyor</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                İptal
              </button>
              <button 
                onClick={handleEditSubmit}
                className="px-4 py-2 text-sm font-medium bg-[#1B4332] text-white rounded-lg hover:bg-[#122c21] transition-colors shadow-sm"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
