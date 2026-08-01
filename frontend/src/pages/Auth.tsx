import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'sonner';
import { Stethoscope, Lock, Mail, ChevronLeft, ChevronRight, Quote, User } from 'lucide-react';

const testimonials = [
  {
    text: "CanVet sayesinde kliniğimizdeki karmaşaya son verdik. Hasta takibi ve aşı hatırlatmaları inanılmaz kolaylaştı. Her hekimin kullanması gereken bir yazılım.",
    author: "Dr. Ayşe Yılmaz",
    clinic: "Mutlu Patiler Veteriner Kliniği"
  },
  {
    text: "Hem arayüzü çok modern hem de her yerden ulaşabiliyor olmamız harika. Müşterilerimize otomatik giden hatırlatma SMS'leri sayesinde aşı fire oranımız %80 düştü.",
    author: "Dr. Mehmet Kaya",
    clinic: "CanDostum Hayvan Hastanesi"
  },
  {
    text: "Tele-sağlık modülü ile hastalarımıza uzaktan destek verebilmek iş yükümüzü inanılmaz azalttı. CanVet'e geçtikten sonra verimliliğimiz iki kat arttı.",
    author: "Dr. Selin Demir",
    clinic: "Sevgi Veteriner Kliniği"
  }
];

export function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Giriş başarılı! Kliniğinize yönlendiriliyorsunuz...');
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        toast.success('Kayıt başarılı! Lütfen giriş yapın (E-posta doğrulama gerekebilir).');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[url('/happy_pets_garden.jpg')] bg-cover bg-center bg-no-repeat relative">
      <Toaster position="top-center" richColors />
      
      {/* Sol Taraf: Yorumlar ve Boşluk */}
      <div className="hidden lg:flex flex-1 flex-col justify-end p-12 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        
        <div className="max-w-2xl relative z-20">
          <Quote className="h-12 w-12 text-[#95D5B2] opacity-90 mb-6 transform -scale-x-100 drop-shadow-lg" />
          
          <div className="min-h-[160px] transition-all duration-500 ease-in-out">
            <p className="text-3xl font-semibold leading-snug mb-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              "{testimonials[currentTestimonial].text}"
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-white drop-shadow-md">{testimonials[currentTestimonial].author}</p>
                <p className="text-md font-medium text-[#95D5B2] drop-shadow-md">{testimonials[currentTestimonial].clinic}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={prevTestimonial} className="p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md transition-colors border border-white/20 text-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextTestimonial} className="p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md transition-colors border border-white/20 text-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Dots */}
          <div className="flex gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${currentTestimonial === idx ? 'w-8 bg-[#95D5B2]' : 'w-2 bg-white/50'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Glass Efektli Form */}
      <div className="w-full lg:w-[500px] xl:w-[600px] bg-white/90 backdrop-blur-2xl border-l border-white/60 shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col justify-center p-8 sm:p-12 z-20 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-14 w-14 bg-gradient-to-br from-[#1B4332] to-[#2a5a45] rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-6 transition-transform border border-white/20">
              <Stethoscope className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-black tracking-tight drop-shadow-sm">
                CanVet<span className="text-[#1B4332]">.</span>
              </h2>
              <p className="text-sm font-bold text-[#1B4332] mt-1">Modern Klinik Yönetimi</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-black">
            {isLogin ? 'Kliniğinize giriş yapın' : 'Yeni klinik hesabı oluşturun'}
          </h2>
          <p className="mt-2 text-sm text-gray-800 font-bold">
            {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
            <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#1B4332] hover:text-[#2a5a45] ml-1 transition-colors underline decoration-2 underline-offset-4">
              {isLogin ? 'Ücretsiz Kayıt Olun' : 'Buradan Giriş Yapın'}
            </button>
          </p>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleAuth}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-black text-black mb-2">İsim Soyisim</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 sm:text-sm border border-gray-300 rounded-xl bg-white focus:bg-white focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] transition-all placeholder-gray-500 font-semibold text-black shadow-sm"
                      placeholder="Dr. Ad Soyad"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-black text-black mb-2">E-Posta Adresi</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 sm:text-sm border border-gray-300 rounded-xl bg-white focus:bg-white focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] transition-all placeholder-gray-500 font-semibold text-black shadow-sm"
                    placeholder="ornek@klinik.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">Şifre</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 sm:text-sm border border-gray-300 rounded-xl bg-white focus:bg-white focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] transition-all placeholder-gray-500 font-semibold text-black shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(27,67,50,0.39)] text-sm font-bold text-white bg-[#1B4332] hover:bg-[#122c21] hover:shadow-[0_6px_20px_rgba(27,67,50,0.23)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4332] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? 'İşleniyor...' : (isLogin ? 'Güvenli Giriş Yap' : 'Klinik Hesabı Oluştur')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
