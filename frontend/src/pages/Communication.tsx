import React from 'react';
import { Search, Send, MessageSquare, MessageCircle, Bell, History, ArrowRight, AlertTriangle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function Communication() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">İletişim ve Bildirimler</h2>
          <p className="mt-1 text-sm text-gray-500">
            SMS gönderimi, WhatsApp mesajlaşma yönetimi ve Akıllı Bildirim ayarlarınızı yapılandırın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS Module */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-[#1B4332] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Toplu SMS Yönetimi</h3>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-md">Bakiye: 4,250</span>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alıcılar</label>
              <select className="w-full rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] py-2 border px-3">
                <option>Aşısı Geciken Hastalar</option>
                <option>Bugün Randevusu Olanlar</option>
                <option>Tüm Müşteriler</option>
                <option>Özel Seçim...</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj Metni</label>
              <textarea 
                className="w-full flex-1 rounded-lg border-gray-300 text-sm focus:ring-[#1B4332] focus:border-[#1B4332] p-3 resize-none border"
                placeholder="Sayın {Müşteri Adı}, {Hasta Adı} isimli can dostunuzun aşı tarihi gelmiştir..."
              />
            </div>
            <button onClick={() => toast.success('Demo: 142 kişiye SMS başarıyla gönderildi.')} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#122c21] transition-colors">
              <Send className="h-4 w-4" />
              Gönder (142 Kişi)
            </button>
          </div>
        </div>

        {/* WhatsApp Module */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-[#25D366] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">WhatsApp Entegrasyonu</h3>
            </div>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
          <div className="flex-1 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png')] bg-repeat opacity-90 p-4 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] self-start text-sm border border-gray-100">
                <p className="font-semibold text-[#1B4332] mb-1">Mehmet Kaya</p>
                <p className="text-gray-800">Merhaba, Cesur'un yarınki kuduz aşısı randevusunu saat 14:00'e alabilir miyiz?</p>
                <span className="text-[10px] text-gray-500 mt-1 block text-right">10:42</span>
              </div>
              <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none p-3 shadow-sm max-w-[85%] self-end text-sm">
                <p className="text-gray-800">Tabii ki Mehmet Bey, randevu saatinizi 14:00 olarak güncelledim.</p>
                <span className="text-[10px] text-gray-600 mt-1 block text-right">10:45</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
            <input type="text" placeholder="Mesaj yazın..." className="flex-1 border rounded-full border-gray-300 bg-white py-2 px-4 text-sm focus:ring-[#25D366] focus:border-[#25D366]" />
            <button onClick={() => toast.success('Demo: Mesaj gönderildi.')} className="p-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Smart Notifications */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-[#1B4332] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h3 className="font-semibold">Akıllı Bildirimler</h3>
            </div>
            <button onClick={() => toast.success('Geçmiş temizlendi')}><History className="h-4 w-4 text-[#95D5B2]" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-gray-100">
              <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toast.info('Kuduz aşısı siparişi verildi (Demo)')}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Stok Uyarısı</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Kuduz aşısı stokları kritik seviyeye (5 adet) düştü. Sipariş verilmeli.</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">15 dakika önce</span>
                  </div>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toast.info('Takvime yönlendiriliyorsunuz (Demo)')}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4 text-[#1B4332]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Günlük Özet</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Bugün toplam 12 randevunuz bulunmaktadır.</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">Bu sabah 08:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <button onClick={() => toast.info('Demo: Ayarlara gidiliyor...')} className="text-sm font-medium text-[#1B4332] hover:text-indigo-700 flex items-center justify-center w-full gap-1">
              Tüm Bildirim Ayarları <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
