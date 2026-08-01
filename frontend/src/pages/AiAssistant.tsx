import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

export function AiAssistant() {
  const { patients, appointments, vaccines, inventoryItems, transactions } = useAppContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      text: 'Merhaba! Ben BulutVet AI Asistan. Size klinik yönetimi, stok takibi, hasta analizleri veya herhangi bir konuda nasıl yardımcı olabilirim?\n\nÖrnek sorular:\n- Bugünün kritik görevleri neler?\n- Son 1 ayın gelir analizi nasıl?\n- En çok tüketilen ilaçlar hangileri?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and generating a bulleted list response
    setTimeout(() => {
      let aiText = '';
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('aşı') || lowerInput.includes('stok')) {
        const criticalCount = inventoryItems.filter(i => i.status === 'Kritik').length;
        const upcomingVaccines = vaccines.filter(v => v.status === 'Bekliyor' || v.status === 'Planlandı').length;
        aiText = `Aşı ve stok verilerinizi analiz ettim:\n\n- **Kritik Stoklar:** Sistemde şu an ${criticalCount} adet kritik seviyede ürün bulunuyor.\n- **Bekleyen Aşılar:** Toplam ${upcomingVaccines} adet planlanmış/bekleyen aşı randevunuz var.\n- **Aksiyon Önerisi:** Kritik ürünlerin siparişini en kısa sürede vermeniz operasyonel aksaklıkları önleyecektir.`;
      } else if (lowerInput.includes('randevu') || lowerInput.includes('hasta')) {
        const todayCount = appointments.filter(a => a.date === 'Bugün').length;
        const totalPatients = patients.length;
        aiText = `Hasta ve randevu yoğunluğunu inceledim:\n\n- **Kayıtlı Hastalar:** Sisteminizde toplam ${totalPatients} hasta bulunuyor.\n- **Bugünkü Randevular:** Bugün için ${todayCount > 0 ? todayCount + ' randevunuz var.' : 'henüz randevunuz görünmüyor.'}\n- **Genel Durum:** Hasta yönetim süreciniz stabil ilerliyor.`;
      } else if (lowerInput.includes('gelir') || lowerInput.includes('ciro') || lowerInput.includes('muhasebe') || lowerInput.includes('finans')) {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => {
          const val = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        aiText = `Finansal metriklerinize dair analizim şu şekildedir:\n\n- **Toplam Gelir:** Kaydedilen güncel gelir toplamınız ₺${totalIncome.toLocaleString('tr-TR')} seviyesinde.\n- **Genel Durum:** Gelir-gider akışınız sistem üzerinden aktif şekilde izleniyor.`;
      } else {
        aiText = `Sorunuzla ilgili yaptığım genel analiz sonucunda şu bilgileri derledim:\n\n- **Öncelikli Tespit:** İlgili konuda klinik verileriniz stabil görünmektedir.\n- **Sistem Durumu:** Tüm süreçler (hasta kayıt, stok ve finans) normal seyrinde ilerliyor.\n\nDaha detaylı bir analiz isterseniz bana (aşı, stok, hasta, randevu, gelir gibi kelimeler kullanarak) spesifik bir soru sorabilirsiniz!`;
      }

      const aiResponse: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: aiText
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#122c21] p-4 sm:px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">BulutVet AI Asistan</h2>
            <p className="text-blue-100 text-xs sm:text-sm">Yapay Zeka Destekli Klinik Danışmanınız</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className="flex-shrink-0">
                {msg.role === 'user' ? (
                  <div className="h-10 w-10 rounded-full bg-[#1B4332] flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#95D5B2]/20 border border-[#95D5B2]/40 flex items-center justify-center shadow-sm">
                    <Bot className="h-6 w-6 text-[#1B4332]" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div 
                className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#1B4332] text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                  {msg.text}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] gap-3 flex-row">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-[#95D5B2]/20 border border-[#95D5B2]/40 flex items-center justify-center shadow-sm">
                  <Bot className="h-6 w-6 text-[#1B4332]" />
                </div>
              </div>
              <div className="p-4 rounded-2xl shadow-sm bg-white border border-gray-100 rounded-tl-sm flex items-center gap-2 text-gray-500 text-sm font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-[#1B4332]" />
                Analiz ediliyor...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Veteriner kliniğinizle ilgili sormak istediğiniz her şeyi yazın..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] transition-shadow outline-none shadow-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-[#1B4332] hover:bg-[#122c21] text-white p-3 rounded-xl transition-all shadow-md shadow-[#1B4332]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="text-center text-[11px] text-gray-400 mt-2">
          BulutVet AI Asistan size fikir verebilir ancak tıbbi veya bağlayıcı finansal tavsiye niteliği taşımaz.
        </p>
      </div>
    </div>
  );
}
