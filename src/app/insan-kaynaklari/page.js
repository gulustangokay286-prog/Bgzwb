"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { 
  Briefcase, 
  UserCheck, 
  GraduationCap, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  HeartHandshake, 
  TrendingUp, 
  Sparkles,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  UploadCloud,
  Check,
  AlertCircle
} from "lucide-react";

export default function InsanKaynaklariPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [positionType, setPositionType] = useState("teacher");
  const [branch, setBranch] = useState("Matematik");
  const [experience, setExperience] = useState("3-5 Yıl");
  const [notes, setNotes] = useState("");
  
  // Cloudinary Upload State
  const [cvFile, setCvFile] = useState(null);
  const [cvUploadedUrl, setCvUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const branches = [
    "Matematik", "Fizik", "Kimya", "Biyoloji", "Türkçe & Edebiyat",
    "Tarih", "Coğrafya", "Felsefe", "İngilizce", "Almanca",
    "Bilişim & Robotik", "Rehberlik & PDR", "Beden Eğitimi", "Görsel Sanatlar", "Müzik"
  ];

  const staffRoles = [
    "İdari İşler & Yönetici Asistanı", "Öğrenci İşleri Uzmanı", "Muhasebe & Finans",
    "Halkla İlişkiler & Kayıt Danışmanı", "BT & Sistem Uzmanı", "Kütüphane Görevlisi", "Güvenlik & Danışma"
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFile(file);
    setUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      const result = await uploadToCloudinary(file, "bogazici-hr-cvs", (progress) => {
        setUploadProgress(progress);
      });
      setCvUploadedUrl(result.secure_url);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setUploadError("Dosya Cloudinary sunucularına yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert("Lütfen zorunlu alanları doldurunuz.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="ik-page">
      <Header />

      <main className="ik-main">
        {/* Hero */}
        <section className="page-hero">
          <div className="container">
            <span className="hero-subtag">BOĞAZİÇİ EĞİTİM KURUMLARI</span>
            <h1 className="hero-title">Geleceği Birlikte İnşa Edeceğimiz <span className="red-text">Eğitim Liderleri Arıyoruz</span></h1>
            <p className="hero-desc">
              Sürekli gelişen, yenilikçi ve başarı odaklı akademik kadromuza katılarak Türkiye’nin en nitelikli öğrencilerine rehberlik edin.
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="benefits-section">
          <div className="container">
            <div className="section-title-box">
              <span className="sec-tag">BOĞAZİÇİ’NDE KARİYER</span>
              <h2>Öğretmen ve Personel Değerlerimiz</h2>
              <div className="red-line"></div>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon"><Sparkles size={24} /></div>
                <h3>Sürekli Mesleki Gelişim</h3>
                <p>Boğaziçi Akademi bünyesinde uluslararası sertifikasyon, yapay zeka eğitim teknolojileri ve pedagojik seminerler.</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon"><TrendingUp size={24} /></div>
                <h3>Kariyer & Yönetici Basamakları</h3>
                <p>Zümre başkanlığı, koordinatörlük ve idari liderlik süreçlerinde liyakat esaslı terfi imkanları.</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon"><HeartHandshake size={24} /></div>
                <h3>Güçlü Sosyal & Yan Haklar</h3>
                <p>Özel sağlık sigortası, çocuk eğitim bursu desteği, yemek ve ulaşım imkanları ile huzurlu çalışma ortamı.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="form-section">
          <div className="container form-container-box">
            {submitted ? (
              <div className="success-app-box animate-fade-in">
                <div className="success-icon-bubble">
                  <CheckCircle2 size={44} />
                </div>
                <h2>Başvurunuz İK Havuzumuza Alındı</h2>
                <p>
                  Sayın <strong>{fullName}</strong>, özgeçmiş bilgileriniz ve başvuru formunuz Boğaziçi Koleji İnsan Kaynakları Direktörlüğü tarafından kayıt altına alındı. Açık pozisyonlarda niteliklerinizin uygunluğu durumunda sizinle iletişime geçilecektir.
                </p>
                {cvUploadedUrl && (
                  <div className="uploaded-cv-badge">
                    <CheckCircle2 size={16} />
                    <span>Özgeçmiş Cloudinary bulutunda başarıyla arşivlendi.</span>
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={() => { setSubmitted(false); setFullName(""); setNotes(""); setCvUploadedUrl(""); setCvFile(null); }}
                  className="btn-new-app"
                >
                  Yeni Başvuru Gönder
                </button>
              </div>
            ) : (
              <div className="app-form-card">
                <div className="form-header">
                  <h2>İş & Staj Başvuru Formu</h2>
                  <p>Lütfen bilgilerinizi eksiksiz doldurunuz. Başvurunuz gizlilik ilkeleri kapsamında değerlendirilecektir.</p>
                </div>

                <form onSubmit={handleSubmit} className="ik-form">
                  {/* Position Toggle */}
                  <div className="position-toggle-wrap">
                    <label className="toggle-label">Başvuru Alanı:</label>
                    <div className="toggle-buttons">
                      <button 
                        type="button"
                        onClick={() => setPositionType("teacher")}
                        className={`toggle-btn ${positionType === "teacher" ? "active" : ""}`}
                      >
                        <GraduationCap size={16} />
                        <span>Öğretmen Kadrosu</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPositionType("staff")}
                        className={`toggle-btn ${positionType === "staff" ? "active" : ""}`}
                      >
                        <Building2 size={16} />
                        <span>İdari & Destek Personeli</span>
                      </button>
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="field-block">
                      <label>Adınız ve Soyadınız *</label>
                      <div className="input-wrap">
                        <User size={16} className="inp-icon" />
                        <input 
                          type="text" 
                          placeholder="Ad Soyad" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="field-block">
                      <label>E-posta Adresiniz *</label>
                      <div className="input-wrap">
                        <Mail size={16} className="inp-icon" />
                        <input 
                          type="email" 
                          placeholder="ornek@eposta.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="field-block">
                      <label>Telefon Numaranız *</label>
                      <div className="input-wrap">
                        <Phone size={16} className="inp-icon" />
                        <input 
                          type="tel" 
                          placeholder="05XX XXX XX XX" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="field-block">
                      <label>{positionType === "teacher" ? "Branşınız *" : "Pozisyon *"}</label>
                      <select 
                        value={branch} 
                        onChange={(e) => setBranch(e.target.value)}
                        className="select-inp"
                      >
                        {positionType === "teacher" 
                          ? branches.map((b) => <option key={b} value={b}>{b}</option>)
                          : staffRoles.map((s) => <option key={s} value={s}>{s}</option>)
                        }
                      </select>
                    </div>

                    <div className="field-block">
                      <label>Mesleki Tecrübe Süresi</label>
                      <select 
                        value={experience} 
                        onChange={(e) => setExperience(e.target.value)}
                        className="select-inp"
                      >
                        <option value="Yeni Mezun">Yeni Mezun (0-1 Yıl)</option>
                        <option value="1-3 Yıl">1 - 3 Yıl</option>
                        <option value="3-5 Yıl">3 - 5 Yıl</option>
                        <option value="5-10 Yıl">5 - 10 Yıl</option>
                        <option value="10+ Yıl">10 Yıl ve Üzeri</option>
                      </select>
                    </div>

                    {/* Cloudinary CV Upload Area */}
                    <div className="field-block">
                      <label>Özgeçmiş (CV) Dosyası (Cloudinary)</label>
                      <div className="cloudinary-upload-container">
                        <label className="cloudinary-drop-label">
                          <UploadCloud size={18} className="cloud-icon" />
                          <span className="cloud-label-text">
                            {cvFile ? cvFile.name : "CV Yükle (PDF / Word)"}
                          </span>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            onChange={handleFileUpload} 
                            style={{ display: "none" }} 
                          />
                        </label>
                        
                        {uploading && (
                          <div className="upload-progress-box">
                            <div className="progress-bar-bg">
                              <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <span className="progress-text">Yükleniyor: %{uploadProgress}</span>
                          </div>
                        )}

                        {cvUploadedUrl && (
                          <div className="upload-success-chip">
                            <Check size={14} />
                            <span>Cloudinary bulutuna yüklendi</span>
                          </div>
                        )}

                        {uploadError && (
                          <div className="upload-error-chip">
                            <AlertCircle size={14} />
                            <span>{uploadError}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="field-block full-width">
                    <label>Kendinizi Tanıtın & Ek Notlarınız</label>
                    <textarea 
                      rows={3} 
                      placeholder="Eğitim felsefeniz, projeleriniz ve başarılarınız hakkında kısaca bilgi veriniz..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="submit-box">
                    <button type="submit" className="btn-submit-app">
                      <Send size={16} />
                      <span>Başvuruyu İlet</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .ik-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #FAFBFD;
          font-family: var(--font-body), Inter, sans-serif;
        }
        .page-hero {
          background: linear-gradient(135deg, #0A192F 0%, #103A69 100%);
          color: #FFFFFF;
          padding: 70px 0 60px 0;
          text-align: center;
        }
        .hero-subtag {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 2px;
          color: #FF8A80;
          text-transform: uppercase;
        }
        .hero-title {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          margin: 12px auto;
          max-width: 800px;
          line-height: 1.2;
        }
        .red-text {
          color: #E6332A;
        }
        .hero-desc {
          font-size: 1.05rem;
          color: #CBD5E1;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .benefits-section {
          padding: 60px 0;
        }
        .section-title-box {
          text-align: center;
          margin-bottom: 40px;
        }
        .sec-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #E6332A;
        }
        .section-title-box h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 2.1rem;
          font-weight: 800;
          color: #0A192F;
          margin-top: 6px;
        }
        .red-line {
          width: 36px;
          height: 3px;
          background: #E6332A;
          border-radius: 2px;
          margin: 10px auto 0 auto;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .benefit-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 32px 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }
        .benefit-icon {
          width: 50px;
          height: 50px;
          background: #EEF2F6;
          color: #103A69;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .benefit-card h3 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #0A192F;
          margin-bottom: 8px;
        }
        .benefit-card p {
          font-size: 0.88rem;
          color: #64748B;
          line-height: 1.6;
        }

        /* Form Section */
        .form-section {
          padding: 20px 0 80px 0;
        }
        .form-container-box {
          max-width: 760px;
          margin: 0 auto;
        }
        .app-form-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 40px 36px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.04);
        }
        .form-header {
          margin-bottom: 24px;
        }
        .form-header h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #0A192F;
          margin-bottom: 4px;
        }
        .form-header p {
          font-size: 0.86rem;
          color: #64748B;
        }
        .position-toggle-wrap {
          margin-bottom: 20px;
        }
        .toggle-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          display: block;
          margin-bottom: 8px;
        }
        .toggle-buttons {
          display: flex;
          gap: 10px;
        }
        .toggle-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 0;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .toggle-btn:hover {
          border-color: #103A69;
        }
        .toggle-btn.active {
          background: #103A69;
          color: #FFFFFF;
          border-color: #103A69;
          box-shadow: 0 4px 12px rgba(16, 58, 105, 0.15);
        }
        .form-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .field-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-block.full-width {
          grid-column: 1 / -1;
        }
        .field-block label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
        }
        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .inp-icon {
          position: absolute;
          left: 12px;
          color: #94A3B8;
        }
        .input-wrap input, .select-inp, textarea {
          width: 100%;
          height: 44px;
          padding: 0 14px 0 38px;
          font-size: 16px !important;
          color: #0F172A;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        .select-inp {
          padding-left: 14px;
          cursor: pointer;
        }
        .cloudinary-upload-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cloudinary-drop-label {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 44px;
          padding: 0 14px;
          background: #F8FAFC;
          border: 1.5px dashed #CBD5E1;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cloudinary-drop-label:hover {
          border-color: #103A69;
          background: #F1F5F9;
        }
        .cloud-icon { color: #103A69; }
        .cloud-label-text {
          font-size: 0.82rem;
          font-weight: 600;
          color: #334155;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .upload-progress-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .progress-bar-bg {
          flex: 1;
          height: 6px;
          background: #E2E8F0;
          border-radius: 9999px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: #103A69;
          border-radius: 9999px;
          transition: width 0.2s ease;
        }
        .progress-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: #103A69;
        }
        .upload-success-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #F0FDF4;
          color: #16A34A;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          width: fit-content;
        }
        .upload-error-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FEF2F2;
          color: #DC2626;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          width: fit-content;
        }
        textarea {
          height: auto;
          padding: 12px 14px;
          resize: vertical;
        }
        .input-wrap input:focus, .select-inp:focus, textarea:focus {
          border-color: #103A69;
          background: #FFFFFF;
        }
        .submit-box {
          margin-top: 20px;
        }
        .btn-submit-app {
          width: 100%;
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #103A69;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .btn-submit-app:hover {
          background: #E6332A;
        }

        /* Success Box */
        .success-app-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 46px 36px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,0.04);
        }
        .success-icon-bubble {
          width: 72px;
          height: 72px;
          background: #F0FDF4;
          color: #16A34A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .success-app-box h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #0A192F;
          margin-bottom: 8px;
        }
        .success-app-box p {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.6;
          max-width: 520px;
          margin: 0 auto 16px auto;
        }
        .uploaded-cv-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #15803D;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 9999px;
          margin-bottom: 24px;
        }
        .btn-new-app {
          padding: 11px 26px;
          background: #103A69;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-new-app:hover {
          background: #E6332A;
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .benefits-grid {
            grid-template-columns: 1fr;
          }
          .form-grid-2col {
            grid-template-columns: 1fr;
          }
          .app-form-card {
            padding: 26px 18px;
          }
          .toggle-buttons {
            flex-direction: column;
          }
          .hero-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
