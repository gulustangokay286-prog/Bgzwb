"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { 
  IconMail, 
  IconPhone, 
  IconFacebook, 
  IconTwitter, 
  IconInstagram, 
  IconYoutube, 
  IconSearch, 
  IconClose 
} from "./Icons";
import { 
  QrCode, 
  ShoppingBag, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Strict Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !user.isAnonymous) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists() && docSnap.data()?.full_name) {
            setCurrentUser(user);
            setUserProfile(docSnap.data());
          } else if (user.displayName) {
            setCurrentUser(user);
            setUserProfile({
              full_name: user.displayName,
              role: "student"
            });
          } else {
            setCurrentUser(null);
            setUserProfile(null);
          }
        } catch (err) {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setProfileDropdownOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "BK";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const roleDisplay = (role) => {
    switch (role) {
      case "teacher": return "Öğretmen";
      case "personnel": return "Personel";
      case "parent": return "Veli";
      case "admin": return "Yönetici";
      default: return "Öğrenci";
    }
  };

  const navMenuItems = [
    { title: "Kurumsal", href: "/kurumsal" },
    { title: "Eğitim Kademelerimiz", href: "/egitim" },
    { title: "Kurumsal Mağaza", href: "/magaza" },
    { title: "İnsan Kaynakları", href: "/insan-kaynaklari" },
    { title: "İletişim", href: "/iletisim" }
  ];

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <a href="mailto:info@corumbogazici.com" className="top-contact">
              <IconMail size={14} /> info@corumbogazici.com
            </a>
            <span className="top-divider">|</span>
            <a href="tel:03646660500" className="top-contact">
              <IconPhone size={14} /> 0 (364) 666 05 00
            </a>
          </div>

          {/* Top Auth Section Mobile */}
          <div className="top-auth-group-mobile">
            {currentUser && userProfile ? (
              <div className="top-user-pill-mobile" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <div className="avatar-mini-circle">
                  {getInitials(userProfile.full_name)}
                </div>
                <span className="top-user-name-short">
                  {userProfile.full_name?.split(" ")[0]}
                </span>
                <span className="online-pulse-dot"></span>
              </div>
            ) : (
              <>
                <Link href="/register" className="top-register-btn-mobile">Kayıt Ol</Link>
                <Link href="/login" className="top-login-btn-mobile">Giriş Yap</Link>
              </>
            )}
          </div>

          <div className="top-bar-right">
            <div className="social-links">
              <a href="#" aria-label="Facebook"><IconFacebook size={12} /></a>
              <a href="#" aria-label="Twitter"><IconTwitter size={12} /></a>
              <a href="https://www.instagram.com/corumbogazicikoleji" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IconInstagram size={12} /></a>
              <a href="#" aria-label="YouTube"><IconYoutube size={12} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className={`main-nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="container main-nav-inner">
          <Link href="/" className="logo-wrapper">
            <img src="/logo.png?v=img4327" alt="Boğaziçi Koleji" className="logo-img" />
            <div className="logo-text">
              <span className="logo-name">BOĞAZİÇİ</span>
              <span className="logo-sub">EĞİTİM KURUMLARI</span>
            </div>
          </Link>

          <div className="nav-actions">
            {currentUser && userProfile ? (
              /* Profile Avatar Dropdown */
              <div className="profile-menu-container" ref={dropdownRef}>
                <button 
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="profile-avatar-btn"
                  aria-label="Kullanıcı Menüsü"
                >
                  <div className="profile-avatar-circle">
                    {getInitials(userProfile.full_name)}
                  </div>
                  <div className="profile-btn-info">
                    <span className="profile-btn-name">{userProfile.full_name?.split(" ")[0]}</span>
                    <span className="profile-btn-role">{roleDisplay(userProfile.role)}</span>
                  </div>
                  <ChevronDown size={14} className={`profile-chevron ${profileDropdownOpen ? "rotate" : ""}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="profile-dropdown-card animate-pop-in">
                    <div className="profile-dropdown-header">
                      <div className="dropdown-avatar-large">
                        {getInitials(userProfile.full_name)}
                      </div>
                      <div className="dropdown-user-details">
                        <strong className="dropdown-name">{userProfile.full_name}</strong>
                        <span className="dropdown-role-badge">
                          <ShieldCheck size={12} />
                          {roleDisplay(userProfile.role)}
                        </span>
                        <small className="dropdown-email">{currentUser.email}</small>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-links-list">
                      <Link href="/qr" className="dropdown-item-link" onClick={() => setProfileDropdownOpen(false)}>
                        <QrCode size={16} className="dropdown-icon-red" />
                        <span>Dijital QR Geçiş Kartım</span>
                      </Link>

                      <Link href="/magaza" className="dropdown-item-link" onClick={() => setProfileDropdownOpen(false)}>
                        <ShoppingBag size={16} className="dropdown-icon-blue" />
                        <span>Kurumsal Mağaza</span>
                      </Link>

                      <Link href="/login" className="dropdown-item-link" onClick={() => setProfileDropdownOpen(false)}>
                        <Sparkles size={16} className="dropdown-icon-gold" />
                        <span>Portalım & Durum</span>
                      </Link>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button 
                      type="button" 
                      onClick={handleSignOut} 
                      className="dropdown-signout-btn"
                    >
                      <LogOut size={16} />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Buttons */
              <>
                <Link href="/login" className="nav-login-btn">Giriş Yap</Link>
                <Link href="/register" className="nav-register-btn">Kayıt Ol</Link>
              </>
            )}

            <button className="search-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara">
              <IconSearch size={22} />
            </button>
            <button className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              <span></span><span></span><span></span>
              <small>MENÜ</small>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="search-bar">
            <div className="container">
              <input type="text" placeholder="Arama yapın... (Örn: Bursluluk, Sayısal, Kıyafet)" autoFocus />
              <button onClick={() => setSearchOpen(false)}><IconClose size={20} /></button>
            </div>
          </div>
        )}

        {/* Mobile & Desktop Main Menu (Hamburger) */}
        <div className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
          <nav>
            {navMenuItems.map((item, i) => (
              <Link href={item.href} key={i} onClick={() => setMenuOpen(false)}>
                {item.title}
              </Link>
            ))}
            {currentUser && userProfile ? (
              <div className="mobile-menu-user-row">
                <Link href="/qr" onClick={() => setMenuOpen(false)} className="mobile-qr-btn">
                  <QrCode size={16} />
                  <span>QR Geçiş Kartı</span>
                </Link>
                <button type="button" onClick={handleSignOut} className="mobile-logout-btn">
                  <LogOut size={16} />
                  <span>Çıkış</span>
                </button>
              </div>
            ) : (
              <div className="mobile-menu-auth-row">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="mobile-nav-login">Giriş Yap</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="mobile-nav-register">Kayıt Ol</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;