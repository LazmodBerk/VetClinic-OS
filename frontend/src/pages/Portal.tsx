import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, PawPrint, LogOut, CheckCircle2, Download, Syringe, Plus, Video, PhoneOff, Mic, Camera, FileText } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';

export function Portal() {
  const { patients, appointments, vaccines, addAppointment } = useAppContext();
  const navigate = useNavigate();
  
  const [loggedInOwner, setLoggedInOwner] = useState<string | null>(null);

  // Modals States
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPetProfileModalOpen, setIsPetProfileModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  
  const [isTeleHealthModalOpen, setIsTeleHealthModalOpen] = useState(false);
  const [isVaccineHistoryModalOpen, setIsVaccineHistoryModalOpen] = useState(false);
  
  // Computed Data for logged in user
  const myPets = patients.filter(p => p.owner === loggedInOwner);
  const myAppointments = appointments.filter(a => a.owner === loggedInOwner);
  const myVaccines = vaccines.filter(v => v.owner === loggedInOwner);

  const [appointmentForm, setAppointmentForm] = useState({
    patient: '',
    date: '',
    time: '',
    type: 'Muayene'
  });
  const [isSaving, setIsSaving] = useState(false);

  const uniqueOwners = Array.from(new Set(patients.map(p => p.owner))).filter(Boolean);

  if (!loggedInOwner) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 selection:bg-[#95D5B2] selection:text-[#1B4332]">
        <Toaster position="top-center" richColors />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 bg-[#1B4332] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#1B4332]/30">
              <span className="text-white font-serif font-bold text-3xl">B</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#1B4332]">CanVet Portal</h1>
            <p className="text-gray-500 mt-2 text-sm">Hayvanınızın sağlık verilerine erişmek için lütfen profilinizi seçin.</p>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {uniqueOwners.length > 0 ? (
              uniqueOwners.map((owner, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLoggedInOwner(owner);
                    toast.success(`Hoş geldiniz, ${owner}`);
                  }}
                  className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#95D5B2] hover:bg-[#95D5B2]/10 transition-all group"
                >
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">{owner}</p>
                    <p className="text-xs text-gray-500">{patients.filter(p => p.owner === owner).length} Kayıtlı Hayvan</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">Sistemde henüz kayıtlı hasta bulunmuyor.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.patient) {
      toast.error('Lütfen evcil hayvanınızı seçin.');
      return;
    }
    if (!appointmentForm.date || !appointmentForm.time) {
      toast.error('Lütfen tarih ve saat seçin.');
      return;
    }

    setIsSaving(true);
    try {
      // Portal modunda doğrudan Supabase'e yaz (user_id olmadan)
      const payload = {
        patient: appointmentForm.patient,
        owner: loggedInOwner!,
        type: appointmentForm.type,
        date: appointmentForm.date,
        time: appointmentForm.time,
        status: 'Onay Bekliyor',
        color: 'bg-amber-100 text-amber-800',
      };
      const { error } = await supabase.from('appointments').insert([payload]);
      if (error) throw new Error(error.message);
      toast.success('✅ Randevu talebiniz kliniğe iletildi! Onay bekleniyor.');
      setIsAppointmentModalOpen(false);
      setAppointmentForm({ patient: '', date: '', time: '', type: 'Muayene' });
    } catch (err: any) {
      toast.error('Hata: ' + (err.message || 'Randevu gönderilemedi, lütfen tekrar deneyin.'));
    } finally {
      setIsSaving(false);
    }
  };

  const cancelAppointment = (id: number | string) => {
    toast.success('Randevu iptal talebiniz kliniğe iletildi.');
  };

  const downloadReport = (id: number | string) => {
    toast.success('Rapor PDF olarak indiriliyor...');
    setTimeout(() => {
      toast.info('İndirme tamamlandı.');
    }, 1500);
  };

  const openPetProfile = (pet: typeof myPets[0]) => {
    setSelectedPet(pet);
    setIsPetProfileModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans selection:bg-[#95D5B2] selection:text-[#1B4332]">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#1B4332] rounded-none flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-serif font-bold text-[#1B4332]">CanVet.</span>
            <span className="ml-4 pl-4 border-l border-gray-300 text-sm font-medium text-gray-500 hidden sm:block">Hasta Portalı</span>
          </div>
          <button onClick={() => { setLoggedInOwner(null); toast.success('Başarıyla çıkış yapıldı.'); navigate('/'); }} className="flex items-center text-sm font-bold text-[#1B4332] hover:text-[#2a5a45] transition-colors border-b-2 border-transparent hover:border-[#95D5B2] pb-1">
            <LogOut className="h-4 w-4 mr-1.5" />
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Premium Hero Section */}
        <div className="bg-[#1B4332] rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-[#1B4332]/20 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#95D5B2] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E07A5F] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-2xl">
            <p className="text-[#95D5B2] font-semibold tracking-wider text-sm uppercase mb-3">Tekrar Hoş Geldiniz</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 leading-tight">Merhaba, {loggedInOwner}</h1>
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              CanVet Müşteri Portalı'ndan can dostlarınızın sağlık durumunu takip edebilir, raporlarınızı görüntüleyebilir ve hızlıca randevu alabilirsiniz.
            </p>
          </div>
          
          <div className="relative z-10 flex-shrink-0">
            <div className="h-32 w-32 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-inner">
              <PawPrint className="h-16 w-16 text-[#95D5B2] opacity-80" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon (Geniş) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Dostlarım Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <h2 className="text-xl font-serif font-bold text-[#1B4332] mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-[#95D5B2]/20 rounded-xl">
                  <PawPrint className="h-5 w-5 text-[#1B4332]" />
                </div>
                Dostlarım
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myPets.length > 0 ? myPets.map(pet => (
                  <div key={pet.id} className="group relative bg-[#F8F9FA] rounded-2xl p-5 border border-transparent hover:border-[#95D5B2]/50 hover:shadow-lg hover:shadow-[#1B4332]/5 transition-all cursor-pointer overflow-hidden" onClick={() => openPetProfile(pet)}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <PawPrint className="h-16 w-16" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-sm border border-white/50 ${pet.species === 'Köpek' ? 'bg-[#E07A5F]/10' : pet.species === 'Kedi' ? 'bg-gray-200/50' : 'bg-[#95D5B2]/20'}`}>
                        <span>{pet.species === 'Köpek' ? '🐕' : pet.species === 'Kedi' ? '🐈' : '🦜'}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">{pet.name}</h3>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{pet.species} • {pet.breed}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between relative z-10">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${pet.status === 'Sağlıklı' ? 'bg-[#95D5B2]/20 text-[#1B4332]' : 'bg-amber-100 text-amber-800'}`}>
                        {pet.status === 'Sağlıklı' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />} 
                        {pet.status}
                      </span>
                      <span className="text-xs font-bold text-[#1B4332] opacity-0 group-hover:opacity-100 transition-opacity">
                        Detay &rarr;
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 py-4 col-span-2">Kayıtlı evcil hayvanınız bulunmuyor.</p>
                )}
              </div>
            </div>

            {/* Karneler ve Raporlar */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-[#1B4332] flex items-center gap-3">
                  <div className="p-2.5 bg-[#E07A5F]/10 rounded-xl">
                    <Syringe className="h-5 w-5 text-[#E07A5F]" />
                  </div>
                  Karneler ve Raporlar
                </h2>
                <button onClick={() => setIsVaccineHistoryModalOpen(true)} className="text-sm font-bold text-[#1B4332] hover:text-[#95D5B2] transition-colors border-b border-transparent hover:border-[#95D5B2]">Tümünü Gör</button>
              </div>
              <div className="space-y-3">
                {myVaccines.length > 0 ? myVaccines.map(v => (
                  <div key={v.id} className="p-4 rounded-2xl border border-gray-100 bg-white hover:bg-[#F8F9FA] transition-colors flex justify-between items-center group shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#95D5B2]/20 p-3 rounded-xl text-[#1B4332]">
                        <Syringe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{v.patient} - {v.vaccine} Aşısı</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Tarih: {v.date} • Durum: {v.status}</p>
                      </div>
                    </div>
                    <button onClick={() => downloadReport(v.id)} className="flex items-center justify-center p-2.5 bg-gray-50 text-[#1B4332] rounded-xl hover:bg-[#1B4332] hover:text-white transition-all group-hover:scale-105 shadow-sm border border-gray-200">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 py-2">Kayıtlı aşı karnesi bulunmuyor.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Kolon (Dar) */}
          <div className="space-y-8">
            
            {/* Hızlı İşlemler */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <h3 className="text-lg font-serif font-bold text-[#1B4332] mb-6">Hızlı İşlemler</h3>
              <div className="space-y-4">
                <button onClick={() => setIsAppointmentModalOpen(true)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#1B4332] text-white hover:bg-[#122c21] transition-all group shadow-lg shadow-[#1B4332]/20 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
                      <CalendarIcon className="h-5 w-5 text-[#95D5B2]" />
                    </div>
                    <span className="font-bold tracking-wide">Online Randevu Al</span>
                  </div>
                  <Plus className="h-5 w-5 text-[#95D5B2]" />
                </button>

                <button onClick={() => setIsTeleHealthModalOpen(true)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all group shadow-md hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1B4332]/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
                      <Video className="h-5 w-5" />
                    </div>
                    <span className="font-bold tracking-wide">Tele-Sağlık (Canlı)</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Randevu Talepleri ve Yaklaşan Randevular */}
            {myAppointments.length > 0 && (() => {
              const pendingApts = myAppointments.filter(a => a.status === 'Onay Bekliyor');
              const confirmedApts = myAppointments.filter(a => a.status !== 'Onay Bekliyor' && a.status !== 'İptal');
              const nextApt = confirmedApts[0] ?? pendingApts[0];
              if (!nextApt) return null;
              const isPending = nextApt.status === 'Onay Bekliyor';
              return (
                <div className={`rounded-3xl shadow-xl p-8 text-center text-white relative overflow-hidden ${
                  isPending
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20'
                    : 'bg-gradient-to-br from-[#E07A5F] to-[#c76045] shadow-[#E07A5F]/20'
                }`}>
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="relative z-10">
                    <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-inner">
                      <CalendarIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-1">
                      {isPending ? 'Onay Bekleyen Talep' : 'Yaklaşan Randevu'}
                    </h3>
                    {isPending && (
                      <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white/30">
                        ⏳ Klinik onayı bekleniyor
                      </span>
                    )}
                    <p className="text-white/80 text-sm font-medium mb-6">{nextApt.patient} - {nextApt.type}</p>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl py-4 px-4 border border-white/20 shadow-inner mb-6">
                      <p className="text-2xl font-bold">{nextApt.date}</p>
                      <p className="text-sm font-medium text-[#1B4332] bg-[#95D5B2] inline-block px-3 py-1 rounded-full mt-2">Saat {nextApt.time}</p>
                    </div>
                    
                    <button onClick={() => cancelAppointment(nextApt.id)} className="block w-full py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-red-500 hover:border-red-500 transition-colors">
                      İptal Talebi Gönder
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </main>

      {/* Online Randevu Modal */}
      <Modal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} title="Online Randevu Al">
        <form onSubmit={handleBookAppointment} className="space-y-5 p-2">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Evcil Hayvan</label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent font-medium text-gray-700 bg-gray-50"
              value={appointmentForm.patient}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, patient: e.target.value })}
            >
              <option value="" disabled>Seçiniz</option>
              {myPets.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tarih</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-medium text-gray-700 bg-gray-50"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Saat</label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-medium text-gray-700 bg-gray-50"
                value={appointmentForm.time}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Randevu Türü</label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] font-medium text-gray-700 bg-gray-50"
              value={appointmentForm.type}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
            >
              <option value="Muayene">Genel Muayene</option>
              <option value="Aşı">Aşı</option>
              <option value="Kontrol">Kontrol</option>
              <option value="Grooming (Tıraş)">Tıraş & Bakım</option>
            </select>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAppointmentModalOpen(false)}
              className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 text-sm font-bold text-white bg-[#1B4332] rounded-xl hover:bg-[#122c21] transition-colors shadow-lg shadow-[#1B4332]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Gönderiliyor...' : 'Randevu Talebi Gönder'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Pet Profile Modal */}
      {selectedPet && (
        <Modal isOpen={isPetProfileModalOpen} onClose={() => setIsPetProfileModalOpen(false)} title={`${selectedPet.name} - Detaylı Profil`}>
          <div className="space-y-6 p-2">
            <div className="flex items-center gap-5 bg-[#F8F9FA] p-5 rounded-2xl border border-gray-100">
              <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-white/50 ${selectedPet.species === 'Köpek' ? 'bg-[#E07A5F]/10' : selectedPet.species === 'Kedi' ? 'bg-gray-200' : 'bg-[#95D5B2]/20'}`}>
                <span>{selectedPet.species === 'Köpek' ? '🐕' : selectedPet.species === 'Kedi' ? '🐈' : '🦜'}</span>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#1B4332]">{selectedPet.name}</h3>
                <p className="text-gray-500 font-medium mt-1">{selectedPet.species} • {selectedPet.breed}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-sm shadow-gray-200/50">
                <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block mb-1.5">Ağırlık</span>
                <span className="font-bold text-lg text-gray-900">{selectedPet.weight}</span>
              </div>
              <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-sm shadow-gray-200/50">
                <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block mb-1.5">Mikroçip No</span>
                <span className="font-bold text-lg text-gray-900 font-mono">981020002341</span>
              </div>
              <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-sm shadow-gray-200/50">
                <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block mb-1.5">Kan Grubu</span>
                <span className="font-bold text-lg text-gray-900">DEA 1.1</span>
              </div>
              <div className="bg-white p-4 border border-[#E07A5F]/20 rounded-2xl shadow-sm shadow-gray-200/50 bg-[#E07A5F]/5">
                <span className="text-[#E07A5F] font-semibold text-xs uppercase tracking-wider block mb-1.5">Alerjiler</span>
                <span className="font-bold text-lg text-[#E07A5F]">Penisilin</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-serif font-bold text-lg text-[#1B4332] mb-3">Beslenme & Diyet</h4>
              <p className="text-sm font-medium text-gray-700 bg-[#95D5B2]/20 p-4 rounded-2xl border border-[#95D5B2]/30 leading-relaxed">
                Hipoalerjenik kuzu etli yetişkin maması kullanılması tavsiye edilmektedir. Günlük porsiyon: 250gr.
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
              <button onClick={() => setIsPetProfileModalOpen(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Kapat
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Tele-Health Modal */}
      <Modal isOpen={isTeleHealthModalOpen} onClose={() => setIsTeleHealthModalOpen(false)} title="Veteriner Hekim ile Canlı Görüşme">
        <div className="space-y-4 p-2">
          <div className="bg-[#1B4332] rounded-3xl h-72 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="z-10 text-center">
              <div className="h-20 w-20 bg-[#95D5B2]/20 border border-[#95D5B2]/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Video className="h-8 w-8 text-[#95D5B2]" />
              </div>
              <p className="text-white font-serif font-bold text-xl">Hekim bekleniyor...</p>
              <p className="text-[#95D5B2] text-sm font-medium mt-1">Bağlantı kuruluyor</p>
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
              <button className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <Mic className="h-5 w-5" />
              </button>
              <button className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <Camera className="h-5 w-5" />
              </button>
              <button onClick={() => setIsTeleHealthModalOpen(false)} className="h-12 w-12 rounded-full bg-[#E07A5F] text-white flex items-center justify-center hover:bg-[#c76045] transition-colors shadow-lg shadow-[#E07A5F]/30">
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 text-center px-4">
            Tele-Sağlık görüşmeleri ücrete tabi olabilir. Hekiminiz bağlandığında görüşme başlayacaktır.
          </p>
        </div>
      </Modal>

      {/* Vaccine History Modal */}
      <Modal isOpen={isVaccineHistoryModalOpen} onClose={() => setIsVaccineHistoryModalOpen(false)} title="Tüm Aşı Geçmişi ve Raporlar">
        <div className="space-y-4 p-2">
          {myVaccines.length > 0 ? myVaccines.map(v => (
            <div key={v.id} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm shadow-gray-200/40 flex justify-between items-center group hover:border-[#95D5B2]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-[#F8F9FA] p-3 rounded-xl border border-gray-100">
                  <Syringe className="h-5 w-5 text-[#1B4332]" />
                </div>
                <div>
                  <p className="font-bold text-[#1B4332]">{v.patient} - {v.vaccine} Aşısı</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Tarih: {v.date} • Durum: <span className="font-bold text-[#E07A5F]">{v.status}</span></p>
                </div>
              </div>
              <button onClick={() => downloadReport(v.id)} className="p-2.5 bg-gray-50 text-[#1B4332] rounded-xl hover:bg-[#1B4332] hover:text-white transition-all shadow-sm">
                <Download className="h-4 w-4" />
              </button>
            </div>
          )) : (
            <p className="text-center text-gray-500 py-6">Kayıtlı aşı karnesi bulunmuyor.</p>
          )}

          <div className="h-px bg-gray-100 my-6"></div>
          
          <h4 className="font-serif font-bold text-lg text-[#1B4332] mb-3">Laboratuvar Sonuçları</h4>
          <div className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm shadow-gray-200/40 flex justify-between items-center group hover:border-[#E07A5F]/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-[#E07A5F]/10 p-3 rounded-xl border border-[#E07A5F]/10">
                <FileText className="h-5 w-5 text-[#E07A5F]" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Tam Kan Sayımı (Hemogram)</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">12 Ekim 2026 • Tarçın</p>
              </div>
            </div>
            <button onClick={() => downloadReport(99)} className="p-2.5 bg-gray-50 text-[#1B4332] rounded-xl hover:bg-[#1B4332] hover:text-white transition-all shadow-sm">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
