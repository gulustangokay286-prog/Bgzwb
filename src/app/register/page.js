"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { UserCheck, User, Phone, Hash, Lock, Mail, ArrowRight } from 'lucide-react';
import Script from 'next/script';





export const metadata = {
  title: 'Kayıt Ol | Boğaziçi Koleji',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
};

export default function RegisterPage() {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [tcKimlik, setTcKimlik] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !tcKimlik) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    if (tcKimlik.length !== 11) {
      setError('T.C. Kimlik numarası 11 haneli olmalıdır.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: email,
        full_name: name,
        tc_kimlik: tcKimlik,
        role: role,
        phone: phone,
        status: 'pending',
        createdAt: serverTimestamp(),
        profile_image: '',
      });

      // We do not sign out here because we might want them to stay logged in or redirect.
      // But usually pending means they can't do much until approved.
      setSuccess('Kayıt talebiniz başarıyla alındı! Yöneticiler onayladıktan sonra giriş yapabilirsiniz.');
      
      // Clear form
      setName('');
      setTcKimlik('');
      setPhone('');
      setEmail('');
      setPassword('');

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanılıyor.');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalıdır.');
      } else {
        setError('Kayıt sırasında bir hata oluştu: ' + err.message);
      }
    }
    setLoading(false);
  };

  return (
    <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30 shadow-inner">
              <UserCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Boğaziçi Koleji</h1>
            <p className="text-blue-100 text-sm font-medium opacity-90">Yeni Kullanıcı Kaydı</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5 border-4 border-emerald-50">
                <UserCheck size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Başvurunuz Alındı!</h3>
              <p className="text-slate-500 leading-relaxed max-w-[280px]">
                {success}
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              
              {error && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium border border-rose-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Role Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-2">
                <button 
                  type="button" 
                  onClick={() => setRole('student')} 
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Öğrenci
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('parent')} 
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'parent' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Veli
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('teacher')} 
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'teacher' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Öğretmen
                </button>
              </div>

              {/* Input Fields */}
              <div className="relative w-full group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 text-[15px] font-medium outline-none"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Ad Soyad"
                />
              </div>

              <div className="relative w-full group">
                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                <input
                  type="text"
                  maxLength={11}
                  inputMode="numeric"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 text-[15px] font-medium outline-none"
                  value={tcKimlik}
                  onChange={e => setTcKimlik(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  placeholder="T.C. Kimlik Numarası"
                />
              </div>

              <div className="relative w-full group">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                <input
                  type="tel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 text-[15px] font-medium outline-none"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Telefon Numarası (İsteğe Bağlı)"
                />
              </div>

              <div className="relative w-full group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 text-[15px] font-medium outline-none"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="E-posta Adresi"
                />
              </div>

              <div className="relative w-full group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                <input
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 text-[15px] font-medium outline-none"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Şifre Oluşturun"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">İşleminiz Yapılıyor...</span>
                ) : (
                  <>
                    <span>Kayıt Başvurusunu Gönder</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Kayıt başvurunuz incelendikten sonra hesabınız aktif edilecektir.
          </p>
        </div>

      </div>
    </div>
  );
}
