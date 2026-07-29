import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, Download, Printer, Settings } from 'lucide-react';
import { toast } from 'sonner';

const templates = [
  { id: 1, title: 'Genel Muayene Epikriz Raporu', category: 'Epikriz', type: 'Sistem', date: 'Güncellendi: Dün' },
  { id: 2, title: 'Operasyon Onam Formu', category: 'Form', type: 'Özelleştirilmiş', date: 'Güncellendi: 3 Gün Önce' },
  { id: 3, title: 'Kısırlaştırma Sonrası Bilgilendirme', category: 'Sözleşme/Bilgi', type: 'Özelleştirilmiş', date: 'Güncellendi: 1 Hafta Önce' },
  { id: 4, title: 'Yatarak Tedavi Formu', category: 'Form', type: 'Sistem', date: 'Güncellendi: 1 Ay Önce' },
];

export function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: '', category: 'Form' });
  const [templateList, setTemplateList] = useState(templates);

  const handleCreateTemplate = () => {
    if (!newTemplate.title.trim()) {
      toast.error('Lütfen şablon adını girin');
      return;
    }
    const createdTemplate = {
      id: Date.now(),
      title: newTemplate.title,
      category: newTemplate.category,
      type: 'Özelleştirilmiş',
      date: 'Güncellendi: Şimdi'
    };
    setTemplateList([...templateList, createdTemplate]);
    setIsModalOpen(false);
    setNewTemplate({ title: '', category: 'Form' });
    toast.success('Yeni şablon başarıyla oluşturuldu');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Raporlar ve Formlar</h2>
          <p className="mt-1 text-sm text-gray-500">
            Epikriz raporları, onam formları ve sözleşmeleri yönetin. Kendi form şablonlarınızı oluşturun.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#122c21] transition-all shadow-[#1B4332]/30">
            <Plus className="h-4 w-4" />
            Yeni Şablon Oluştur
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[600px]">
        {/* Sidebar/Categories */}
        <div className="w-full md:w-64 border-r border-gray-100 bg-slate-50/50 p-4 overflow-y-auto">
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Şablon Ara..." className="w-full border rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 pl-9 pr-3 shadow-sm" />
          </div>
          
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kategoriler</h3>
          <ul className="space-y-1">
            <li>
              <button className="w-full bg-blue-50 text-blue-700 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
                <FileText className="mr-3 h-4 w-4" /> Tüm Şablonlar
              </button>
            </li>
            <li>
              <button onClick={() => toast.info('Epikriz Raporları filtrelendi (Demo)')} className="w-full text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
                <FileText className="mr-3 h-4 w-4 text-gray-400" /> Epikriz Raporları
              </button>
            </li>
            <li>
              <button onClick={() => toast.info('Onam Formları filtrelendi (Demo)')} className="w-full text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
                <FileText className="mr-3 h-4 w-4 text-gray-400" /> Onam Formları
              </button>
            </li>
            <li>
              <button onClick={() => toast.info('Özel Formatlar filtrelendi (Demo)')} className="w-full text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
                <Settings className="mr-3 h-4 w-4 text-gray-400" /> Özel Formatlar
              </button>
            </li>
          </ul>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templateList.map(template => (
              <div key={template.id} className="border border-gray-100 rounded-3xl p-4 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group relative bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#1B4332]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.title}</h4>
                      <p className="text-xs text-gray-500">{template.category} • {template.type}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{template.date}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toast.success('Demo: Belge yazdırılıyor...')} className="p-1.5 text-gray-500 hover:text-[#1B4332] bg-gray-50 rounded-lg" title="Yazdır">
                      <Printer className="h-4 w-4" />
                    </button>
                    <button onClick={() => toast.success('Demo: Belge PDF olarak indirildi.')} className="p-1.5 text-gray-500 hover:text-green-600 bg-gray-50 rounded-lg" title="İndir">
                      <Download className="h-4 w-4" />
                    </button>
                    <button onClick={() => toast.success('Demo: Düzenleyici açılıyor...')} className="p-1.5 text-gray-500 hover:text-amber-600 bg-gray-50 rounded-lg" title="Düzenle">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Editor Placeholder for "Özelleştirilebilir Formlar" */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gelişmiş Form Tasarımcısı</h3>
            <div className="bg-slate-50/50 border border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-[#1B4332]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Sürükle-Bırak Form Oluşturucu</h4>
              <p className="text-sm text-gray-500 max-w-md mt-2">
                Tedavi sözleşmeleri veya epikriz raporları için kendi alanlarınızı (text, onay kutusu, imza alanı) ekleyerek kendi formlarınızı tasarlayabilirsiniz.
              </p>
              <button onClick={() => toast.success('Demo: Sürükle-Bırak Form Tasarımcısı arayüzü yükleniyor...')} className="mt-6 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Tasarımcıyı Aç
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Yeni Şablon Oluştur</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şablon Adı</label>
                <input 
                  type="text" 
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332]"
                  placeholder="Örn: Kuduz Aşısı Onam Formu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select 
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  className="w-full border rounded-lg border-gray-300 px-3 py-2 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] bg-white"
                >
                  <option value="Form">Form</option>
                  <option value="Epikriz">Epikriz</option>
                  <option value="Sözleşme/Bilgi">Sözleşme/Bilgi</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                İptal
              </button>
              <button 
                onClick={handleCreateTemplate}
                className="px-4 py-2 text-sm font-medium bg-[#1B4332] text-white rounded-lg hover:bg-[#122c21] transition-colors shadow-sm"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
