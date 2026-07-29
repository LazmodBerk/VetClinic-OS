import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

export function AiAssistant() {
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
        aiText = `Aşı ve stok verilerinizi analiz ettim:\n\n- **Kuduz Aşısı:** Stok tüketim hızı %40 arttı, önümüzdeki 4 gün içinde kritik seviyeye inebilir.\n- **Karma Aşı:** 80 doz mevcut, gelecek ay tahmini ihtiyaç 110 doz.\n- **Aksiyon Önerisi:** Hafta sonuna kadar yeni aşı siparişi vermeniz operasyonel aksaklıkları önleyecektir.`;
      } else if (lowerInput.includes('randevu') || lowerInput.includes('hasta')) {
        aiText = `Hasta ve randevu yoğunluğunu inceledim:\n\n- **Bugünkü Randevular:** Toplam 8 randevunuz var, öğleden sonra (14:00 - 16:00 arası) yoğunluk zirvede.\n- **Hasta Sadakati:** Son 6 aydır ziyarete gelmeyen 42 kayıtlı hasta tespit ettim.\n- **Aksiyon Önerisi:** Gelmeyen hastalarınız için otomatik 'Özledik' SMS kampanyası başlatabiliriz.`;
      } else if (lowerInput.includes('gelir') || lowerInput.includes('ciro') || lowerInput.includes('muhasebe') || lowerInput.includes('finans')) {
        aiText = `Finansal metriklerinize dair analizim şu şekildedir:\n\n- **Aylık Gelir:** Bu ayki toplam ciro ₺142,500 seviyesinde, geçen aya göre %12 büyüme var.\n- **Net Kâr:** Giderler düşüldüğünde ₺94,300 kâr marjına ulaşıldı.\n- **Gelecek Tahmini:** Aynı ivme devam ederse, gelecek ay gelirinizin ₺155,000 barajını aşmasını öngörüyorum.`;
      } else {
        aiText = `Sorunuzla ilgili yaptığım genel analiz sonucunda şu bilgileri derledim:\n\n- **Öncelikli Tespit:** İlgili konuda klinik verileriniz stabil görünmektedir.\n- **Sistem Durumu:** Tüm süreçler (hasta kayıt, stok ve finans) normal seyrinde ilerliyor.\n- **Not:** BulutVet AI, henüz test aşamasında (Demo) olduğu için bazı özel sorulara kalıplaşmış yanıtlar verebilir. Ancak gerçek sisteme geçildiğinde OpenAI/Gemini gibi motorlara bağlanarak gerçek zamanlı cevaplar üretecektir.\n\nDaha detaylı bir analiz isterseniz Raporlar sayfasını inceleyebilir veya bana (aşı, randevu, gelir gibi kelimeler kullanarak) yeni bir soru sorabilirsiniz!`;
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
