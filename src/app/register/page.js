"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

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
      setError('T.C. Kimlik numarası tam 11 haneli olmalıdır.');
      return;
    }
    if (password.length < 6) {
      setError('Şifreniz en az 6 karakter olmalıdır.');
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
        email: email.trim().toLowerCase(),
        full_name: name.trim(),
        tc_kimlik: tcKimlik.trim(),
        role: role,
        phone: phone.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
        profile_image: '',
      });

      setSuccess('Kayıt başvurunuz başarıyla alındı! Yönetici onayından sonra hesabınız aktif edilecektir.');
      setName('');
      setTcKimlik('');
      setPhone('');
      setEmail('');
      setPassword('');

    } catch (err) {
      console.error("Kayıt hatası:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi ile kayıtlı bir hesap zaten var.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Lütfen geçerli bir e-posta adresi girin.');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalıdır.');
      } else {
        setError('Kayıt oluşturulurken bir hata oluştu: ' + (err.message || 'Lütfen tekrar deneyin.'));
      }
    }
    setLoading(false);
  };

  return (
    <div className="bgz-reg-wrapper">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .bgz-reg-wrapper {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          background: linear-gradient(135deg, #091428 0%, #0d233a 50%, #103A69 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .bgz-reg-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0) 70%);
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .bgz-reg-card {
          width: 100%;
          max-width: 460px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.4);
          overflow: hidden;
          position: relative;
          z-index: 10;
          animation: bgzFadeIn 0.4s ease-out;
        }
        @keyframes bgzFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bgz-reg-header {
          background: linear-gradient(135deg, #103A69 0%, #1c528f 100%);
          padding: 32px 24px;
          text-align: center;
          color: #ffffff;
          position: relative;
        }
        .bgz-reg-logo-badge {
          width: 68px;
          height: 68px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .bgz-reg-logo-badge svg {
          width: 34px;
          height: 34px;
          stroke: #ffffff;
        }
        .bgz-reg-title {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #ffffff;
          margin-bottom: 4px;
          font-family: 'Outfit', sans-serif;
        }
        .bgz-reg-subtitle {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }
        .bgz-reg-body {
          padding: 28px 24px 32px 24px;
        }
        .bgz-role-switch {
          display: flex;
          background: #f1f5f9;
          padding: 5px;
          border-radius: 16px;
          margin-bottom: 20px;
          gap: 4px;
        }
        .bgz-role-btn {
          flex: 1;
          padding: 10px 0;
          border: none;
          background: transparent;
          font-size: 13.5px;
          font-weight: 700;
          color: #64748b;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .bgz-role-btn.active-student {
          background: #ffffff;
          color: #1e40af;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.12);
        }
        .bgz-role-btn.active-parent {
          background: #ffffff;
          color: #047857;
          box-shadow: 0 4px 12px rgba(4, 120, 87, 0.12);
        }
        .bgz-role-btn.active-teacher {
          background: #ffffff;
          color: #b45309;
          box-shadow: 0 4px 12px rgba(180, 83, 9, 0.12);
        }
        .bgz-input-group {
          position: relative;
          margin-bottom: 14px;
        }
        .bgz-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          transition: color 0.2s ease;
        }
        .bgz-input-group:focus-within .bgz-input-icon {
          color: #2563eb;
        }
        .bgz-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14.5px;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }
        .bgz-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
        .bgz-input:focus {
          background: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        .bgz-submit-btn {
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          background: linear-gradient(135deg, #103A69 0%, #2563eb 100%);
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
          transition: all 0.25s ease;
        }
        .bgz-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(37, 99, 235, 0.45);
        }
        .bgz-submit-btn:active {
          transform: translateY(0);
        }
        .bgz-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }
        .bgz-error-box {
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bgz-success-card {
          text-align: center;
          padding: 24px 10px;
        }
        .bgz-success-icon {
          width: 72px;
          height: 72px;
          background: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          border: 4px solid #bbf7d0;
        }
        .bgz-success-title {
          font-size: 20px;
          font-weight: 800;
          color: #166534;
          margin-bottom: 8px;
        }
        .bgz-success-text {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .bgz-back-btn {
          display: inline-block;
          padding: 12px 28px;
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          font-size: 14px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .bgz-back-btn:hover {
          background: #e2e8f0;
        }
        .bgz-reg-footer {
          background: #f8fafc;
          padding: 16px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
        }
        .bgz-reg-footer p {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .bgz-home-link {
          display: block;
          margin-top: 16px;
          text-align: center;
          font-size: 13.5px;
          color: #64748b;
          font-weight: 600;
          text-decoration: none;
        }
        .bgz-home-link:hover {
          color: #103A69;
        }
      `}</style>

      <div className="bgz-reg-glow"></div>

      <div className="bgz-reg-card">
        {/* Header */}
        <div className="bgz-reg-header">
          <div className="bgz-reg-logo-badge">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h1 className="bgz-reg-title">Boğaziçi Koleji</h1>
          <p className="bgz-reg-subtitle">Yeni Kullanıcı Kayıt Formu</p>
        </div>

        {/* Body */}
        <div className="bgz-reg-body">
          {success ? (
            <div className="bgz-success-card">
              <div className="bgz-success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="bgz-success-title">Başvurunuz Alındı!</h2>
              <p className="bgz-success-text">{success}</p>
              <a href="/" className="bgz-back-btn">Ana Sayfaya Dön</a>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              
              {error && (
                <div className="bgz-error-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Role Picker */}
              <div className="bgz-role-switch">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`bgz-role-btn ${role === 'student' ? 'active-student' : ''}`}
                >
                  Öğrenci
                </button>
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`bgz-role-btn ${role === 'parent' ? 'active-parent' : ''}`}
                >
                  Veli
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`bgz-role-btn ${role === 'teacher' ? 'active-teacher' : ''}`}
                >
                  Öğretmen
                </button>
              </div>

              {/* Inputs */}
              <div className="bgz-input-group">
                <div className="bgz-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input
                  type="text"
                  className="bgz-input"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="bgz-input-group">
                <div className="bgz-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                    <line x1="7" y1="8" x2="17" y2="8"></line>
                    <line x1="7" y1="12" x2="13" y2="12"></line>
                    <line x1="7" y1="16" x2="10" y2="16"></line>
                  </svg>
                </div>
                <input
                  type="text"
                  maxLength={11}
                  inputMode="numeric"
                  className="bgz-input"
                  placeholder="T.C. Kimlik Numarası (11 Hane)"
                  value={tcKimlik}
                  onChange={(e) => setTcKimlik(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>

              <div className="bgz-input-group">
                <div className="bgz-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <input
                  type="tel"
                  className="bgz-input"
                  placeholder="Telefon Numarası (İsteğe Bağlı)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="bgz-input-group">
                <div className="bgz-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input
                  type="email"
                  className="bgz-input"
                  placeholder="E-posta Adresi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="bgz-input-group">
                <div className="bgz-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  className="bgz-input"
                  placeholder="Şifre Oluşturun (En az 6 karakter)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bgz-submit-btn"
              >
                {loading ? (
                  <span>Kayıt Yapılıyor...</span>
                ) : (
                  <>
                    <span>Kayıt Başvurusunu Gönder</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>

              <a href="/" className="bgz-home-link">← Ana Sayfaya Dön</a>

            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bgz-reg-footer">
          <p>🔒 Kayıt talebiniz Admin paneline iletilip onaylandıktan sonra aktif olacaktır.</p>
        </div>
      </div>
    </div>
  );
}
