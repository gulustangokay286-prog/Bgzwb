"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, limit, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function RegisterPage() {
  const [role, setRole] = useState('student');
  
  // Ortak Alanlar
  const [name, setName] = useState('');
  const [tcKimlik, setTcKimlik] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Öğrenci Alanları
  const [schoolNumber, setSchoolNumber] = useState('');
  const [classId, setClassId] = useState('9');
  
  // Öğretmen Alanları
  const [branch, setBranch] = useState('Matematik');
  const [phone, setPhone] = useState('');
  
  // Veli Alanları
  const [childName, setChildName] = useState('');
  const [childSchoolNumber, setChildSchoolNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const availableClasses = ["9", "10", "11", "12"];
  const availableBranches = [
    "Matematik", "Fizik", "Kimya", "Biyoloji",
    "Türkçe", "Edebiyat", "Tarih", "Coğrafya",
    "İngilizce", "Beden Eğitimi"
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Doğrulamalar (Swift ViewModel ile 1:1 aynı)
    if (!name.trim()) {
      setError('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (tcKimlik.trim().length !== 11) {
      setError('TC Kimlik No tam 11 haneli olmalıdır.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (password.length < 6) {
      setError('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (role === 'student' && !schoolNumber.trim()) {
      setError('Lütfen okul numaranızı giriniz.');
      return;
    }
    if (role === 'teacher' && !phone.trim()) {
      setError('Lütfen telefon numaranızı giriniz.');
      return;
    }
    if (role === 'parent' && (!childName.trim() || !childSchoolNumber.trim())) {
      setError('Lütfen çocuğunuzun bilgilerini eksiksiz giriniz.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. TC Kimlik mükerrer kontrolü
      const existingUserSnap = await getDocs(
        query(collection(db, 'users'), where('tc_kimlik', '==', tcKimlik.trim()), limit(1))
      );
      if (!existingUserSnap.empty) {
        setError('Bu TC Kimlik numarasıyla zaten kayıt olunmuş.');
        setLoading(false);
        return;
      }

      // 2. Öğrenci okul no mükerrer kontrolü
      if (role === 'student' && schoolNumber.trim()) {
        const existingStudentSnap = await getDocs(
          query(collection(db, 'users'), where('school_number', '==', schoolNumber.trim()), limit(1))
        );
        if (!existingStudentSnap.empty) {
          setError('Bu okul numarası zaten sisteme kayıtlı.');
          setLoading(false);
          return;
        }
      }

      // 3. Firebase Auth Kullanıcı Oluşturma
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const userId = userCredential.user.uid;

      // 4. Firestore Veri Paketi (Swift ile birebir uyumlu)
      const userData = {
        id: userId,
        email: email.trim().toLowerCase(),
        tc_kimlik: tcKimlik.trim(),
        full_name: name.trim(),
        role: role,
        status: 'pending',
        created_at: serverTimestamp()
      };

      if (role === 'student') {
        userData.school_number = schoolNumber.trim();
        userData.class_id = classId;
      } else if (role === 'teacher') {
        userData.branch = branch;
        userData.phone = phone.trim();
      } else if (role === 'parent') {
        userData.child_name = childName.trim();
        userData.child_school_number = childSchoolNumber.trim();
        if (phone.trim()) userData.phone = phone.trim();
      }

      await setDoc(doc(db, 'users', userId), userData);

      // 5. Otomatik açık kalan oturumu kapat
      try {
        await signOut(auth);
      } catch (err) {
        console.log("Signout error:", err);
      }

      setSuccess('Kayıt başvurunuz başarıyla alınmıştır. İlgili yönetici onayının ardından hesabınız aktif edilecektir.');
      
      // Temizle
      setName('');
      setTcKimlik('');
      setEmail('');
      setPassword('');
      setSchoolNumber('');
      setPhone('');
      setChildName('');
      setChildSchoolNumber('');

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
            <h1 className="register-page-title">Yeni Kullanıcı Kayıt Formu</h1>
            <p className="register-page-desc">
              Öğrenci, veli veya öğretmen portalına erişim sağlamak için lütfen bilgilerinizi eksiksiz doldurunuz.
            </p>
          </div>

          <div className="register-card-container">
            <div className="register-form-box">
              {success ? (
                <div className="register-success-state">
                  <div className="success-icon-badge">✓</div>
                  <h2>Kayıt Başvurunuz Alındı</h2>
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

                  {/* Rol Seçimi */}
                  <div className="form-group-role">
                    <label className="form-label">Kayıt Türü Seçin</label>
                    <div className="role-tabs-row">
                      <button
                        type="button"
                        onClick={() => { setRole('student'); setError(''); }}
                        className={`role-tab-item ${role === 'student' ? 'active' : ''}`}
                      >
                        🎓 Öğrenci
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRole('teacher'); setError(''); }}
                        className={`role-tab-item ${role === 'teacher' ? 'active' : ''}`}
                      >
                        👨‍🏫 Öğretmen
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRole('parent'); setError(''); }}
                        className={`role-tab-item ${role === 'parent' ? 'active' : ''}`}
                      >
                        👨‍👩‍👧 Veli
                      </button>
                    </div>
                  </div>

                  {/* Ortak Alanlar */}
                  <div className="form-row-2col">
                    <div className="form-field">
                      <label className="form-label" htmlFor="reg-fullname">
                        Ad Soyad <span className="required-star">*</span>
                      </label>
                      <input
                        id="reg-fullname"
                        type="text"
                        placeholder="Adınız ve Soyadınız"
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
                        placeholder="11 Haneli T.C. Kimlik Numaranız"
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
                        placeholder="ornek@eposta.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label" htmlFor="reg-password">
                        Şifre Belirleyin <span className="required-star">*</span>
                      </label>
                      <input
                        id="reg-password"
                        type="password"
                        placeholder="En az 6 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Role Göre Değişen Dinamik Alanlar */}
                  {role === 'student' && (
                    <div className="form-row-2col role-specific-row">
                      <div className="form-field">
                        <label className="form-label" htmlFor="reg-school-no">
                          Okul Numarası <span className="required-star">*</span>
                        </label>
                        <input
                          id="reg-school-no"
                          type="text"
                          placeholder="Örn: 2025001"
                          value={schoolNumber}
                          onChange={(e) => setSchoolNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="reg-class">
                          Sınıf Düzeyi <span className="required-star">*</span>
                        </label>
                        <select
                          id="reg-class"
                          className="form-select"
                          value={classId}
                          onChange={(e) => setClassId(e.target.value)}
                        >
                          {availableClasses.map((c) => (
                            <option key={c} value={c}>{c}. Sınıf</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {role === 'teacher' && (
                    <div className="form-row-2col role-specific-row">
                      <div className="form-field">
                        <label className="form-label" htmlFor="reg-branch">
                          Branş <span className="required-star">*</span>
                        </label>
                        <select
                          id="reg-branch"
                          className="form-select"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                        >
                          {availableBranches.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="reg-phone">
                          Telefon Numarası <span className="required-star">*</span>
                        </label>
                        <input
                          id="reg-phone"
                          type="tel"
                          placeholder="05XX XXX XX XX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {role === 'parent' && (
                    <>
                      <div className="form-row-2col role-specific-row">
                        <div className="form-field">
                          <label className="form-label" htmlFor="reg-child-name">
                            Çocuğun Adı Soyadı <span className="required-star">*</span>
                          </label>
                          <input
                            id="reg-child-name"
                            type="text"
                            placeholder="Öğrencinin adı ve soyadı"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-field">
                          <label className="form-label" htmlFor="reg-child-no">
                            Çocuğun Okul Numarası <span className="required-star">*</span>
                          </label>
                          <input
                            id="reg-child-no"
                            type="text"
                            placeholder="Öğrencinizin okul numarası"
                            value={childSchoolNumber}
                            onChange={(e) => setChildSchoolNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="reg-parent-phone">
                          Veli Telefon Numarası
                        </label>
                        <input
                          id="reg-parent-phone"
                          type="tel"
                          placeholder="05XX XXX XX XX (İsteğe Bağlı)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                        />
                      </div>
                    </>
                  )}

                  <div className="register-info-notice">
                    <p>
                      <strong>Kurumsal Güvenlik:</strong> Kayıt başvurunuz tamamlandıktan sonra kurum idaresi tarafından incelenecek ve onaylandığında erişim yetkiniz açılacaktır.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-blue register-submit-btn"
                  >
                    {loading ? 'Kaydınız İşleniyor...' : 'Kayıt Başvurusunu Tamamla →'}
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
          padding: 50px 0 80px 0;
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
        .form-field input, .form-select {
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
        .form-field input:focus, .form-select:focus {
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
          padding: 5px;
          border-radius: 8px;
        }
        .role-tab-item {
          padding: 11px 8px;
          border: none;
          background: transparent;
          font-size: 0.92rem;
          font-weight: 700;
          color: #6c757d;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .role-tab-item.active {
          background: #103A69;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(16, 58, 105, 0.25);
        }
        .register-info-notice {
          background: #e8f0fe;
          border-left: 4px solid #103A69;
          padding: 14px 16px;
          border-radius: 4px;
          margin: 10px 0 24px 0;
        }
        .register-info-notice p {
          font-size: 0.86rem;
          color: #1c528f;
          line-height: 1.45;
          margin: 0;
        }
        .register-submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
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
          font-weight: 600;
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
          width: 64px;
          height: 64px;
          background: #e6f4ea;
          color: #137333;
          font-size: 30px;
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
