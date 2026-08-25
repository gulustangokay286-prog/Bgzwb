"use client";
import Link from 'next/link';
import './login.css';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { 
  GraduationCap, 
  Briefcase, 
  UserCheck,
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  CreditCard, 
  Hash, 
  Building2, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { auth, db } from '../../firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TCValidationAnimationModal from '../../components/TCValidationAnimationModal';

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState('roleSelect'); // 'roleSelect' | 'form'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'teacher' | 'personnel' | 'parent' | 'admin'
  
  // Inputs
  const [tcKimlik, setTcKimlik] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Dynamic fields
  const [schoolNumber, setSchoolNumber] = useState('');
  const [branch, setBranch] = useState('Matematik');
  const [department, setDepartment] = useState('İdari İşler');
  const [adminKey, setAdminKey] = useState('');

  // States
  const [showLoginScanner, setShowLoginScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(null);

  // Forgot password modal
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const availableBranches = [
    "Matematik", "Fizik", "Kimya", "Biyoloji",
    "Türkçe", "Edebiyat", "Tarih", "Coğrafya",
    "İngilizce", "Beden Eğitimi", "Rehberlik", "Bilişim"
  ];

  const availableDepartments = [
    "İdari İşler", "Muhasebe & Finans", "Öğrenci İşleri",
    "Halkla İlişkiler & Tanıtım", "Kütüphane", "Teknik Hizmetler", "Güvenlik"
  ];

  const rolesData = [
    {
      id: 'student',
      title: 'Öğrenci',
      subtitle: 'Derslerine eriş, ödevlerini takip et, gelişimini gör.',
      Icon: GraduationCap
    },
    {
      id: 'teacher',
      title: 'Öğretmen',
      subtitle: 'Sınıflarını yönet, içerik paylaş, performansları izle.',
      Icon: Briefcase
    },
    {
      id: 'personnel',
      title: 'Personel',
      subtitle: 'Kurumsal idari işlemler ve personel portalına eriş.',
      Icon: UserCheck
    },
    {
      id: 'parent',
      title: 'Veli',
      subtitle: 'Çocuğunuzun akademik sürecini yakından takip edin.',
      Icon: Users
    }
  ];

  const currentRoleInfo = rolesData.find(r => r.id === selectedRole) || rolesData[0];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError('');
    setCurrentStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSelect = () => {
    setCurrentStep('roleSelect');
    setError('');
  };

  const handlePreLogin = (e) => {
    e.preventDefault();
    if (tcKimlik.trim().length !== 11) {
      setError('TC Kimlik No 11 haneli olmalıdır.');
      return;
    }
    if (!password) {
      setError('Lütfen şifrenizi giriniz.');
      return;
    }
    if (selectedRole === 'student' && !schoolNumber.trim()) {
      setError('Lütfen okul numaranızı giriniz.');
      return;
    }
    if (selectedRole === 'admin' && !adminKey.trim()) {
      setError('Lütfen yönetici güvenlik anahtarını giriniz.');
      return;
    }

    setError('');
    setShowLoginScanner(true);
  };

  const handleValidationComplete = async (isValid) => {
    setShowLoginScanner(false);

    if (!isValid) {
      setError('TC Kimlik numarası devlet algoritmasına uymuyor. Lütfen doğru girdiğinizden emin olun.');
      return;
    }

    setLoading(true);

    try {
      const userSnap = await getDocs(
        query(collection(db, 'users'), where('tc_kimlik', '==', tcKimlik.trim()), limit(1))
      );

      if (userSnap.empty) {
        setError('Bu T.C. Kimlik numarasına ait kayıtlı kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }

      const userData = userSnap.docs[0].data();
      const userEmail = userData.email;
      const userStatus = userData.status || 'pending';
      const userName = userData.full_name || userData.name || 'Boğaziçi Kullanıcısı';

      if (userStatus === 'pending') {
        setError('Hesabınız idare onay aşamasındadır. Onaylandıktan sonra portala giriş yapabilirsiniz.');
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, userEmail, password);

      setLoginSuccess({
        name: userName,
        role: selectedRole,
        status: userStatus
      });

    } catch (err) {
      console.error("Giriş hatası:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Girdiğiniz şifre hatalıdır. Lütfen kontrol ediniz.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla hatalı deneme yapıldı. Lütfen biraz bekleyiniz.');
      } else {
        setError('Giriş yapılırken bir hata oluştu: ' + (err.message || 'Lütfen tekrar deneyiniz.'));
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      alert('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotSent(true);
    } catch (err) {
      alert('Şifre sıfırlama hatası: ' + err.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Header />

      <main className="login-main">
        <div className="login-bg-pattern"></div>

        <div className="login-container">
          
          {/* SUCCESS SCREEN */}
          {loginSuccess ? (
            <div className="login-success-card animate-fade-in">
              <div className="success-glow-bubble">
                <CheckCircle2 size={40} className="success-glow-icon" />
              </div>

              <h2 className="success-welcome-title">
                Hoş Geldiniz, <span className="red-highlight">{loginSuccess.name}</span>
              </h2>
              <p className="success-welcome-sub">
                Boğaziçi Koleji bilgi sistemine güvenli bağlantı sağlandı.
              </p>

              <div className="quick-actions-box">
                <Link href="/qr" className="action-nav-card"></Link>

                <Link href="/" className="action-nav-card"></Link>
              </div>

              <button 
                type="button"
                onClick={() => setLoginSuccess(null)}
                className="btn-switch-account"
              >
                Farklı Hesapla Giriş Yap
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: ROLE SELECTION SCREEN */}
              {currentStep === 'roleSelect' && (
                <div className="role-selection-screen animate-fade-in">
                  
                  {/* Header */}
                  <div className="screen-header">
                    <div className="header-text-block">
                      <span className="system-sub-label">BOĞAZİÇİ KOLEJİ MOBİL</span>
                      <h1 className="main-title">Hoş Geldiniz</h1>
                      <p className="main-subtitle">Devam etmek için giriş türünüzü seçin.</p>
                      <div className="red-accent-bar"></div>
                    </div>
                  </div>

                  {/* Clickable Role Cards */}
                  <div className="role-cards-stack">
                    {rolesData.map((item) => {
                      const IconComp = item.Icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleRoleSelect(item.id)}
                          className="role-row-card"
                        >
                          <div className="role-icon-circle">
                            <IconComp size={22} className="role-svg-icon" />
                          </div>
                          <div className="role-red-divider"></div>
                          <div className="role-info-content">
                            <h3 className="role-card-title">{item.title}</h3>
                            <p className="role-card-subtitle">{item.subtitle}</p>
                          </div>
                          <ChevronRight size={20} className="role-chevron" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Link to Register */}
                  <div className="account-switch-card">
                    <span className="switch-card-text">Henüz bir hesabınız yok mu?</span>
                    <Link href="/register" className="btn-switch-pill">
                      Yeni Kayıt Başvurusu Yap
                    </Link>
                  </div>

                  {/* Security Badge */}
                  <div className="bottom-badge-wrap">
                    <div className="bottom-security-badge">
                      <ShieldCheck size={13} className="badge-sec-icon" />
                      <span>Güvenli giriş ile bilgileriniz korunur.</span>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: LOGIN FORM SCREEN (NO CYLINDER BADGE) */}
              {currentStep === 'form' && (
                <div className="form-screen animate-fade-in">
                  
                  {/* Back button */}
                  <button 
                    type="button" 
                    onClick={handleBackToSelect} 
                    className="back-nav-btn"
                  >
                    <ChevronLeft size={20} />
                    <span>Giriş Türüne Dön</span>
                  </button>

                  {/* Form Card (Clean, without cylinder chip above title) */}
                  <div className="form-card">
                    
                    <div className="form-card-header">
                      <h2 className="form-title">
                        Hoş <span className="red-highlight">Geldiniz</span>
                      </h2>
                      <p className="form-desc">Devam etmek için bilgilerinizi girin.</p>
                      <div className="red-accent-bar"></div>
                    </div>

                    {error && (
                      <div className="error-banner">
                        <ShieldAlert size={18} className="error-svg" />
                        <div className="error-text-wrap">
                          <strong>Uyarı:</strong> {error}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handlePreLogin} className="actual-form">
                      
                      <div className="form-fields-stack">
                        
                        {/* TC Kimlik No */}
                        <div className="field-row-wrap">
                          <label className="field-label">
                            TC Kimlik No <span className="req-star">*</span>
                          </label>
                          <div className="input-container">
                            <div className="field-circle-icon">
                              <CreditCard size={15} />
                            </div>
                            <input
                              type="text"
                              maxLength={11}
                              placeholder="11 haneli kimlik numaranız"
                              value={tcKimlik}
                              onChange={(e) => setTcKimlik(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                              required
                              className="swift-input tracking-text"
                            />
                          </div>
                        </div>

                        {/* Student Specific: School Number */}
                        {selectedRole === 'student' && (
                          <div className="field-row-wrap">
                            <label className="field-label">
                              Okul Numarası <span className="req-star">*</span>
                            </label>
                            <div className="input-container">
                              <div className="field-circle-icon">
                                <Hash size={15} />
                              </div>
                              <input
                                type="text"
                                placeholder="Öğrenci okul numaranız"
                                value={schoolNumber}
                                onChange={(e) => setSchoolNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                required
                                className="swift-input"
                              />
                            </div>
                          </div>
                        )}

                        {/* Teacher Specific: Branch */}
                        {selectedRole === 'teacher' && (
                          <div className="field-row-wrap">
                            <label className="field-label">
                              Branş Bilgisi <span className="req-star">*</span>
                            </label>
                            <div className="input-container">
                              <div className="field-circle-icon">
                                <Building2 size={15} />
                              </div>
                              <select
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                className="swift-input swift-select"
                              >
                                {availableBranches.map((br) => (
                                  <option key={br} value={br}>{br}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Personnel Specific: Department */}
                        {selectedRole === 'personnel' && (
                          <div className="field-row-wrap">
                            <label className="field-label">
                              Görev / Departman <span className="req-star">*</span>
                            </label>
                            <div className="input-container">
                              <div className="field-circle-icon">
                                <Building2 size={15} />
                              </div>
                              <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="swift-input swift-select"
                              >
                                {availableDepartments.map((dept) => (
                                  <option key={dept} value={dept}>{dept}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Parent Specific: Child School Number */}
                        {selectedRole === 'parent' && (
                          <div className="field-row-wrap">
                            <label className="field-label">
                              Öğrencinin Okul Numarası <span className="req-star">*</span>
                            </label>
                            <div className="input-container">
                              <div className="field-circle-icon">
                                <Hash size={15} />
                              </div>
                              <input
                                type="text"
                                placeholder="Çocuğunuzun okul numarası"
                                value={schoolNumber}
                                onChange={(e) => setSchoolNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                required
                                className="swift-input"
                              />
                            </div>
                          </div>
                        )}

                        {/* Password */}
                        <div className="field-row-wrap">
                          <div className="label-with-forgot">
                            <label className="field-label">
                              Giriş Şifresi <span className="req-star">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => { setForgotModal(true); setForgotEmail(''); setForgotSent(false); }}
                              className="forgot-pass-btn"
                            >
                              Şifremi Unuttum
                            </button>
                          </div>
                          <div className="input-container">
                            <div className="field-circle-icon">
                              <Lock size={15} />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Hesap şifreniz"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="swift-input input-pass"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="toggle-pass-eye"
                              aria-label="Şifreyi göster"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Remember me */}
                      <div className="remember-me-row">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="custom-checkbox"
                          />
                          <span>Oturumumu açık tut</span>
                        </label>
                      </div>

                      {/* Submit Action */}
                      <div className="submit-action-block">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-submit-pill"
                        >
                          {loading ? (
                            <span className="loading-row">
                              <svg className="animate-spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="3" strokeDasharray="30" strokeLinecap="round"></circle>
                              </svg>
                              <span>Giriş Yapılıyor...</span>
                            </span>
                          ) : (
                            <span>Sisteme Giriş Yap</span>
                          )}
                        </button>
                      </div>

                      <div className="form-bottom-switch">
                        <span>Hesabınız yok mu?</span>
                        <Link href="/register" className="link-red-bold">Kayıt Ol</Link>
                      </div>
                      <div className="form-sec-note">
                        <ShieldCheck size={14} className="sec-note-icon" />
                        <span>256-Bit SSL Şifreleme ile Güvenli Kurumsal Giriş</span>
                      </div>

                    </form>
                  </div>

                </div>
              )}
            </>
          )}

          {/* FORGOT PASSWORD MODAL */}
          {forgotModal && (
            <div className="modal-backdrop animate-fade-in">
              <div className="modal-card">
                <h3 className="modal-title">Şifre Sıfırlama</h3>
                <p className="modal-desc">
                  Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderilecektir.
                </p>

                {forgotSent ? (
                  <div className="modal-sent-box">
                    <CheckCircle2 size={24} className="sent-check" />
                    <span>Sıfırlama bağlantısı e-postanıza iletildi. Lütfen gelen kutunuzu kontrol ediniz.</span>
                    <button
                      type="button"
                      onClick={() => setForgotModal(false)}
                      className="btn-modal-close"
                    >
                      Tamam
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="modal-form">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="swift-input"
                    />
                    <div className="modal-actions">
                      <button
                        type="button"
                        onClick={() => setForgotModal(false)}
                        className="btn-modal-cancel"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="btn-modal-send"
                      >
                        Sıfırlama Linki Gönder
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* FULLSCREEN TC VALIDATION SCANNER FOR LOGIN */}
      {showLoginScanner && (
        <TCValidationAnimationModal
          tcKimlik={tcKimlik}
          mode="login"
          onComplete={handleValidationComplete}
        />
      )}

      <Footer />

      
    </div>
  );
}
