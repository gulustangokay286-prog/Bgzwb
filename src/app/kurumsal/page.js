"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Building2, 
  Award, 
  Target, 
  Eye, 
  Users, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  GraduationCap
} from "lucide-react";

export default function KurumsalPage() {
  const leadership = [
    { name: "Prof. Dr. Ahmet Yılmaz", role: "Kurucu Temsilcisi & Genel Müdür", desc: "30 yılı aşkın eğitim liderliği tecrübesiyle kurumun akademik vizyonunu yönetmektedir." },
    { name: "Zeynep Kaya", role: "Lise Koordinatörü & Eğitim Direktörü", desc: "YKS ve uluslararası eğitim programları geliştirme uzmanı." },
    { name: "Mehmet Demir", role: "Ortaokul & LGS Koordinatörü", desc: "Bilişsel gelişim ve yeni nesil soru stratejileri lideri." },
    { name: "Selin Çelik", role: "PDR & Kariyer Merkezi Başkanı", desc: "Öğrenci koçluğu, yetenek analizi ve üniversite yerleştirme danışmanı." }
  ];

  const values = [
    { title: "Akademik Mükemmeliyet", desc: "Her öğrencimizin potansiyelinin zirvesine ulaşması için tasarlanmış modern müfredat.", icon: Award },
    { title: "Karakter & Değerler Eğitimi", desc: "Sorumluluk sahibi, dürüst, çevreye ve topluma duyarlı bireyler yetiştirme taahhüdü.", icon: Shield },
    { title: "Yapay Zeka & Bilişim Entegrasyonu", desc: "Eğitim teknolojilerini en üst düzeyde kullanan akıllı öğrenme ekosistemi.", icon: Sparkles },
    { title: "Birebir Mentorluk", desc: "Her kademede öğrencimize özel akademik ve psikolojik rehberlik desteği.", icon: Users }
  ];

  return (
    <div className="kurumsal-page">
      <Header />

      <main className="kurumsal-main">
        {/* Hero Header */}
        <section className="page-hero">
          <div className="container">
            <span className="hero-subtag">BOĞAZİÇİ KOLEJİ</span>
            <h1 className="hero-title">Geleceğin Liderlerini <span className="red-text">Bugünden Yetiştiriyoruz</span></h1>
            <p className="hero-desc">
              Köklü eğitim geleneğimizi modern teknolojiler ve çağdaş pedagojiyle birleştirerek Türkiye’nin aydınlık geleceğini inşa ediyoruz.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mv-section">
          <div className="container mv-grid">
            <div className="mv-card">
              <div className="mv-icon-circle">
                <Target size={28} />
              </div>
              <h2>Misyonumuz</h2>
              <p>
                Öğrencilerimizi milli ve manevi değerlerine bağlı, evrensel düşünce yapısına sahip, bilim ve teknolojiyi en üst düzeyde kullanan, problem çözme yetisi gelişmiş ve geleceğe hazır bireyler olarak yetiştirmektir.
              </p>
            </div>

            <div className="mv-card">
              <div className="mv-icon-circle red-circle">
                <Eye size={28} />
              </div>
              <h2>Vizyonumuz</h2>
              <p>
                Türkiye’nin en nitelikli eğitim kurumlarından biri olarak; akademik başarı, yabancı dil yetkinliği, teknoloji geliştirme ve sanat-spor alanlarında uluslararası standartlarda öncü bir okul kültürü oluşturmaktır.
              </p>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="values-section">
          <div className="container">
            <div className="section-title-box">
              <span className="sec-tag">TEMEL İLKELERİMİZ</span>
              <h2>Bizi Farklı Kılan Değerlerimiz</h2>
              <div className="red-line"></div>
            </div>

            <div className="values-grid">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="val-item-card">
                    <div className="val-icon-wrap">
                      <Icon size={24} />
                    </div>
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="leadership-section">
          <div className="container">
            <div className="section-title-box">
              <span className="sec-tag">YÖNETİM KADROMUZ</span>
              <h2>Eğitimde Öncü İdari ve Akademik Kadro</h2>
              <div className="red-line"></div>
            </div>

            <div className="leaders-grid">
              {leadership.map((leader, i) => (
                <div key={i} className="leader-card">
                  <div className="leader-avatar-circle">
                    <GraduationCap size={32} />
                  </div>
                  <h3>{leader.name}</h3>
                  <span className="leader-role">{leader.role}</span>
                  <p>{leader.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="facilities-section">
          <div className="container">
            <div className="facilities-box">
              <div className="fac-text">
                <span className="sec-tag text-white">KAMPÜS YAŞAMI</span>
                <h2>Geniş ve Modern Kampüs Olanakları</h2>
                <p>25.000 m² kapalı alan, kapalı spor salonları, yarı olimpik yüzme havuzu, 3D maker ve robotik laboratuvarları, zengin kütüphane ve 600 kişilik konferans salonu.</p>
                <div className="fac-checklist">
                  <div className="check-item"><CheckCircle2 size={18} /> Fen ve Biyoloji Araştırma Laboratuvarları</div>
                  <div className="check-item"><CheckCircle2 size={18} /> Yapay Zeka & Kodlama Atölyeleri</div>
                  <div className="check-item"><CheckCircle2 size={18} /> Çok Amaçlı Spor Kompleksi & Fitness</div>
                  <div className="check-item"><CheckCircle2 size={18} /> Müzik Stüdyoları & Görsel Sanatlar Atölyesi</div>
                </div>
              </div>
              <div className="fac-action">
                <Link href="/iletisim" className="btn-fac-visit">
                  <span>Kampüsü Ziyaret Edin</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .kurumsal-page {
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
          position: relative;
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
          max-width: 780px;
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
        .mv-section {
          padding: 60px 0;
        }
        .mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .mv-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .mv-icon-circle {
          width: 56px;
          height: 56px;
          background: #EEF2F6;
          color: #103A69;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .mv-icon-circle.red-circle {
          background: #FEF2F2;
          color: #E6332A;
        }
        .mv-card h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #0A192F;
          margin-bottom: 12px;
        }
        .mv-card p {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.65;
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
        .values-section {
          padding: 60px 0;
          background: #F8FAFC;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .val-item-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 28px 22px;
          transition: transform 0.2s ease;
        }
        .val-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(16, 58, 105, 0.08);
        }
        .val-icon-wrap {
          width: 48px;
          height: 48px;
          background: #EEF2F6;
          color: #103A69;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .val-item-card h3 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0A192F;
          margin-bottom: 8px;
        }
        .val-item-card p {
          font-size: 0.86rem;
          color: #64748B;
          line-height: 1.55;
        }
        .leadership-section {
          padding: 70px 0;
        }
        .leaders-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .leader-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 28px 20px;
          text-align: center;
        }
        .leader-avatar-circle {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #103A69 0%, #0A192F 100%);
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .leader-card h3 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0A192F;
          margin-bottom: 4px;
        }
        .leader-role {
          font-size: 0.78rem;
          font-weight: 700;
          color: #E6332A;
          display: block;
          margin-bottom: 10px;
        }
        .leader-card p {
          font-size: 0.82rem;
          color: #64748B;
          line-height: 1.5;
        }
        .facilities-section {
          padding: 30px 0 80px 0;
        }
        .facilities-box {
          background: linear-gradient(135deg, #0A192F 0%, #103A69 100%);
          color: #FFFFFF;
          border-radius: 24px;
          padding: 50px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }
        .fac-text {
          max-width: 640px;
        }
        .fac-text h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 2rem;
          font-weight: 800;
          margin: 8px 0 14px 0;
        }
        .fac-text p {
          font-size: 0.95rem;
          color: #CBD5E1;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .fac-checklist {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.86rem;
          color: #E2E8F0;
        }
        .btn-fac-visit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #E6332A;
          color: #FFFFFF;
          padding: 14px 28px;
          border-radius: 9999px;
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .btn-fac-visit:hover {
          background: #ff473d;
          transform: translateY(-2px);
        }
        @media (max-width: 992px) {
          .values-grid, .leaders-grid {
            grid-template-columns: 1fr 1fr;
          }
          .facilities-box {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @media (max-width: 640px) {
          .hero-title {
            font-size: 1.8rem;
          }
          .mv-grid {
            grid-template-columns: 1fr;
          }
          .values-grid, .leaders-grid {
            grid-template-columns: 1fr;
          }
          .fac-checklist {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}