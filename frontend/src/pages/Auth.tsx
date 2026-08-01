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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/settings',
        });
        if (error) throw error;
        toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
        setIsForgotPassword(false);
      } else if (isLogin) {
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
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-900 via-[#1B4332] to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/happy_pets_garden.jpg')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay"></div>
      <Toaster position="top-center" richColors />
      
      {/* Sol Taraf: Yorumlar ve Boşluk */}
      <div className="hidden lg:flex flex-1 flex-col justify-end p-16 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        <div className="max-w-2xl relative z-20">
          <Quote className="h-14 w-14 text-[#95D5B2] opacity-100 mb-8 transform -scale-x-100 drop-shadow-2xl" />
          
          <div className="min-h-[160px] transition-all duration-700 ease-in-out">
            <p className="text-4xl font-bold leading-tight mb-8 text-white drop-shadow-md">
              "{testimonials[currentTestimonial].text}"
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white tracking-wide">{testimonials[currentTestimonial].author}</p>
                <p className="text-lg font-medium text-[#95D5B2] tracking-wide mt-1">{testimonials[currentTestimonial].clinic}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <button onClick={prevTestimonial} className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all border border-white/20 text-white shadow-xl hover:scale-105 active:scale-95">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={nextTestimonial} className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all border border-white/20 text-white shadow-xl hover:scale-105 active:scale-95">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Dots */}
          <div className="flex gap-3 mt-10">
            {testimonials.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-500 shadow-lg ${currentTestimonial === idx ? 'w-10 bg-[#95D5B2]' : 'w-2 bg-white/30'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Glass Efektli Form */}
      <div className="w-full lg:w-[550px] xl:w-[650px] bg-white/95 backdrop-blur-3xl border-l border-white/40 shadow-[-20px_0_50px_rgba(0,0,0,0.3)] flex flex-col justify-center p-8 sm:p-16 z-20 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-5 mb-12">
            <div className="h-16 w-16 bg-gradient-to-br from-[#1B4332] to-[#40916C] rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-3 transition-transform duration-300 border border-[#1B4332]/20">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
                CanVet<span className="text-[#1B4332]">.</span>
              </h2>
              <p className="text-sm font-bold text-[#40916C] mt-1 tracking-wider uppercase">Modern Klinik Yönetimi</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {isForgotPassword ? 'Şifrenizi Sıfırlayın' : (isLogin ? 'Hoş Geldiniz' : 'Hesap Oluşturun')}
          </h2>
          <p className="text-base text-slate-600 font-medium mb-10 leading-relaxed">
            {isForgotPassword 
              ? 'Kayıtlı e-posta adresinize bir sıfırlama bağlantısı göndereceğiz.' 
              : 'Güvenli ve bulut tabanlı veteriner yönetim sistemine giriş yapın.'}
          </p>

          <form className="space-y-6" onSubmit={handleAuth}>
            {!isLogin && !isForgotPassword && (
              <div className="group">
                <label className="block text-sm font-bold text-slate-900 mb-2 transition-colors group-focus-within:text-[#1B4332]">İsim Soyisim</label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#1B4332] transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 sm:text-sm border-2 border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#1B4332] transition-all placeholder-slate-400 font-semibold text-slate-900 shadow-sm hover:border-slate-300"
                    placeholder="Dr. Ad Soyad"
                  />
                </div>
              </div>
            )}
            
            <div className="group">
              <label className="block text-sm font-bold text-slate-900 mb-2 transition-colors group-focus-within:text-[#1B4332]">E-Posta Adresi</label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#1B4332] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 sm:text-sm border-2 border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#1B4332] transition-all placeholder-slate-400 font-semibold text-slate-900 shadow-sm hover:border-slate-300"
                  placeholder="ornek@klinik.com"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-900 transition-colors group-focus-within:text-[#1B4332]">Şifre</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm font-bold text-[#40916C] hover:text-[#1B4332] hover:underline transition-colors"
                    >
                      Şifremi unuttum
                    </button>
                  )}
                </div>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#1B4332] transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 sm:text-sm border-2 border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#1B4332] transition-all placeholder-slate-400 font-semibold text-slate-900 shadow-sm hover:border-slate-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(27,67,50,0.5)] text-sm font-bold text-white bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#122c21] hover:to-[#1B4332] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4332] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(27,67,50,0.6)] disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? 'İşleniyor...' : (isForgotPassword ? 'Sıfırlama Bağlantısı Gönder' : (isLogin ? 'Güvenli Giriş Yap' : 'Klinik Hesabı Oluştur'))}
              </button>
            </div>
          </form>

          {/* Toggle Button for Login/Register */}
          <div className="mt-10 pt-8 border-t-2 border-slate-100 text-center">
            {isForgotPassword ? (
              <button 
                onClick={() => setIsForgotPassword(false)} 
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Giriş Ekranına Dön
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <span className="text-base text-slate-900 font-semibold">
                  {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                </span>
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-base font-black text-[#1B4332] hover:text-[#40916C] transition-colors underline decoration-2 underline-offset-4"
                >
                  {isLogin ? 'Hemen Ücretsiz Kayıt Olun' : 'Buradan Giriş Yapın'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
