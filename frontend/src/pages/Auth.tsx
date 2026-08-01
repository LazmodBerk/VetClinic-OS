import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'sonner';
import { Stethoscope, Lock, Mail, ChevronLeft, ChevronRight, Quote, User } from 'lucide-react';

const testimonials = [
  {
    text: "CanVet sayesinde klini�imizdeki karma�aya son verdik. Hasta takibi ve a�� hat�rlatmalar� inan�lmaz kolayla�t�. Her hekimin kullanmas� gereken bir yaz�l�m.",
    author: "Dr. Ay�e Y�lmaz",
    clinic: "Mutlu Patiler Veteriner Klini�i"
  },
  {
    text: "Hem aray�z� �ok modern hem de her yerden ula�abiliyor olmam�z harika. M��terilerimize otomatik giden hat�rlatma SMS'leri sayesinde a�� fire oran�m�z %80 d��t�.",
    author: "Dr. Mehmet Kaya",
    clinic: "CanDostum Hayvan Hastanesi"
  },
  {
    text: "Tele-sa�l�k mod�l� ile hastalar�m�za uzaktan destek verebilmek i� y�k�m�z� inan�lmaz azaltt�. CanVet'e ge�tikten sonra verimlili�imiz iki kat artt�.",
    author: "Dr. Selin Demir",
    clinic: "Sevgi Veteriner Klini�i"
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
        toast.success('Giri� ba�ar�l�! Klini�inize y�nlendiriliyorsunuz...');
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
        toast.success('Kay�t ba�ar�l�! L�tfen giri� yap�n (E-posta do�rulama gerekebilir).');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Bir hata olu�tu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-center" richColors />
      
      {/* Sol Taraf: Giri� Formu */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white z-10 shadow-2xl">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-[#1B4332] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              CanVet<span className="text-[#1B4332]">.</span>
            </h2>
          </div>
          
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {isLogin ? 'Klini�inize giri� yap�n' : 'Yeni klinik hesab� olu�turun'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Hesab�n�z yok mu?' : 'Zaten hesab�n�z var m�?'}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-[#1B4332] hover:text-[#2a5a45] ml-1 transition-colors">
              {isLogin ? '�cretsiz Kay�t Olun' : 'Buradan Giri� Yap�n'}
            </button>
          </p>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleAuth}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700">İsim Soyisim</label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="focus:ring-[#1B4332] focus:border-[#1B4332] block w-full pl-11 sm:text-sm border-gray-300 rounded-xl py-3.5 border bg-gray-50 focus:bg-white transition-colors"
                      placeholder="Dr. Ad Soyad"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700">E-Posta Adresi</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-[#1B4332] focus:border-[#1B4332] block w-full pl-11 sm:text-sm border-gray-300 rounded-xl py-3.5 border bg-gray-50 focus:bg-white transition-colors"
                    placeholder="ornek@klinik.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">�ifre</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-[#1B4332] focus:border-[#1B4332] block w-full pl-11 sm:text-sm border-gray-300 rounded-xl py-3.5 border bg-gray-50 focus:bg-white transition-colors"
                    placeholder="��������"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#1B4332] hover:bg-[#122c21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4332] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? '��leniyor...' : (isLogin ? 'Giri� Yap' : 'Klinik Hesab� Olu�tur')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sa� Taraf: Resim ve Yorumlar */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-[url('/happy_pets_garden.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="max-w-2xl">
            <Quote className="h-12 w-12 text-[#95D5B2] opacity-80 mb-6 transform -scale-x-100" />
            
            <div className="min-h-[160px] transition-all duration-500 ease-in-out">
              <p className="text-2xl font-medium leading-relaxed mb-6 text-gray-100 shadow-black drop-shadow-md">
                {testimonials[currentTestimonial].text}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{testimonials[currentTestimonial].author}</p>
                  <p className="text-sm font-medium text-[#95D5B2]">{testimonials[currentTestimonial].clinic}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={prevTestimonial} className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/20">
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button onClick={nextTestimonial} className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/20">
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentTestimonial === idx ? 'w-8 bg-[#95D5B2]' : 'w-2 bg-white/40'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
