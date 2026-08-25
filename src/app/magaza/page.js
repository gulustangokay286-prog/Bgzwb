"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ShoppingBag, 
  Shirt, 
  BookOpen, 
  Package, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";

export default function MagazaPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile({ full_name: user.displayName || "Öğrenci", role: "student" });
          }
        } catch (e) {
          setUserProfile({ full_name: "Öğrenci", role: "student" });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });
    return () => unsub();
  }, []);

  const products = [
    {
      id: 1,
      name: "Boğaziçi Koleji Polo Yaka Tişört (Lacivert/Bordo)",
      category: "uniform",
      price: 450,
      studentPrice: 380,
      badge: "Resmi Üniforma",
      image: "👕",
      desc: "%100 Organik pamuklu kumaş, nakış işlemeli kolej amblemi."
    },
    {
      id: 2,
      name: "Kapüşonlu Kolej Sweatshirt (Özel Seri)",
      category: "uniform",
      price: 750,
      studentPrice: 620,
      badge: "En Çok Satan",
      image: "🧥",
      desc: "İçi şardonlu sıcak tutan kumaş, Boğaziçi Eğitim Kurumları sırt baskısı."
    },
    {
      id: 3,
      name: "Okul Eşofman Takımı (Alt & Üst)",
      category: "uniform",
      price: 950,
      studentPrice: 790,
      badge: "Beden Eğitimi",
      image: "👖",
      desc: "Nefes alabilir esnek spor kumaşı, cepli ve fermuarlı tasarım."
    },
    {
      id: 4,
      name: "LGS 8. Sınıf VIP Soru Bankası Seti (6 Kitap)",
      category: "books",
      price: 1200,
      studentPrice: 950,
      badge: "Yayın Seti",
      image: "📚",
      desc: "Yeni nesil beceri temelli sorular, video çözümlü Boğaziçi Yayınları."
    },
    {
      id: 5,
      name: "YKS Sayısal (MF) İleri Düzey Konu & Deneme Seti",
      category: "books",
      price: 1650,
      studentPrice: 1350,
      badge: "Derece Grubu",
      image: "📖",
      desc: "TYT-AYT Matematik, Fizik, Kimya, Biyoloji soru bankaları ve 15 Türkiye geneli deneme."
    },
    {
      id: 6,
      name: "YKS Eşit Ağırlık (TM) VIP Hazırlık Paketi",
      category: "books",
      price: 1550,
      studentPrice: 1280,
      badge: "Derece Grubu",
      image: "📕",
      desc: "Matematik, Edebiyat, Tarih, Coğrafya özel tahlilli modüler fasiküller."
    },
    {
      id: 7,
      name: "Boğaziçi Paslanmaz Çelik Termos Bardak (500ml)",
      category: "stationery",
      price: 380,
      studentPrice: 290,
      badge: "Lisanslı Ürün",
      image: "🥤",
      desc: "Çift katmanlı vakumlu çelik, 12 saat sıcak-soğuk muhafaza."
    },
    {
      id: 8,
      name: "Ergonomik Kolej Sırt Çantası",
      category: "stationery",
      price: 850,
      studentPrice: 690,
      badge: "Ortopedik",
      image: "🎒",
      desc: "Laptop gözlü, su geçirmez kumaş, reflektörlü güvenlik şeritleri."
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setCart([...cart, product]);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setOrderSuccessModal(true);
    setCart([]);
  };

  return (
    <div className="magaza-page">
      <Header />

      <main className="magaza-main">
        {/* Hero */}
        <section className="page-hero">
          <div className="container">
            <span className="hero-subtag">BOĞAZİÇİ KOLEJİ MAĞAZASI</span>
            <h1 className="hero-title">Resmi Kıyafet, Yayın & <span className="red-text">Eğitim Materyalleri</span></h1>
            <p className="hero-desc">
              Kurumumuza ait orijinal okul kıyafetleri, soru bankası setleri ve lisanslı kolej ürünlerine güvenle ulaşın.
            </p>
          </div>
        </section>

        {/* Auth Notice Bar */}
        <div className="auth-status-bar">
          <div className="container auth-bar-inner">
            {currentUser && userProfile ? (
              <div className="auth-active-box">
                <ShieldCheck size={18} className="text-success" />
                <span>Oturum Açık: <strong>{userProfile.full_name}</strong> (Özel Öğrenci İndirimleri Aktif)</span>
              </div>
            ) : (
              <div className="auth-guest-box">
                <Lock size={16} className="text-red" />
                <span>Öğrenci indirimli fiyatlardan yararlanmak ve sipariş vermek için <strong>Giriş Yapmanız</strong> gerekmektedir.</span>
                <Link href="/login" className="btn-quick-login">Giriş Yap</Link>
              </div>
            )}
          </div>
        </div>

        {/* Store Container */}
        <div className="container store-layout">
          
          {/* Categories & Filter */}
          <div className="store-controls">
            <div className="category-chips">
              <button 
                type="button" 
                onClick={() => setSelectedCategory("all")}
                className={`chip-btn ${selectedCategory === "all" ? "active" : ""}`}
              >
                Tümü ({products.length})
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedCategory("uniform")}
                className={`chip-btn ${selectedCategory === "uniform" ? "active" : ""}`}
              >
                👕 Okul Kıyafetleri
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedCategory("books")}
                className={`chip-btn ${selectedCategory === "books" ? "active" : ""}`}
              >
                📚 Yayın & Kitap Setleri
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedCategory("stationery")}
                className={`chip-btn ${selectedCategory === "stationery" ? "active" : ""}`}
              >
                🎒 Kırtasiye & Aksesuar
              </button>
            </div>

            {/* Cart Widget */}
            {currentUser && cart.length > 0 && (
              <div className="cart-widget">
                <ShoppingBag size={18} />
                <span>Sepet ({cart.length} Ürün)</span>
                <button type="button" onClick={handleCheckout} className="btn-cart-pay">
                  Siparişi Tamamla
                </button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-badge">{p.badge}</div>
                <div className="product-emoji-slot">
                  <span className="emoji-icon">{p.image}</span>
                </div>

                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p className="product-desc">{p.desc}</p>
                  
                  <div className="price-row">
                    {currentUser ? (
                      <div className="discount-price-col">
                        <span className="old-price">{p.price} ₺</span>
                        <span className="current-price">{p.studentPrice} ₺</span>
                        <span className="discount-tag">Öğrenci Fiyatı</span>
                      </div>
                    ) : (
                      <div className="guest-price-col">
                        <span className="current-price">{p.price} ₺</span>
                        <span className="login-hint">Giriş ile {p.studentPrice} ₺</span>
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => handleAddToCart(p)}
                    className="btn-add-cart"
                  >
                    <ShoppingBag size={16} />
                    <span>{currentUser ? "Sepete Ekle" : "Giriş Yap & Satın Al"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* LOGIN REQUIRED MODAL */}
      {showAuthModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="auth-prompt-card">
            <div className="lock-icon-bubble">
              <Lock size={32} />
            </div>
            <h3>Giriş Yapmanız Gerekmektedir</h3>
            <p>
              Boğaziçi Koleji Mağazası yalnızca kayıtlı öğrencilerimize, velilerimize ve personelimize özeldir. İndirimli fiyatlardan yararlanmak ve sipariş vermek için lütfen giriş yapınız.
            </p>
            <div className="modal-btn-row">
              <button 
                type="button" 
                onClick={() => setShowAuthModal(false)}
                className="btn-modal-cancel"
              >
                Vazgeç
              </button>
              <Link href="/login" className="btn-modal-login">
                Giriş Yaparak Devam Et
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS MODAL */}
      {orderSuccessModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="auth-prompt-card">
            <div className="check-icon-bubble">
              <CheckCircle2 size={36} />
            </div>
            <h3>Sipariş Talebiniz Alındı</h3>
            <p>
              Seçtiğiniz ürünler idare ve mağaza birimine iletildi. Okul açılışında veya kampüs danışmasından teslim alabilirsiniz.
            </p>
            <button 
              type="button" 
              onClick={() => setOrderSuccessModal(false)}
              className="btn-modal-login"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .magaza-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #FAFBFD;
          font-family: var(--font-body), Inter, sans-serif;
        }
        .page-hero {
          background: linear-gradient(135deg, #0A192F 0%, #103A69 100%);
          color: #FFFFFF;
          padding: 70px 0 50px 0;
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
        .auth-status-bar {
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 12px 0;
        }
        .auth-bar-inner {
          display: flex;
          justify-content: center;
        }
        .auth-active-box {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #16A34A;
          font-size: 0.88rem;
        }
        .auth-guest-box {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #475569;
          font-size: 0.86rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .text-red { color: #E6332A; }
        .text-success { color: #16A34A; }
        .btn-quick-login {
          background: #103A69;
          color: #FFFFFF;
          padding: 4px 14px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
        }
        .btn-quick-login:hover {
          background: #E6332A;
        }
        .store-layout {
          padding: 40px 16px 80px 16px;
        }
        .store-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .category-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .chip-btn {
          padding: 9px 18px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 9999px;
          font-family: inherit;
          font-size: 0.86rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .chip-btn:hover {
          border-color: #103A69;
          color: #103A69;
        }
        .chip-btn.active {
          background: #103A69;
          color: #FFFFFF;
          border-color: #103A69;
          box-shadow: 0 4px 12px rgba(16, 58, 105, 0.15);
        }
        .cart-widget {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          padding: 6px 16px;
          border-radius: 9999px;
          color: #15803D;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .btn-cart-pay {
          background: #16A34A;
          color: #FFFFFF;
          border: none;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-cart-pay:hover {
          background: #15803D;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .product-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.2s ease;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(16, 58, 105, 0.08);
          border-color: #CBD5E1;
        }
        .product-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(10, 25, 47, 0.85);
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          letter-spacing: 0.3px;
        }
        .product-emoji-slot {
          height: 140px;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #F1F5F9;
        }
        .emoji-icon {
          font-size: 52px;
        }
        .product-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-info h3 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0A192F;
          margin-bottom: 6px;
          line-height: 1.35;
        }
        .product-desc {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.45;
          margin-bottom: 16px;
          flex: 1;
        }
        .price-row {
          margin-bottom: 16px;
        }
        .discount-price-col {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .old-price {
          font-size: 0.82rem;
          color: #94A3B8;
          text-decoration: line-through;
        }
        .current-price {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: #103A69;
        }
        .discount-tag {
          background: #FEF2F2;
          color: #E6332A;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .guest-price-col {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .login-hint {
          font-size: 0.74rem;
          color: #E6332A;
          font-weight: 700;
        }
        .btn-add-cart {
          width: 100%;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #103A69;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .btn-add-cart:hover {
          background: #E6332A;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 25, 47, 0.65);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 2000;
        }
        .auth-prompt-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px 28px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        .lock-icon-bubble {
          width: 64px;
          height: 64px;
          background: #FEF2F2;
          color: #E6332A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .check-icon-bubble {
          width: 64px;
          height: 64px;
          background: #F0FDF4;
          color: #16A34A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .auth-prompt-card h3 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: #0A192F;
          margin-bottom: 8px;
        }
        .auth-prompt-card p {
          font-size: 0.88rem;
          color: #64748B;
          line-height: 1.55;
          margin-bottom: 22px;
        }
        .modal-btn-row {
          display: flex;
          gap: 10px;
        }
        .btn-modal-cancel {
          flex: 1;
          padding: 11px 0;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 9999px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
        }
        .btn-modal-login {
          flex: 2;
          padding: 11px 0;
          background: #103A69;
          color: #FFFFFF;
          border-radius: 9999px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }
        .btn-modal-login:hover {
          background: #E6332A;
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1100px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 520px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          .hero-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}