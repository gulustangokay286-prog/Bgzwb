"use client";
import React from "react";
import Link from "next/link";
import { IconFlask, IconScale, IconBook, IconGlobe } from "./Icons";
import "./EducationLevels.css";

const programs = [
  { name: "Sayısal", slug: "sayisal", Icon: IconFlask, color: "#2196F3", desc: "Matematik, Fizik, Kimya, Biyoloji alanlarında güçlü altyapı." },
  { name: "Eşit Ağırlık", slug: "esit", Icon: IconScale, color: "#f0c929", desc: "Türkçe-Matematik dengesinde kapsamlı hazırlık programı." },
  { name: "Sözel", slug: "sozel", Icon: IconBook, color: "#FF7043", desc: "Edebiyat, Tarih, Coğrafya, Felsefe odaklı derinlikli eğitim." },
  { name: "Dil", slug: "dil", Icon: IconGlobe, color: "#26A69A", desc: "İngilizce ve yabancı dil yetkinliğinde uzmanlaşma." },
];

const EducationLevels = () => {
  return (
    <section className="edu-section" id="egitim">
      <div className="container">
        <div className="edu-top">
          <div className="edu-info">
            <h2>Eğitim Programlarımız</h2>
            <p>Lise düzeyinde dört farklı alan ile öğrencilerimizi YKS'ye hazırlıyoruz</p>
          </div>
          <div className="edu-cards">
            {programs.map((p, i) => (
              <Link 
                href={`/egitim?alan=${p.slug}`} 
                className="edu-card" 
                key={i} 
                style={{ background: p.color }}
              >
                <span className="edu-icon"><p.Icon size={32} color="#fff" /></span>
                <span className="edu-name">{p.name.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationLevels;
