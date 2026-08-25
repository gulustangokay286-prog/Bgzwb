"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  MessageSquare,
  User,
  Compass
} from "lucide-react";

export default function IletisimPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Genel Bilgi & Kayıt");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Lütfen zorunlu alanları doldurunuz.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="iletisim-page">
      <Header />

      <main className="iletisim-main">
        {/* Hero */}
        <section className="page-hero">
          <div className="container">
            <span className="hero-subtag">BİZE ULAŞIN</span>
            <h1 className="hero-title">Sorularınız & Kampüs Ziyaretleriniz İçin <span className="red-text">Buradayız</span></h1>
            <p className="hero-desc">
              Kayıt kabul, bursluluk sınavları ve eğitim modellerimiz hakkında detaylı bilgi almak için dilediğiniz an bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="contact-section">
          <div className="container contact-grid">
            
            {/* Info Column */}
            <div className="contact-info-col">
              <div className="info-box-card">
                <h3>İletişim & Santral</h3>
                <div className="contact-methods-stack">
                  <div className="method-item">
                    <div className="method-icon-circle"><MapPin size={20} /></div>
                    <div className="method-text">
                      <strong>Kampüs Adresimiz</strong>
                      <p>Bahçelievler Mah. Çamlık Cad. No: 42, Merkez / Çorum</p>
                    </div>
                  </div>

                  <div className="method-item">
                    <div className="method-icon-circle"><Phone size={20} /></div>
                    <div className="method-text">
                      <strong>Telefon & Çağrı Merkezi</strong>
                      <p>0 (364) 666 05 00</p>
                    </div>
                  </div>

                  <div className="method-item">
                    <div className="method-icon-circle"><Mail size={20} /></div>
                    <div className="method-text">
                      <strong>E-posta Adresimiz</strong>
                      <p>info@corumbogazici.com</p>
                    </div>
                  </div>

                  <div className="method-item">
                    <div className="method-icon-circle"><Clock size={20} /></div>
                    <div className="method-text">
                      <strong>Ziyaret & Danışma Saatleri</strong>
                      <p>Hafta İçi: 08:30 - 18:30<br/>Cumartesi: 09:00 - 16:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder Card */}
              <div className="map-card">
                <div className="map-header">
                  <Compass size={18} />
                  <span>Kampüs Ulaşım Kılavuzu</span>
                </div>
                <div className="map-visual-box">
                  <div className="map-pin-center">
                    <Building2 size={28} />
                    <span>Boğaziçi Kampüsü</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="contact-form-col">
              <div className="form-card">
                {sent ? (
                  <div className="sent-success-box animate-fade-in">
                    <div className="sent-check-circle">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2>Mesajınız İletildi</h2>
                    <p>
                      Teşekkürler <strong>{name}</strong>. Mesajınız ve iletişim bilgileriniz kayıt danışmanlarımıza ulaştı. En kısa sürede sizinle irtibata geçilecektir.
                    </p>
                    <button 
                      type="button" 
                      onClick={() => { setSent(false); setMessage(""); }}
                      className="btn-new-msg"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-head">
                      <h2>İletişim & Bilgi Talep Formu</h2>
                      <p>Aklınıza takılan her türlü konuyu bize yazabilirsiniz.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-field">
                        <label>Adınız Soyadınız *</label>
                        <div className="input-wrap">
                          <User size={16} className="inp-icon" />
                          <input 
                            type="text" 
                            placeholder="Adınız ve soyadınız" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                          />
                        </div>
                      </div>

                      <div className="form-field-row">
                        <div className="form-field">
                          <label>E-posta Adresi *</label>
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

                        <div className="form-field">
                          <label>Telefon Numarası</label>
                          <div className="input-wrap">
                            <Phone size={16} className="inp-icon" />
                            <input 
                              type="tel" 
                              placeholder="05XX XXX XX XX" 
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-field">
                        <label>Konu</label>
                        <select 
                          value={subject} 
                          onChange={(e) => setSubject(e.target.value)}
                          className="select-field"
                        >
                          <option value="Genel Bilgi & Kayıt">Genel Bilgi & Kayıt</option>
                          <option value="Bursluluk Sınavı">Bursluluk Sınavı</option>
                          <option value="Lise Alan Seçimleri (Sayısal/EA)">Lise Alan Seçimleri (Sayısal/EA)</option>
                          <option value="Servis & Yemek">Servis & Yemek Hizmetleri</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Mesajınız *</label>
                        <textarea 
                          rows={4} 
                          placeholder="Mesajınızı detaylı olarak buraya yazınız..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="btn-send-msg">
                        <Send size={16} />
                        <span>Mesajı Gönder</span>
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .iletisim-page {
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
        .contact-section {
          padding: 60px 0 80px 0;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 30px;
        }
        .info-box-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
          margin-bottom: 20px;
        }
        .info-box-card h3 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: #0A192F;
          margin-bottom: 20px;
        }
        .contact-methods-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .method-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .method-icon-circle {
          width: 42px;
          height: 42px;
          background: #EEF2F6;
          color: #103A69;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .method-text strong {
          display: block;
          font-size: 0.92rem;
          color: #0A192F;
          margin-bottom: 2px;
        }
        .method-text p {
          font-size: 0.84rem;
          color: #64748B;
          line-height: 1.45;
          margin: 0;
        }
        .map-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
        }
        .map-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          font-size: 0.84rem;
          font-weight: 700;
          color: #103A69;
        }
        .map-visual-box {
          height: 180px;
          background: linear-gradient(135deg, #EEF2F6 0%, #E2E8F0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .map-pin-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #103A69;
          font-weight: 800;
          font-size: 0.9rem;
        }
        .form-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }
        .form-head h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #0A192F;
          margin-bottom: 4px;
        }
        .form-head p {
          font-size: 0.86rem;
          color: #64748B;
          margin-bottom: 22px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .form-field label {
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
        .input-wrap input, .select-field, textarea {
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
        .select-field {
          padding-left: 14px;
          cursor: pointer;
        }
        textarea {
          height: auto;
          padding: 12px 14px;
          resize: vertical;
        }
        .input-wrap input:focus, .select-field:focus, textarea:focus {
          border-color: #103A69;
          background: #FFFFFF;
        }
        .btn-send-msg {
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
          margin-top: 6px;
        }
        .btn-send-msg:hover {
          background: #E6332A;
        }
        .sent-success-box {
          text-align: center;
          padding: 20px 0;
        }
        .sent-check-circle {
          width: 68px;
          height: 68px;
          background: #F0FDF4;
          color: #16A34A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .sent-success-box h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #0A192F;
          margin-bottom: 8px;
        }
        .sent-success-box p {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .btn-new-msg {
          padding: 10px 24px;
          background: #103A69;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-new-msg:hover {
          background: #E6332A;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .form-field-row {
            grid-template-columns: 1fr;
          }
          .form-card {
            padding: 24px 16px;
          }
          .hero-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}