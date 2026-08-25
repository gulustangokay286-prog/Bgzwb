"use client";
import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function ShopShowcase() {
  const items = [
    { title: "Boğaziçi Koleji Polo Yaka Tişört", price: "380 ₺", tag: "Resmi Üniforma", icon: "👕" },
    { title: "Kapüşonlu Kolej Sweatshirt", price: "620 ₺", tag: "Koleksiyon", icon: "🧥" },
    { title: "YKS Sayısal / EA VIP Hazırlık Seti", price: "1350 ₺", tag: "Yayın Paketi", icon: "📚" },
    { title: "Lisanslı Paslanmaz Termos Bardak", price: "290 ₺", tag: "Kolej Ürünü", icon: "🥤" }
  ];

  return (
    <section className="shop-showcase-section">
      <div className="container">
        <div className="shop-head-row">
          <div className="shop-head-left">
            <span className="sec-tag">KURUMSAL MAĞAZA</span>
            <h2>Okul Kıyafetleri & Yayın Setleri</h2>
            <p>Kayıtlı öğrencilerimize özel indirimli fiyatlarla resmi okul ürünleri.</p>
          </div>
          <Link href="/magaza" className="btn-all-shop">
            <span>Mağazayı Ziyaret Et</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="shop-items-grid">
          {items.map((it, idx) => (
            <div key={idx} className="shop-item-card">
              <div className="item-tag">{it.tag}</div>
              <div className="item-emoji-box">
                <span>{it.icon}</span>
              </div>
              <div className="item-card-body">
                <h4>{it.title}</h4>
                <div className="item-price-row">
                  <span className="price-val">{it.price}</span>
                  <span className="price-note">Öğrenci Fiyatı</span>
                </div>
                <Link href="/magaza" className="btn-buy-link">
                  <ShoppingBag size={15} />
                  <span>İncele & Sipariş Ver</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .shop-showcase-section {
          padding: 80px 0;
          background: #F8FAFC;
        }
        .shop-head-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          gap: 20px;
        }
        .sec-tag {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #E6332A;
        }
        .shop-head-left h2 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 2.1rem;
          font-weight: 800;
          color: #0A192F;
          margin-top: 6px;
        }
        .shop-head-left p {
          font-size: 0.92rem;
          color: #64748B;
          margin-top: 4px;
        }
        .btn-all-shop {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: #103A69;
          color: #FFFFFF;
          border-radius: 9999px;
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .btn-all-shop:hover {
          background: #E6332A;
          transform: translateY(-1px);
        }
        .shop-items-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .shop-item-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.2s ease;
        }
        .shop-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(16, 58, 105, 0.08);
          border-color: #CBD5E1;
        }
        .item-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(10, 25, 47, 0.85);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .item-emoji-box {
          height: 120px;
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 46px;
        }
        .item-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .item-card-body h4 {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #0A192F;
          margin-bottom: 12px;
          line-height: 1.35;
          flex: 1;
        }
        .item-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 14px;
        }
        .price-val {
          font-family: var(--font-heading), Outfit, sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #103A69;
        }
        .price-note {
          font-size: 0.72rem;
          color: #16A34A;
          font-weight: 700;
        }
        .btn-buy-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 0;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #103A69;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-buy-link:hover {
          background: #E6332A;
          border-color: #E6332A;
          color: #FFFFFF;
        }
        @media (max-width: 992px) {
          .shop-items-grid {
            grid-template-columns: 1fr 1fr;
          }
          .shop-head-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @media (max-width: 520px) {
          .shop-items-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}