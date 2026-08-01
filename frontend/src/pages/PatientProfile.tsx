import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Edit, Calendar, Syringe, FileText, Clock, AlertTriangle, Phone, Mail, MapPin, Paperclip, Upload, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, appointments, vaccines, updatePatient } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'appointments' | 'vaccines' | 'notes' | 'documents'>('appointments');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  const patient = patients.find(p => String(p.id) === String(id));
  const [editFormData, setEditFormData] = useState(patient || {
    id: 0, name: '', species: '', breed: '', owner: '', phone: '', email: '', ownerGender: 'bay' as const, lastVisit: '', weight: '', status: '',
    medicalInfo: { microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' }
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
    setEditFormData({
      ...patient,
      medicalInfo: patient?.medicalInfo || { microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' }
    });
    setIsEditModalOpen(true);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;
    
    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR'),
      title: noteTitle,
      content: noteContent
    };
    
    const updatedNotes = patient.notes ? [newNote, ...patient.notes] : [newNote];
    updatePatient({ ...patient, notes: updatedNotes });
    
    toast.success('Yeni not eklendi.');
    setIsNoteModalOpen(false);
    setNoteTitle('');
    setNoteContent('');
  };

  // Document Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error('Dosya boyutu 500 KB limitini aşıyor. Lütfen daha küçük bir dosya seçin.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        date: new Date().toLocaleDateString('tr-TR'),
        dataUrl
      };

      const currentMedicalInfo = patient.medicalInfo || { microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' };
      const currentDocs = (currentMedicalInfo as any).documents || [];

      updatePatient({
        ...patient,
        medicalInfo: {
          ...currentMedicalInfo,
          documents: [...currentDocs, newDoc]
        }
      });
      toast.success('Belge başarıyla yüklendi.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteDocument = (docId: string) => {
    if (!confirm('Bu belgeyi silmek istediğinize emin misiniz?')) return;
    const currentMedicalInfo = patient.medicalInfo;
    if (!currentMedicalInfo) return;
    const currentDocs = (currentMedicalInfo as any).documents || [];

    updatePatient({
      ...patient,
      medicalInfo: {
        ...currentMedicalInfo,
        documents: currentDocs.filter((d: any) => d.id !== docId)
      }
    });
    toast.success('Belge silindi.');
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
                <span className="text-sm">{patient.phone || 'Belirtilmedi'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{patient.email || 'Belirtilmedi'}</span>
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
              <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">Mikroçip No</span>
                <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{patient.medicalInfo?.microchipNo || 'Belirtilmedi'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">Doğum Tarihi</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{patient.medicalInfo?.birthDate || 'Belirtilmedi'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">Cinsiyet</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{patient.medicalInfo?.gender || 'Belirtilmedi'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">Kan Grubu</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{patient.medicalInfo?.bloodType || 'Belirtilmedi'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">Alerjiler</span>
                <div className="flex gap-2 flex-wrap">
                  {patient.medicalInfo?.allergies ? (
                    patient.medicalInfo.allergies.split(',').map((allergy, i) => (
                      <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-md border border-red-100 dark:border-red-800/30">
                        {allergy.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">Alerji kaydı yok</span>
                  )}
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
              <button 
                onClick={() => setActiveTab('documents')}
                className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'documents' ? 'text-[#1B4332] border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <Paperclip className="h-4 w-4" /> Belgeler
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
                  {patient.notes && patient.notes.length > 0 ? patient.notes.map(note => (
                    <div key={note.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:shadow-gray-200/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-900">{note.title}</span>
                        <span className="text-xs text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 py-6">Kayıtlı tedavi notu bulunmamaktadır.</p>
                  )}
                  
                  <button onClick={() => setIsNoteModalOpen(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-semibold hover:border-blue-400 hover:text-[#1B4332] transition-colors flex items-center justify-center gap-2">
                    + Yeni Tedavi Notu Ekle
                  </button>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Yükleme Alanı */}
                  <div className="bg-white p-6 rounded-3xl border border-dashed border-[#95D5B2] bg-[#f2fbf6] flex flex-col items-center justify-center text-center transition-colors hover:border-[#1B4332]">
                    <div className="h-12 w-12 rounded-full bg-[#1B4332]/10 flex items-center justify-center text-[#1B4332] mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Belge veya Fotoğraf Yükle</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-4 max-w-sm">
                      Laboratuvar sonuçları, röntgenler veya reçeteleri yükleyebilirsiniz (Maks. 500 KB, sadece resim ve PDF).
                    </p>
                    <label className="cursor-pointer bg-[#1B4332] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#122c21] transition-colors shadow-sm">
                      Dosya Seç
                      <input 
                        type="file" 
                        accept="image/*,application/pdf"
                        className="hidden" 
                        onChange={handleFileUpload} 
                      />
                    </label>
                  </div>

                  {/* Yüklenen Belgeler */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Kayıtlı Belgeler</h4>
                    {(!patient.medicalInfo || !(patient.medicalInfo as any).documents || (patient.medicalInfo as any).documents.length === 0) ? (
                      <p className="text-sm text-gray-500 italic py-4">Henüz yüklenmiş belge bulunmamaktadır.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(patient.medicalInfo as any).documents.map((doc: any) => (
                          <div key={doc.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm group hover:border-[#95D5B2] transition-colors">
                            <div className="bg-gray-50 p-3 rounded-lg text-gray-500 flex-shrink-0 group-hover:bg-[#95D5B2]/20 group-hover:text-[#1B4332] transition-colors">
                              <FileText className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate" title={doc.name}>{doc.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">{doc.date}</span>
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{(doc.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <a href={doc.dataUrl} download={doc.name} className="p-1.5 text-gray-400 hover:text-[#1B4332] hover:bg-green-50 rounded-lg transition-colors" title="İndir / Görüntüle">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <button onClick={() => handleDeleteDocument(doc.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input 
                  type="tel" 
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input 
                  type="email" 
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
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

            <h4 className="font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-100">Tıbbi Bilgiler</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mikroçip No</label>
                <input 
                  type="text" 
                  value={editFormData.medicalInfo?.microchipNo || ''}
                  onChange={(e) => setEditFormData({...editFormData, medicalInfo: Object.assign({ microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' }, editFormData.medicalInfo, { microchipNo: e.target.value })})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                <input 
                  type="text" 
                  placeholder="Örn: 12.04.2023"
                  value={editFormData.medicalInfo?.birthDate || ''}
                  onChange={(e) => setEditFormData({...editFormData, medicalInfo: Object.assign({ microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' }, editFormData.medicalInfo, { birthDate: e.target.value })})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet & Kısırlaştırma</label>
                <input 
                  type="text" 
                  placeholder="Örn: Erkek (Kısırlaştırılmış)"
                  value={editFormData.medicalInfo?.gender || ''}
                  onChange={(e) => setEditFormData({...editFormData, medicalInfo: Object.assign({ microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' }, editFormData.medicalInfo, { gender: e.target.value })})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kan Grubu</label>
                <input 
                  type="text" 
                  value={editFormData.medicalInfo?.bloodType || ''}
                  onChange={(e) => setEditFormData({...editFormData, medicalInfo: Object.assign({ microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' }, editFormData.medicalInfo, { bloodType: e.target.value })})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alerjiler (Virgülle ayırın)</label>
                <input 
                  type="text" 
                  placeholder="Örn: Penisilin, Piliç Eti"
                  value={editFormData.medicalInfo?.allergies || ''}
                  onChange={(e) => setEditFormData({...editFormData, medicalInfo: Object.assign({ microchipNo: '', birthDate: '', gender: '', bloodType: '', allergies: '' }, editFormData.medicalInfo, { allergies: e.target.value })})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
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

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Yeni Tedavi Notu</h3>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Not Başlığı *</label>
                <input 
                  required
                  type="text" 
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Örn: Genel Muayene Bulguları"
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detaylı Not *</label>
                <textarea 
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  placeholder="Muayene notlarını buraya girin..."
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                />
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  İptal
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-[#1B4332] text-white rounded-lg hover:bg-[#122c21] transition-colors shadow-sm">
                  Notu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
