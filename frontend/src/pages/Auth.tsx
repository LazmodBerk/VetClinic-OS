import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'sonner';
import { Stethoscope, Lock, Mail, User } from 'lucide-react';

export function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

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
        const { error } = await supabase.auth.signUp({ email, password });
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-center" richColors />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-[#1B4332] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          BulutVet SaaS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Kliniğinize giriş yapın' : 'Yeni bir klinik hesabı oluşturun'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-Posta Adresi</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-[#1B4332] focus:border-[#1B4332] block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border"
                  placeholder="ornek@klinik.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Şifre</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-[#1B4332] focus:border-[#1B4332] block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#1B4332] hover:bg-[#122c21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4332] transition-colors disabled:opacity-50"
              >
                {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Klinik Hesabı Oluştur')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {isLogin ? 'Yeni Klinik Hesabı Aç' : 'Mevcut Kliniğe Giriş Yap'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
