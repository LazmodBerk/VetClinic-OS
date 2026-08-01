import React from 'react';
import { Phone, Calendar, Heart, Shield, Stethoscope, Clock, ArrowRight, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D3748] font-sans selection:bg-[#95D5B2] selection:text-[#1B4332]">
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 overflow-hidden rounded-none">
            <Logo className="h-10 w-10" />
          </div>
          <span className="text-xl font-serif font-bold text-[#1B4332]">CanVet</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#hizmetler" className="hover:text-[#1B4332] transition-colors">Hizmetlerimiz</a>
          <a href="#hekimler" className="hover:text-[#1B4332] transition-colors">Hekimlerimiz</a>
          <a href="#iletisim" className="hover:text-[#1B4332] transition-colors">İletişim</a>
          <button onClick={() => navigate('/')} className="font-semibold text-white bg-[#1B4332] hover:bg-[#122c21] px-4 py-2 rounded-lg transition-all ml-2 flex items-center gap-2">
            Klinik Paneline Dön <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => navigate('/portal')} className="font-semibold text-[#1B4332] border-b-2 border-[#95D5B2] hover:border-[#1B4332] pb-1 transition-all">
            Hasta Portalı Girişi
          </button>
        </div>
        
        {/* Mobile Back Button */}
        <div className="md:hidden">
          <button onClick={() => navigate('/')} className="flex items-center justify-center p-2 rounded-full bg-[#1B4332] text-white shadow-md active:bg-[#122c21] transition-colors" aria-label="Klinik Paneline Dön">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-[1.1] text-[#1B4332] mb-6">
              Onlar konuşamaz,<br/>
              <span className="text-[#E07A5F]">biz ne dediklerini anlıyoruz.</span>
            </h1>
            <p className="text-lg text-[#718096] mb-10 max-w-xl leading-relaxed">
              Dostunuzun sağlığı sadece rakamlardan ibaret değildir. Korkularını yatıştıran, ona ismiyle hitap eden ve en zor anlarında bile sizin kadar şefkatli yaklaşan bir ekip.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#1B4332] text-white px-8 py-4 rounded-none font-medium hover:bg-[#122c21] transition-colors flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" /> Randevu Alın
              </button>
              <button className="bg-white text-[#2D3748] border border-gray-200 px-8 py-4 rounded-none font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group">
                Kliniğimizi Keşfedin <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Signature Element: Clinical Note */}
            <div className="absolute -left-8 top-12 z-20 bg-white p-3 shadow-lg border border-gray-100 rotate-[-4deg] max-w-[200px]">
              <div className="border-b border-gray-100 pb-1 mb-2">
                <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Klinik Notu</span>
              </div>
              <p className="font-mono text-sm text-[#1B4332] leading-tight">"Kalp ritmi düzenli.<br/>Tüyler parlak."</p>
              <div className="mt-2 text-[10px] text-gray-400 font-mono text-right">Dr. Ayşe T.</div>
            </div>

            <div className="aspect-[4/5] lg:aspect-square relative overflow-hidden bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1599443015574-be5fe8c0bf04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Veteriner hekim muayenesi" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-[#1B4332]/10 mix-blend-multiply"></div>
            </div>
            
            {/* Soft Sage Accent Block */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#95D5B2] -z-10"></div>
          </div>
        </div>
      </section>

      {/* Trust & Stats (No generic 01/02/03 steps, just honest facts) */}
      <section className="bg-[#1B4332] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#95D5B2]/20">
          <div className="px-4">
            <p className="text-4xl font-serif mb-2 text-[#95D5B2]">12+</p>
            <p className="text-sm text-gray-300 font-medium">Yıllık Güven</p>
          </div>
          <div className="px-4 pl-8">
            <p className="text-4xl font-serif mb-2 text-[#95D5B2]">7/24</p>
            <p className="text-sm text-gray-300 font-medium">Nöbetçi Hekim</p>
          </div>
          <div className="px-4 pl-8">
            <p className="text-4xl font-serif mb-2 text-[#95D5B2]">Modern</p>
            <p className="text-sm text-gray-300 font-medium">Laboratuvar</p>
          </div>
          <div className="px-4 pl-8">
            <p className="text-4xl font-serif mb-2 text-[#95D5B2]">%99</p>
            <p className="text-sm text-gray-300 font-medium">Mutlu Hasta Sahibi</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="hizmetler" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-4xl text-[#1B4332] mb-4">Her Yaşam Evresi İçin Doğru Dokunuş</h2>
            <p className="text-[#718096] text-lg">Yavruluktan yaşlılığa, dostunuzun hayat kalitesini korumak için buradayız. Hastalıkları büyümeden durdurmayı hedefleriz.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-y-12 gap-x-8">
            <div className="group border-t-2 border-gray-100 pt-6 hover:border-[#95D5B2] transition-colors">
              <Shield className="h-8 w-8 text-[#1B4332] mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Koruyucu Hekimlik</h3>
              <p className="text-gray-600 leading-relaxed text-sm">Düzenli aşı takvimi ve periyodik kan testleriyle, potansiyel sorunları daha ortaya çıkmadan engelliyoruz.</p>
            </div>
            
            <div className="group border-t-2 border-gray-100 pt-6 hover:border-[#95D5B2] transition-colors">
              <Stethoscope className="h-8 w-8 text-[#1B4332] mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">İleri Teşhis & Laboratuvar</h3>
              <p className="text-gray-600 leading-relaxed text-sm">Kliniğimizdeki tam donanımlı cihazlarla, kan sayımından ultrasona kadar dakikalar içinde kesin sonuç alıyoruz.</p>
            </div>
            
            <div className="group border-t-2 border-gray-100 pt-6 hover:border-[#95D5B2] transition-colors">
              <Heart className="h-8 w-8 text-[#1B4332] mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cerrahi & Anestezi</h3>
              <p className="text-gray-600 leading-relaxed text-sm">En güvenli gaz anestezi cihazlarıyla, minimum ağrı ve hızlı uyanma prensibiyle cerrahi müdahaleleri gerçekleştiriyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Action Shots */}
      <section id="hekimler" className="py-24 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl text-[#1B4332] mb-4">Sadece Hekim Değil, Birer Hayvan Severiz</h2>
              <p className="text-[#718096]">Kliniğimize giren her can, bizim ailemizin bir parçası olur. Beyaz önlük korkusunu kırmak için onlarla yerlerde yuvarlanmaktan çekinmeyiz.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dr. Ayşe" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute bottom-0 left-0 bg-white p-6 max-w-[85%] border-t-4 border-[#1B4332]">
                <h4 className="font-serif text-xl font-bold text-[#1B4332]">Uzm. Vet. Hekim Ayşe Yılmaz</h4>
                <p className="text-sm text-gray-500 mt-1">Dahiliye ve Görüntüleme Uzmanı</p>
              </div>
            </div>
            <div className="relative group mt-12 md:mt-0">
              <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1596853220000-84dc24856b3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dr. Can" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute bottom-0 left-0 bg-white p-6 max-w-[85%] border-t-4 border-[#95D5B2]">
                <h4 className="font-serif text-xl font-bold text-[#1B4332]">Vet. Hekim Can Demir</h4>
                <p className="text-sm text-gray-500 mt-1">Cerrahi ve Ortopedi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="h-8 w-8 text-[#E07A5F] mx-auto mb-8" />
          <h2 className="font-serif text-2xl md:text-3xl text-[#1B4332] leading-relaxed mb-8">
            "Gece yarısı Tarçın'ın nefes darlığı başladığında yaşadığımız panik, kliniğe adım attığımız an son buldu. Soğukkanlılıkları, bilgi birikimleri ve Tarçın'a gösterdikleri şefkat için ne kadar teşekkür etsek az."
          </h2>
          <p className="font-medium text-gray-900">Burak & Gizem K.</p>
          <p className="text-sm text-gray-500">Tarçın'ın Ailesi (Golden Retriever)</p>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer id="iletisim" className="bg-[#1B4332] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 mb-16 border-b border-[#95D5B2]/20 pb-16">
          <div>
            <h2 className="font-serif text-4xl mb-6">Size Nasıl Yardımcı Olabiliriz?</h2>
            <p className="text-gray-300 mb-8 max-w-md">Rutin bir kontrol, aşı takvimi planlaması veya acil bir durum... Biz her zaman buradayız.</p>
            <div className="space-y-4 text-gray-300">
              <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-[#95D5B2]"/> 0 (212) 555 01 23</p>
              <p className="flex items-center gap-3"><Clock className="h-5 w-5 text-[#95D5B2]"/> 7/24 Açık Nöbetçi Klinik</p>
              <p className="flex items-start gap-3 mt-4"><CheckCircle2 className="h-5 w-5 text-[#95D5B2] shrink-0 mt-1"/> Örnek Mah. Çınar Cad. No:45<br/>Kadıköy, İstanbul</p>
            </div>
          </div>
          
          <div className="bg-white p-8 text-[#2D3748]">
            <h3 className="font-serif text-2xl font-bold mb-6 text-[#1B4332]">Hızlı Randevu Talebi</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Randevu talebiniz alındı."); }}>
              <div>
                <label className="block text-sm font-medium mb-1">Adınız Soyadınız</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#1B4332] transition-colors bg-transparent" placeholder="Örn: Ahmet Yılmaz" required/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon Numaranız</label>
                <input type="tel" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#1B4332] transition-colors bg-transparent" placeholder="0 (5XX) XXX XX XX" required/>
              </div>
              <button type="submit" className="w-full bg-[#1B4332] text-white py-4 mt-6 hover:bg-[#122c21] transition-colors font-medium">
                Talebi Gönder
              </button>
            </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 CanVet Klinik. Tüm hakları saklıdır.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors border-l border-gray-700 pl-6 ml-2">Klinik Paneline (Dashboard) Dön</button>
          </div>
        </div>
      </footer>

      {/* Signature Element 2: Fixed Emergency / Triage Tag */}
      <a href="tel:+902125550123" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#E07A5F] text-white py-3 px-5 shadow-2xl hover:bg-[#c96c53] transition-all transform hover:-translate-y-1 group">
        <AlertCircle className="h-5 w-5 animate-pulse" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-90">Acil Durum Hattı</span>
          <span className="font-serif font-bold group-hover:underline">Hemen Ara</span>
        </div>
      </a>
      
    </div>
  );
}
