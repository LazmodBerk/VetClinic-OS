import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Database, HelpCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';

export function Settings() {
  const { settings, updateSettings } = useAppContext();
  
  // Local state for the form so we can edit it
  const [formData, setFormData] = useState({
    clinicName: settings.clinicName,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    taxOffice: settings.taxOffice,
    taxNo: settings.taxNo
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateSettings(formData);
    toast.success('Ayarlar başarıyla kaydedildi');
  };

  const [activeTab, setActiveTab] = useState('genel');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sistem Ayarları</h2>
          <p className="mt-1 text-sm text-gray-500">
            Klinik bilgilerinizi, kullanıcı izinlerini ve sistem tercihlerini yönetin.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30"
          >
            <Save className="h-4 w-4" />
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-r border-gray-100 bg-slate-50/50 p-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveTab('genel')}
                className={`w-full text-left group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'genel' ? 'bg-white text-[#1B4332] shadow-sm border border-gray-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Globe className={`mr-3 h-4 w-4 ${activeTab === 'genel' ? '' : 'text-gray-400 group-hover:text-gray-500'}`} /> Genel Ayarlar
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('kullanicilar')}
                className={`w-full text-left group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'kullanicilar' ? 'bg-white text-[#1B4332] shadow-sm border border-gray-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <User className={`mr-3 h-4 w-4 ${activeTab === 'kullanicilar' ? '' : 'text-gray-400 group-hover:text-gray-500'}`} /> Profil ve Kullanıcılar
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('bildirim')}
                className={`w-full text-left group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'bildirim' ? 'bg-white text-[#1B4332] shadow-sm border border-gray-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Bell className={`mr-3 h-4 w-4 ${activeTab === 'bildirim' ? '' : 'text-gray-400 group-hover:text-gray-500'}`} /> Bildirim Tercihleri
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('guvenlik')}
                className={`w-full text-left group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'guvenlik' ? 'bg-white text-[#1B4332] shadow-sm border border-gray-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Lock className={`mr-3 h-4 w-4 ${activeTab === 'guvenlik' ? '' : 'text-gray-400 group-hover:text-gray-500'}`} /> Güvenlik ve İzinler
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('yedekleme')}
                className={`w-full text-left group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'yedekleme' ? 'bg-white text-[#1B4332] shadow-sm border border-gray-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Database className={`mr-3 h-4 w-4 ${activeTab === 'yedekleme' ? '' : 'text-gray-400 group-hover:text-gray-500'}`} /> Veritabanı ve Yedekleme
              </button>
            </li>
          </ul>
        </div>

        {/* Settings Form */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-2xl">
            {activeTab === 'genel' && (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-2">Klinik Profili</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">Klinik Adı</label>
                      <div className="mt-1">
                        <input 
                          type="text" 
                          name="clinicName" 
                          id="clinicName" 
                          value={formData.clinicName} 
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332] sm:text-sm py-2 px-3 border" 
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
                      <div className="mt-1">
                        <input 
                          type="text" 
                          name="phone" 
                          id="phone" 
                          value={formData.phone} 
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332] sm:text-sm py-2 px-3 border" 
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta Adresi</label>
                      <div className="mt-1">
                        <input 
                          type="email" 
                          name="email" 
                          id="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332] sm:text-sm py-2 px-3 border" 
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adres</label>
                      <div className="mt-1">
                        <textarea 
                          id="address" 
                          name="address" 
                          rows={3} 
                          value={formData.address} 
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332] sm:text-sm py-2 px-3 border resize-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab !== 'genel' && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-300 mb-4 flex items-center justify-center">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Bu Bölüm Kilitli</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Şu anda demo sürümünü kullanıyorsunuz. Yönetici yetkileri veya lisans yükseltmesi gerekmektedir.
                </p>
                <button onClick={() => setActiveTab('genel')} className="mt-6 text-sm font-semibold text-[#1B4332] hover:text-[#122c21]">
                  &larr; Genel Ayarlara Dön
                </button>
              </div>
            )}

            <h3 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-2 mt-10">Finans ve Fatura Ayarları</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="taxOffice" className="block text-sm font-medium text-gray-700">Vergi Dairesi</label>
                  <div className="mt-1">
                    <input 
                      type="text" 
                      name="taxOffice" 
                      id="taxOffice" 
                      value={formData.taxOffice} 
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332] sm:text-sm py-2 px-3 border" 
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="taxNo" className="block text-sm font-medium text-gray-700">Vergi Numarası / TCKN</label>
                  <div className="mt-1">
                    <input 
                      type="text" 
                      name="taxNo" 
                      id="taxNo" 
                      value={formData.taxNo} 
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332] sm:text-sm py-2 px-3 border" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 bg-blue-50 rounded-xl p-4 flex gap-4">
              <HelpCircle className="h-6 w-6 text-[#1B4332] flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Yardım ve Destek</h4>
                <p className="text-sm text-blue-700 mt-1">Sistem kullanımı veya teknik konularda destek almak için lütfen destek birimimiz ile iletişime geçin.</p>
                <button onClick={() => toast.success('Destek talebiniz oluşturuldu')} className="mt-3 text-sm font-semibold text-[#1B4332] hover:text-[#122c21]">
                  Destek Talebi Oluştur &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
