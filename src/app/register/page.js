"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
      setError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }
    if (tcKimlik.length !== 11) {
      setError('T.C. Kimlik numarası 11 haneli olmalıdır.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
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

      setSuccess('Kayıt başvurunuz başarıyla alınmıştır. İlgili yönetici onayının ardından hesabınız aktif edilecektir.');
      setName('');
      setTcKimlik('');
      setPhone('');
      setEmail('');
      setPassword('');

    } catch (err) {
      console.error("Kayıt hatası:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi ile kayıtlı bir hesap zaten bulunmaktadır.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Lütfen geçerli bir e-posta adresi giriniz.');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifreniz en az 6 karakter uzunluğunda olmalıdır.');
      } else {
        setError('Kayıt oluşturulurken bir hata meydana geldi: ' + (err.message || 'Lütfen tekrar deneyiniz.'));
      }
    }
    setLoading(false);
  };

  return (
    <div className="register-page-wrapper">
      <Header />

      <main className="register-main-content">
        <div className="container">
          <div className="register-header-block">
            <span className="register-top-tag">BOĞAZİÇİ EĞİTİM KURUMLARI</span>
            <h1 className="register-page-title">Kullanıcı Kayıt Başvurusu</h1>
            <p className="register-page-desc">
              Öğrenci, veli veya öğretmen portalına erişim sağlamak için lütfen aşağıdaki formu eksiksiz doldurunuz.
            </p>
          </div>

          <div className="register-card-container">
            <div className="register-form-box">
              {success ? (
                <div className="register-success-state">
                  <div className="success-icon-badge">✓</div>
                  <h2>Başvurunuz Alındı</h2>
                  <p>{success}</p>
                  <a href="/" className="btn btn-blue" style={{ marginTop: '20px' }}>
                    Ana Sayfaya Dön
                  </a>
                </div>
              ) : (
                <form onSubmit={handleRegister}>
                  {error && (
                    <div className="register-error-banner">
                      <span>⚠️</span>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="form-group-role">
                    <label className="form-label">Kullanıcı Türü</label>
                    <div className="role-tabs-row">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`role-tab-item ${role === 'student' ? 'active' : ''}`}
                      >
                        Öğrenci
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('parent')}
                        className={`role-tab-item ${role === 'parent' ? 'active' : ''}`}
                      >
                        Veli
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`role-tab-item ${role === 'teacher' ? 'active' : ''}`}
                      >
                        Öğretmen
                      </button>
                    </div>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-field">
                      <label className="form-label" htmlFor="reg-fullname">
                        Ad Soyad <span className="required-star">*</span>
                      </label>
                      <input
                        id="reg-fullname"
                        type="text"
                        placeholder="Örn: Ahmet Yılmaz"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label" htmlFor="reg-tc">
                        T.C. Kimlik No <span className="required-star">*</span>
                      </label>
                      <input
                        id="reg-tc"
                        type="text"
                        maxLength={11}
                        inputMode="numeric"
                        placeholder="11 Haneli T.C. No"
                        value={tcKimlik}
                        onChange={(e) => setTcKimlik(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-field">
                      <label className="form-label" htmlFor="reg-email">
                        E-posta Adresi <span className="required-star">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="ornek@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label" htmlFor="reg-phone">
                        Telefon Numarası
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        placeholder="0 (5XX) XXX XX XX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="reg-password">
                      Şifre Belirleyin <span className="required-star">*</span>
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      placeholder="En az 6 karakterli güvenli şifre"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="register-info-notice">
                    <p>
                      <strong>Bilgi:</strong> Kaydınız tamamlandıktan sonra kurum idaresi tarafından onaylanacak ve profiliniz eşleştirilecektir.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-blue register-submit-btn"
                  >
                    {loading ? 'İşleminiz Yapılıyor...' : 'Kayıt Başvurusunu Gönder →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .register-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
        }
        .register-main-content {
          flex: 1;
          padding: 60px 0 80px 0;
        }
        .register-header-block {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 36px auto;
        }
        .register-top-tag {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #E6332A;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .register-page-title {
          font-size: 2.2rem;
          color: #0a1e3d;
          font-weight: 700;
          margin-bottom: 12px;
          font-family: var(--font-heading), 'Outfit', sans-serif;
        }
        .register-page-desc {
          color: #6c757d;
          font-size: 1rem;
          line-height: 1.5;
        }
        .register-card-container {
          max-width: 680px;
          margin: 0 auto;
        }
        .register-form-box {
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .form-label {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: #343a40;
          margin-bottom: 6px;
        }
        .required-star {
          color: #E6332A;
          margin-left: 2px;
        }
        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 16px;
        }
        .form-field {
          margin-bottom: 16px;
        }
        .form-field input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          font-size: 0.95rem;
          background: #f8f9fa;
          color: #212529;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .form-field input:focus {
          border-color: #103A69;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(16, 58, 105, 0.1);
        }
        .form-group-role {
          margin-bottom: 24px;
        }
        .role-tabs-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          background: #f1f3f5;
          padding: 4px;
          border-radius: 8px;
        }
        .role-tab-item {
          padding: 10px;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 600;
          color: #6c757d;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .role-tab-item.active {
          background: #103A69;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(16, 58, 105, 0.2);
        }
        .register-info-notice {
          background: #e8f0fe;
          border-left: 4px solid #103A69;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 24px;
        }
        .register-info-notice p {
          font-size: 0.85rem;
          color: #1c528f;
          line-height: 1.4;
          margin: 0;
        }
        .register-submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          justify-content: center;
        }
        .register-error-banner {
          background: #fce8e7;
          border-left: 4px solid #E6332A;
          color: #c41e17;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .register-success-state {
          text-align: center;
          padding: 20px 0;
        }
        .success-icon-badge {
          width: 60px;
          height: 60px;
          background: #e6f4ea;
          color: #137333;
          font-size: 28px;
          font-weight: bold;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .register-success-state h2 {
          font-size: 1.6rem;
          color: #0a1e3d;
          margin-bottom: 8px;
        }
        .register-success-state p {
          color: #495057;
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 480px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .register-main-content {
            padding: 30px 0 50px 0;
          }
          .register-form-box {
            padding: 24px 16px;
          }
          .form-row-2col {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .register-page-title {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </div>
  );
}
