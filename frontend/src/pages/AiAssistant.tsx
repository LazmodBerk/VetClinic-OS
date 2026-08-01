import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

export function AiAssistant() {
  const { patients, appointments, vaccines, inventoryItems, transactions, settings } = useAppContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      text: 'Merhaba! Ben CanVet AI Asistan. Size klinik yönetimi, stok takibi, hasta analizleri veya herhangi bir konuda nasıl yardımcı olabilirim?\n\nÖrnek sorular:\n- Bugünün kritik görevleri neler?\n- Son 1 ayın gelir analizi nasıl?\n- En çok tüketilen ilaçlar hangileri?'
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

  const handleSend = async (e: React.FormEvent) => {
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

    if (settings.geminiApiKey) {
      // Use Gemini API
      try {
        const promptContext = `
        Sen CanVet Veteriner Kliniği (Dr. Buğra Can Sefer) asistanısın. 
        Klinikteki sistem verileri:
        - Hastalar: ${patients.length} adet
        - Bugünki Randevular: ${appointments.filter(a => a.date === 'Bugün').length} adet
        - Kritik Stoklar: ${inventoryItems.filter(i => i.status === 'Kritik').map(i => i.name).join(', ')}
        - Bekleyen Aşılar: ${vaccines.filter(v => v.status === 'Bekliyor').length} adet
        
        Kullanıcının sorusuna profesyonel, samimi ve Türkçe cevap ver.
        Kullanıcının sorusu: ${input}
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptContext }]
            }]
          })
        });

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || 'API Hatası');
        }

        const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Cevap alınamadı.';
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'ai',
          text: aiResponseText
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'ai',
          text: `Gemini API bağlantısında bir hata oluştu. Lütfen API anahtarınızı (Ayarlar sayfasından) kontrol edin. Hata Detayı: ${error}`
        }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Fallback: Enhanced Rule-Based System
      setTimeout(() => {
        let aiText = '';
        const lowerInput = input.toLowerCase();

        const responses = {
          asi: [
            `Aşı ve stok verilerinizi analiz ettim:\n\n- **Bekleyen Aşılar:** Toplam ${vaccines.filter(v => v.status === 'Bekliyor').length} adet planlanmış aşı randevunuz var.\n- Müşterilere hatırlatma mesajlarını göndermeyi unutmayın!`,
            `Şu anda ${vaccines.filter(v => v.status === 'Bekliyor').length} hastanın aşısı beklemede. Düzenli aşı takibi kliniğin sağlığı için çok önemlidir.`
          ],
          stok: [
            `**Kritik Stoklar:** Sistemde şu an ${inventoryItems.filter(i => i.status === 'Kritik').length} adet ürün bitmek üzere.\nLütfen eksikleri tedarikçinize hemen bildirin!`,
            `Stok durumunu taradım. ${inventoryItems.filter(i => i.status === 'Kritik').map(i => i.name).join(', ')} ürünlerinde azalma mevcut.`
          ],
          hasta: [
            `Kliniğinizde kayıtlı ${patients.length} hasta bulunuyor. Her şey yolunda görünüyor, iyi çalışmalar!`,
            `Hasta ve randevu durumunuz aktif şekilde işleniyor. Toplam ${patients.length} kayıtlı pet dostumuz var.`
          ]
        };

        if (lowerInput.includes('aşı')) {
          aiText = responses.asi[Math.floor(Math.random() * responses.asi.length)];
        } else if (lowerInput.includes('stok')) {
          aiText = responses.stok[Math.floor(Math.random() * responses.stok.length)];
        } else if (lowerInput.includes('hasta') || lowerInput.includes('randevu')) {
          aiText = responses.hasta[Math.floor(Math.random() * responses.hasta.length)];
        } else {
          const defaultResponses = [
            `Bunu tam olarak anlayamadım ama sistemin genel durumu şu an stabil. Size nasıl daha spesifik yardımcı olabilirim?`,
            `Sisteminizde her şey tıkır tıkır işliyor. Lütfen stok veya hasta raporu gibi kelimeler kullanarak bana sorun.`,
            `Şu anki analizime göre tüm modüller sorunsuz çalışmakta.`
          ];
          aiText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'ai',
          text: aiText
        }]);
        setIsTyping(false);
      }, 1000);
    }
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
            <h2 className="text-xl font-bold text-white tracking-tight">CanVet AI Asistan</h2>
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
          CanVet AI Asistan size fikir verebilir ancak tıbbi veya bağlayıcı finansal tavsiye niteliği taşımaz.
        </p>
      </div>
    </div>
  );
}
