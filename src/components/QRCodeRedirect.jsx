"use client";
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, push, update, serverTimestamp as rtdbServerTimestamp } from 'firebase/database';
import { db, rtdb } from '../firebase';
import { sendWhatsAppNotification } from '../services/whatsappService';
import fpPromise from '@fingerprintjs/fingerprintjs';
import { detectIncognito as detectIncognitoLib } from 'detectincognitojs';

// Removed ThemeColorUpdater as it interferes with Safari 15+ native heuristics and causes race conditions.
// Safari iOS 15+ automatically samples the `position: fixed` elements at the top and bottom of the viewport.
// By disabling overscroll, we prevent the native background from leaking and breaking the illusion.

// ============================================================
// V2 SECURITY ENGINE — Composite Fingerprint + Incognito Detection
// ============================================================

// --- Haversine Distance Calculator (meters) ---
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// --- SHA-256 Hash Utility ---
const sha256 = async (str) => {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- Signal 1: Canvas Fingerprint (GPU-level, kendi implementasyonumuz) ---
const getCanvasFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    
    // Complex text rendering (GPU specific)
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '11pt "Times New Roman"';
    ctx.fillText('BGZ Güvenlik Mührü 🔒', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '18pt Arial';
    ctx.fillText('BGZ Güvenlik Mührü 🔒', 4, 45);
    
    // Blend modes
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    return canvas.toDataURL();
  } catch {
    return 'canvas_error';
  }
};

// --- Signal 2: WebGL Renderer String (GPU bilgisi) ---
const getWebGLRenderer = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no_webgl';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return 'no_debug_info';
    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) + '|' + gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
  } catch {
    return 'webgl_error';
  }
};

// --- Signal 3: AudioContext Fingerprint (ses işleme parmak izi) ---
const getAudioFingerprint = () => {
  return new Promise((resolve) => {
    try {
      const AudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!AudioContext) { resolve('no_audio'); return; }
      
      const context = new AudioContext(1, 5000, 44100);
      const oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = 10000;
      
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -50;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0;
      compressor.release.value = 0.25;
      
      oscillator.connect(compressor);
      compressor.connect(context.destination);
      oscillator.start(0);
      
      context.startRendering().then(buffer => {
        const data = buffer.getChannelData(0);
        let sum = 0;
        for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
        resolve(sum.toString());
      }).catch(() => resolve('audio_render_error'));
      
      setTimeout(() => resolve('audio_timeout'), 1000);
    } catch {
      resolve('audio_error');
    }
  });
};

// --- Signal 4: Screen Config ---
const getScreenConfig = () => {
  return `${screen.width}x${screen.height}|${window.devicePixelRatio}|${screen.colorDepth}|${screen.pixelDepth}`;
};

// --- Signal 5: System Config ---
const getSystemConfig = () => {
  return `${Intl.DateTimeFormat().resolvedOptions().timeZone}|${navigator.language}|${navigator.platform}|${navigator.hardwareConcurrency || 'x'}|${navigator.maxTouchPoints || 0}`;
};

// --- Signal 6: Font Enumeration (hızlı yöntem, DOM ölçümleriyle) ---
const getFontFingerprint = () => {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
    'Impact', 'Lucida Console', 'Palatino Linotype', 'Tahoma', 'Times New Roman',
    'Trebuchet MS', 'Verdana', 'Helvetica', 'Gill Sans', 'Futura'
  ];
  
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const span = document.createElement('span');
  span.style.position = 'absolute';
  span.style.left = '-9999px';
  span.style.fontSize = testSize;
  span.textContent = testString;
  document.body.appendChild(span);
  
  const baseSizes = {};
  for (const base of baseFonts) {
    span.style.fontFamily = base;
    baseSizes[base] = span.offsetWidth + ',' + span.offsetHeight;
  }
  
  const detected = [];
  for (const font of testFonts) {
    for (const base of baseFonts) {
      span.style.fontFamily = `"${font}", ${base}`;
      if (span.offsetWidth + ',' + span.offsetHeight !== baseSizes[base]) {
        detected.push(font);
        break;
      }
    }
  }
  
  document.body.removeChild(span);
  return detected.join(',');
};

// --- COMPOSITE DEVICE ID (8 sinyal birleştirme) ---
const generateCompositeDeviceId = async (fpVisitorId, clientIp) => {
  const [audioFp] = await Promise.all([getAudioFingerprint()]);
  
  const signals = [
    fpVisitorId || 'no_fp',                   // 1. FingerprintJS
    getCanvasFingerprint(),                     // 2. Canvas
    getWebGLRenderer(),                         // 3. WebGL
    audioFp,                                    // 4. Audio
    getScreenConfig(),                          // 5. Screen
    getSystemConfig(),                          // 6. System
    clientIp || 'no_ip',                        // 7. IP
    getFontFingerprint()                        // 8. Fonts
  ];
  
  const raw = signals.join('|||');
  const hash = await sha256(raw);
  
  return {
    compositeId: hash,
    signals: signals,
    hardwareId: await sha256(signals.slice(0, 6).join('|||'))
  };
};

// --- STABLE DEVICE ID (TARAYICInın DEĞİŞTİREMEYECEĞİ sinyaller) ---
// Canvas, WebGL, Audio fingerprint'ler Brave/Firefox'ta randomize edilebilir.
// AMA ekran boyutu, CPU çekirdek sayısı, dokunma noktaları, timezone, platform
// HİÇBİR tarayıcı tarafından DEĞİŞTİRİLEMEZ — incognito'da bile aynı kalır.
// IP adresi ile birleşince okul ortamında yeterince unique olur.
const getStableDeviceId = async (clientIp) => {
  const stableSignals = [
    `${screen.width}x${screen.height}`,                    // Ekran çözünürlüğü
    String(window.devicePixelRatio || 1),                   // Piksel yoğunluğu
    String(screen.colorDepth || 24),                        // Renk derinliği  
    navigator.platform || 'unknown',                        // Platform (iPhone, MacIntel, Linux armv8l)
    String(navigator.hardwareConcurrency || 0),             // CPU çekirdek sayısı
    String(navigator.maxTouchPoints || 0),                  // Dokunma noktası sayısı
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',  // Timezone
    navigator.language || '',                                // Dil
    clientIp || 'no_ip'                                     // IP adresi
  ];
  return await sha256(stableSignals.join('|'));
};

// --- ADVANCED OS & HARDWARE DETECTION (CLIENT HINTS + WEBGL BACKDOOR) ---
const getExactDeviceModel = async () => {
  let detectedHardware = 'Bilinmeyen Cihaz';
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/android/i.test(userAgent)) {
    detectedHardware = 'Android Cihaz';
    let uaModel = null;
    let make = '';

    // 1. Ultimate Chrome Backdoor: User-Agent Client Hints API (Kesin Tespit)
    if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
      try {
        const hints = await navigator.userAgentData.getHighEntropyValues(['model', 'make']);
        if (hints.model) {
          uaModel = hints.model;
          make = hints.make || '';
        }
      } catch (e) {}
    }

    // 2. Legacy Regex Fallback
    if (!uaModel) {
      const uaMatch = userAgent.match(/Android\s[0-9\.]+(?:;\s[a-z]{2}-[a-z]{2})?;\s([^;)]+)/i);
      uaModel = (uaMatch && uaMatch[1] && uaMatch[1] !== 'K' && uaMatch[1] !== 'Android') ? uaMatch[1].trim().split(' Build/')[0] : null;
    }

    if (uaModel) {
      detectedHardware = uaModel;
      
      const upperMake = make.toUpperCase();
      if (upperMake.includes('SAMSUNG') || detectedHardware.startsWith('SM-')) {
        let clean = detectedHardware.replace('SM-', '').trim();
        const m = clean.match(/^([A-Z][0-9]{2})/);
        if (m) clean = m[1];
        detectedHardware = 'Samsung ' + clean;
      }
      else {
        // Translation dictionary for common complex alphanumeric models
        const knownModels = {
          '2201117PI': 'Poco M4 Pro',
          '2201117PG': 'Poco M4 Pro',
          '2201117TG': 'Redmi Note 11',
          '2201117TY': 'Redmi Note 11S',
          '2201116SG': 'Poco X4 Pro',
          '22101320G': 'Poco X5 Pro',
          '23049PCD8G': 'Poco F5',
          '2107113SG': 'Xiaomi Mi 11T',
          '2109119DG': 'Xiaomi 11T Lite',
          '22081212UG': 'Xiaomi 12T Pro',
          'CPH2305': 'Oppo Reno 6',
          'CPH2371': 'Oppo Reno 7',
          'CPH2525': 'Oppo Reno 10',
          'RMX3241': 'Realme 8 5G',
          'RMX3363': 'Realme GT Master'
        };

        if (knownModels[detectedHardware]) {
          detectedHardware = knownModels[detectedHardware];
        } else if (upperMake.includes('XIAOMI') || upperMake.includes('POCO') || detectedHardware.startsWith('22') || detectedHardware.startsWith('23') || detectedHardware.startsWith('21') || detectedHardware.startsWith('M2')) {
          detectedHardware = 'Xiaomi/Poco ' + detectedHardware;
        } else if (upperMake.includes('OPPO') || detectedHardware.startsWith('CPH') || detectedHardware.startsWith('PDK')) {
          detectedHardware = 'Oppo ' + detectedHardware;
        } else if (upperMake.includes('REALME') || detectedHardware.startsWith('RMX')) {
          detectedHardware = 'Realme ' + detectedHardware;
        } else if (upperMake.includes('VIVO') || detectedHardware.startsWith('V2')) {
          detectedHardware = 'Vivo ' + detectedHardware;
        } else if (upperMake.includes('HUAWEI') || detectedHardware.startsWith('MAR-') || detectedHardware.startsWith('VOG-')) {
          detectedHardware = 'Huawei ' + detectedHardware;
        } else if (make) {
          detectedHardware = make.charAt(0).toUpperCase() + make.slice(1) + ' ' + detectedHardware;
        }
      }
    }

    // 2. Fallback to WebGL GPU parsing (clean ANGLE wrapper)
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) {
          let renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
          
          // Clean Chrome's ANGLE wrapper: "ANGLE (ARM, Mali-G52, OpenGL ES)" -> "Mali-G52"
          if (renderer.includes('ANGLE (')) {
            const parts = renderer.split(',');
            if (parts.length > 1) renderer = parts[1].trim();
          }

          if (!uaModel) {
            // No User-Agent model, rely on GPU
            const gpu = renderer.toLowerCase();
            if (gpu.includes('adreno (tm) 750')) detectedHardware = 'Samsung Galaxy S24';
            else if (gpu.includes('adreno (tm) 740')) detectedHardware = 'Samsung Galaxy S23';
            else if (gpu.includes('adreno (tm) 730')) detectedHardware = 'Samsung Galaxy S22';
            else if (gpu.includes('adreno (tm) 660')) detectedHardware = 'Xiaomi Mi 11';
            else if (gpu.includes('adreno (tm) 650')) detectedHardware = 'Poco F2 Pro';
            else if (gpu.includes('adreno (tm) 640')) detectedHardware = 'Samsung Galaxy S10';
            else if (gpu.includes('adreno (tm) 619')) detectedHardware = 'Redmi Note 12';
            else if (gpu.includes('adreno (tm) 618')) detectedHardware = 'Redmi Note 10 Pro';
            else if (gpu.includes('adreno (tm) 610')) detectedHardware = 'Oppo A77';
            else if (gpu.includes('xclipse 920')) detectedHardware = 'Samsung Galaxy S22';
            else if (gpu.includes('xclipse 940')) detectedHardware = 'Samsung Galaxy S24';
            else if (gpu.includes('mali-g715')) detectedHardware = 'Vivo X90';
            else if (gpu.includes('mali-g710')) detectedHardware = 'Oppo Find X5';
            else if (gpu.includes('mali-g78')) detectedHardware = 'Huawei P50';
            else if (gpu.includes('mali-g77')) detectedHardware = 'Samsung Galaxy S20';
            else if (gpu.includes('mali-g76')) detectedHardware = 'Redmi Note 10S';
            else if (gpu.includes('mali-g68')) detectedHardware = 'Samsung Galaxy A54';
            else if (gpu.includes('mali-g57 mc2')) detectedHardware = 'Poco M4 Pro';
            else if (gpu.includes('mali-g57')) detectedHardware = 'Realme 8 5G';
            else if (gpu.includes('mali-g52 mc2')) detectedHardware = 'Redmi Note 9';
            else if (gpu.includes('mali-g52')) detectedHardware = 'Samsung Galaxy A32';
            else if (gpu.includes('powervr roguer ge8320')) detectedHardware = 'Redmi 9A';
            else detectedHardware = 'Android';
          }
        }
      }
    } catch (e) {}
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    detectedHardware = 'iOS';
  }

  return detectedHardware;
};

// --- INCOGNITO DETECTION V5 (Zero False Positives) ---
// Yalnızca kesin (deterministic) kütüphane testlerine güvenir.
const detectIncognito = async (hardwareId) => {
  let score = 100;
  const flags = [];

  try {
    const result = await detectIncognitoLib();
    if (result.isPrivate) {
      score = 0;
      flags.push(`lib_detected_${result.browserName}`);
      return { score: 0, flags, isIncognito: true };
    } else {
      flags.push(`lib_cleared_${result.browserName}`);
    }
  } catch (e) {
    flags.push('lib_error');
  }

  // İlk giriş kontrolü (Loglama amaçlı)
  try {
    const seen = localStorage.getItem('__bgz_first_seen');
    if (!seen) {
      localStorage.setItem('__bgz_first_seen', Date.now().toString());
      flags.push('empty_ls');
    }
  } catch {
    flags.push('ls_blocked');
  }

  return { score: Math.max(0, score), flags, isIncognito: score <= 50 };
};


// --- AUTO-LOGIN: IndexedDB Hybrid Storage ---
const IDB_NAME = '__bgz_vault';
const IDB_STORE = 'auth';

const idbOpen = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const idb = e.target.result;
      if (!idb.objectStoreNames.contains(IDB_STORE)) {
        idb.createObjectStore(IDB_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (key, value) => {
  try {
    const idb = await idbOpen();
    const tx = idb.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put({ key, value, ts: Date.now() });
    idb.close();
  } catch { /* silent */ }
};

const idbGet = async (key) => {
  try {
    const idb = await idbOpen();
    return new Promise((resolve) => {
      const tx = idb.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => { idb.close(); resolve(req.result?.value || null); };
      req.onerror = () => { idb.close(); resolve(null); };
    });
  } catch { return null; }
};

const saveAutoLogin = async (studentData, hardwareId) => {
  const payload = {
    id: studentData.id,
    name: studentData.name,
    photo: studentData.photo,
    tc: studentData.tc,
    hardwareId,
    savedAt: Date.now()
  };
  try { localStorage.setItem('__bgz_auto_login', JSON.stringify(payload)); } catch {}
  await idbSet('auto_login', payload);
};

const getAutoLogin = async (currentHardwareId) => {
  // Try localStorage first (faster)
  try {
    const ls = localStorage.getItem('__bgz_auto_login');
    if (ls) {
      const data = JSON.parse(ls);
      // Hardware ID eşleşmeli (başka cihazda çalışmamalı)
      if (data.hardwareId === currentHardwareId) return data;
    }
  } catch {}
  
  // Fallback to IndexedDB (Safari ITP sonrası localStorage silinmiş olabilir)
  const idbData = await idbGet('auto_login');
  if (idbData && idbData.hardwareId === currentHardwareId) return idbData;
  
  return null;
};

// --- RATE LIMITING (Client-Side) ---
const checkRateLimit = () => {
  try {
    const key = '__bgz_rate';
    const raw = localStorage.getItem(key);
    const now = Date.now();
    let attempts = raw ? JSON.parse(raw) : [];
    
    // Son 3 dakikadaki denemeleri filtrele
    attempts = attempts.filter(t => (now - t) < 3 * 60 * 1000);
    
    if (attempts.length >= 5) {
      return { blocked: true, remaining: Math.ceil((attempts[0] + 3 * 60 * 1000 - now) / 1000) };
    }
    
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));
    return { blocked: false };
  } catch {
    return { blocked: false };
  }
};

// ============================================================
// Isometric Cube component (UI)
// ============================================================
const Cube = ({ x, y, z = 0 }) => {
  const cx = x - 3.5;
  const cy = y - 3.5;
  const isoX = (cx - cy) * 8.66;
  const isoY = (cx + cy) * 5 - z * 10;
  const colorTop = '#3b82f6';
  const colorLeft = '#1e3a8a';
  const colorRight = '#0f172a';
  return (
    <g transform={`translate(${isoX}, ${isoY})`}>
      <polygon points="0,-5 8.66,0 0,5 -8.66,0" fill={colorTop} stroke={colorTop} strokeWidth="0.5" />
      <polygon points="-8.66,0 0,5 0,15 -8.66,10" fill={colorLeft} stroke={colorLeft} strokeWidth="0.5" />
      <polygon points="0,5 8.66,0 8.66,10 0,15" fill={colorRight} stroke={colorRight} strokeWidth="0.5" />
    </g>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
// ThemeColorUpdater component ensures the Safari status bar and overscroll colors match the gradient background
const ThemeColorUpdater = ({ topColor, bottomColor }) => {
  React.useEffect(() => {
    // 1. Update html and body - the fallback Safari samples for overscroll/address bar
    document.documentElement.style.setProperty("background-color", topColor, "important");
    document.body.style.setProperty("background-color", bottomColor, "important");
    
    // 2. Update ALL theme-color metas (avoids the stale-duplicate trap)
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    if (metas.length === 0) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = topColor;
      document.head.appendChild(meta);
    } else {
      metas.forEach((meta) => (meta.content = topColor));
    }

    const root = document.getElementById('root');
    if (root) {
      root.style.setProperty("background-color", "transparent", "important");
    }

    return () => {
      // Cleanup on unmount
      document.documentElement.style.removeProperty("background-color");
      document.body.style.removeProperty("background-color");
    };
  }, [topColor, bottomColor]);

  return null;
};

const QRCodeRedirect = () => {
  const [params, setParams] = useState('');
  const [storeLink, setStoreLink] = useState('#');
  const [osName, setOsName] = useState('');
  
  // Security
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [pageError, setPageError] = useState("");
  const [isLinkValidated, setIsLinkValidated] = useState(false);

  // V2 Security Engine
  const [compositeId, setCompositeId] = useState('');
  const [hardwareId, setHardwareId] = useState('');
  const [incognitoScore, setIncognitoScore] = useState(100);
  const [incognitoFlags, setIncognitoFlags] = useState([]);
  const [clientIp, setClientIp] = useState('');

  // Auto-Login
  const [autoLoginStudent, setAutoLoginStudent] = useState(null);
  const [autoLoginReady, setAutoLoginReady] = useState(false);

  // Web Fallback States
  const [showFallback, setShowFallback] = useState(false);
  const [geoStatus, setGeoStatus] = useState('idle');
  const [tcInput, setTcInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [student, setStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("Yoklamanız başarıyla alındı.");
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  const blocks = [
    {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1, z: 1}, {x: 2, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2},
    {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 5, y: 1}, {x: 6, y: 1, z: 1}, {x: 7, y: 1}, {x: 5, y: 2}, {x: 6, y: 2}, {x: 7, y: 2},
    {x: 0, y: 5}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 0, y: 6}, {x: 1, y: 6, z: 1}, {x: 2, y: 6}, {x: 0, y: 7}, {x: 1, y: 7}, {x: 2, y: 7},
    {x: 3, y: 3, z: 0.5}, {x: 4, y: 3}, {x: 4, y: 4, z: 1}, {x: 6, y: 4}, {x: 7, y: 4, z: 0.5}, {x: 5, y: 5}, {x: 4, y: 6}, {x: 6, y: 6, z: 1}, {x: 7, y: 7}, {x: 3, y: 5}, {x: 5, y: 7, z: 0.5}
  ];
  blocks.sort((a, b) => (a.x + a.y) - (b.x + b.y));

  const [cachedStudents, setCachedStudents] = useState([]);

  // ============================================================
  // INITIALIZATION
  // ============================================================
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    setParams(window.location.search);
    
    // === V2 SECURITY ENGINE INITIALIZATION ===
    const initSecurityEngine = async () => {
      let fpId = '';
      let ip = '';
      
      // 1. IP Address (arka planda, hızlı)
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
        setClientIp(ip);
      } catch { /* silent */ }
      
      // 2. FingerprintJS (ana sinyal)
      try {
        const fp = await fpPromise.load();
        const result = await fp.get();
        fpId = result.visitorId;
      } catch {
        fpId = 'fp_error_' + Math.random().toString(36).substring(2, 10);
      }
      
      // 3. Composite Device ID (8 sinyal)
      const composite = await generateCompositeDeviceId(fpId, ip);
      setCompositeId(composite.compositeId);
      setHardwareId(composite.hardwareId);
      
      // localStorage'a da yaz (handleTcChange'de kullanmak için)
      localStorage.setItem('__bgz_composite_id', composite.compositeId);
      localStorage.setItem('__bgz_hardware_id', composite.hardwareId);
      localStorage.setItem('__bgz_full_visitor_id', composite.hardwareId);
      
      // 3b. Stable Device ID (incognito-proof)
      const stableId = await getStableDeviceId(ip);
      localStorage.setItem('__bgz_stable_id', stableId);
      
      // 4. Incognito Detection
      const incognito = await detectIncognito(composite.hardwareId);
      setIncognitoScore(incognito.score);
      setIncognitoFlags(incognito.flags);
      
      if (incognito.isIncognito) {
        setPageError("Güvenlik İhlali: Tarayıcınızın Gizli Sekme (Incognito/Private) modunda olduğu tespit edildi. Sistem güvenliği gereği yoklama işlemi gizli sekmelerden yapılamaz. Lütfen normal tarayıcı modunu kullanın.");
        return;
      }
      
      // 5. Auto-Login Check (hardware ID ile eşleştir)
      const saved = await getAutoLogin(composite.hardwareId);
      if (saved && incognito.score >= 50) {
        // Incognito'da auto-login ÇALIŞMAZ (score düşük olacak)
        setAutoLoginStudent(saved);
      }
      setAutoLoginReady(true);
      
      // === STRICT URL CLAIM (1 URL 1 BROWSER + RELOAD PROTECTION) ===
      const urlParamsForClaim = new URLSearchParams(window.location.search);
      const urlSessionId = urlParamsForClaim.get('sessionId');
      
      if (urlSessionId && urlSessionId !== 'web_fallback') {
        // Refresh (sayfa yenileme) tespiti
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0 && navEntries[0].type === "reload") {
           setPageError("Güvenlik Kuralı: Sayfa yenilendiği için bu bağlantı güvenlik gereği iptal edilmiştir. Lütfen karekodu tekrar okutun.");
           return;
        }

        try {
          const urlClaimRef = doc(db, 'url_claims', urlSessionId);
          const urlClaimSnap = await getDoc(urlClaimRef);
          
          if (urlClaimSnap.exists()) {
            const claimData = urlClaimSnap.data();
            
            // Başka cihaza kopyalandıysa
            if (claimData.hardwareId !== composite.hardwareId) {
              setPageError("Güvenlik İhlali: Bu bağlantı halihazırda başka bir cihaz tarafından kullanıma açılmış. URL paylaşımı yasaktır.");
              return; // Anında blokla
            }
            
            // Kendi cihazında ama üzerinden süre geçtiyse (link kopyalanıp yeni tabde açıldıysa)
            if (claimData.localClaimedAt && (Date.now() - claimData.localClaimedAt > 5000)) {
              setPageError("Güvenlik İhlali: Bu bağlantı daha önce kullanılmıştır. Lütfen karekodu yeniden okutun.");
              return;
            }
          } else {
            // URL'yi bu cihazın üzerine kaydet (Claim)
            await setDoc(urlClaimRef, {
              hardwareId: composite.hardwareId,
              claimedAt: serverTimestamp(),
              localClaimedAt: Date.now(),
              ipAddress: ip
            });
          }
        } catch { /* Ağ hatası */ }
      }
      
      // Güvenlik motoru testleri bitti, UI artık gösterilebilir.
      setIsLinkValidated(true);
    };
    initSecurityEngine();
    
    // === NONCE VALIDATION (arka planda) ===
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');
    const qrType = urlParams.get('type');
    
    if (qrType && sessionId && sessionId !== 'web_fallback') {
      const checkAndClaimLink = async () => {
         try {
           const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000));
           const qrAction = urlParams.get('action') || 'entry';
           const nonceKey = qrAction === 'exit' ? 'current_exit' : 'current_entry';
           const activeSnap = await Promise.race([getDoc(doc(db, 'active_qr_nonce', nonceKey)), timeoutPromise]);
           
           const data = activeSnap.exists() ? activeSnap.data() : null;
           const isValidNonce = data && (data.nonce === sessionId || (data.validNonces && data.validNonces.includes(sessionId)));

           if (!isValidNonce) {
              setPageError(`Bu karekodun süresi dolmuş veya başkası tarafından çekilmiş bir fotoğraf. Lütfen güncel karekodu okutun.`);
              return;
           }
         } catch (error) {
           setPageError(`Güvenlik doğrulaması yapılamadı. Hata: ${error.message}`);
         }
      };
      checkAndClaimLink();
    }

    // === PRE-FETCH STUDENTS ===
    const prefetchStudents = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "in", ["student", "öğrenci"]));
        const snap = await getDocs(q);
        const students = [];
        window.__bgz_image_cache__ = window.__bgz_image_cache__ || [];

        snap.forEach(doc => {
          const data = doc.data();
          students.push({ id: doc.id, ...data });

          const nameKeys = ["full_name", "fullName", "name", "displayName", "display_name"];
          let name = "İsimsiz";
          for (let k of nameKeys) {
            if (data[k]) { name = data[k]; break; }
          }
          
          const photoUrl = data.profile_image || data.profileImageUrl || data.profileImage || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a8a&color=fff&size=200&bold=true`;
          
          const img = new Image();
          img.src = photoUrl;
          window.__bgz_image_cache__.push(img);
        });
        
        setCachedStudents(students);
      } catch (err) {
        console.error("Öğrenciler önbelleğe alınamadı:", err);
      }
    };
    prefetchStudents();

    // === ADVANCED OS & HARDWARE DETECTION ===
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      setStoreLink('https://play.google.com/store/apps/details?id=com.ial.mobil');
      setOsName('Android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setStoreLink('https://apps.apple.com/tr/app/id123456789');
      setOsName('iOS');
    }

    // === 60s EXPIRY TIMER ===
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // OPEN IN APP
  // ============================================================
  const openInApp = () => {
    window.location.href = `ialmobil://qr${params}`;
  };

  // ============================================================
  // GEO FALLBACK
  // ============================================================
  const startFallback = async () => {
    setShowFallback(true);
    setGeoStatus('checking');
    
    try {
      const settingsRef = doc(db, 'system_settings', 'general');
      const settingsSnap = await getDoc(settingsRef);
      
      let TARGET_LAT = 41.0422;
      let TARGET_LNG = 29.0083;
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        if (data.institutionLat && data.institutionLng) {
          TARGET_LAT = parseFloat(data.institutionLat);
          TARGET_LNG = parseFloat(data.institutionLng);
        }
      }

      // location checks bypassed per user request
      setGeoStatus('allowed');
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setGeoStatus('allowed');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // ============================================================
  // AUTO-LOGIN CONFIRM (tek tıkla onay)
  // ============================================================
  const handleAutoLoginConfirm = async () => {
    if (!autoLoginStudent) return;
    setIsVerifying(true);
    
    try {
      const fakeStudent = {
        id: autoLoginStudent.id,
        name: autoLoginStudent.name,
        photo: autoLoginStudent.photo,
        tc: autoLoginStudent.tc
      };
      
      await processAttendance(fakeStudent);
    } finally {
      setIsVerifying(false); // In case of error or completion (though completion usually redirects)
    }
  };

  // ============================================================
  // PROCESS ATTENDANCE (ortak fonksiyon: hem TC girişi hem auto-login)
  // ============================================================
  const processAttendance = async (foundStudent) => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrType = urlParams.get('type') || 'institution';
    const currentSessionId = urlParams.get('sessionId') || 'web_fallback';
    const action = urlParams.get('action') || 'toggle';

    setIsVerifying(true);
    
    try {
        const payload = {
            tc: foundStudent.tc || foundStudent.tc_kimlik || foundStudent.tcNo || foundStudent.tcKimlik || foundStudent.identityNumber,
            sessionId: currentSessionId,
            qrType: qrType,
            action: action,
            incognitoScore: incognitoScore,
            clientIp: clientIp || 'unknown',
            hardwareId: hardwareId || localStorage.getItem('__bgz_hardware_id') || 'unknown',
            deviceId: hardwareId || localStorage.getItem('__bgz_hardware_id') || 'unknown',
            stableId: localStorage.getItem('__bgz_stable_id') || 'unknown',
            deviceOs: osName || 'unknown'
        };

        const res = await fetch('http://213.142.159.36:8080/api/qr/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!data.success) {
            setPageError(data.error || "Bilinmeyen bir hata oluştu.");
            setIsVerifying(false);
            setTcInput('');
            return;
        }

        setStudent(data.student);
        setSuccessMessage(data.message || "Yoklamanız başarıyla alındı.");
        
        if (data.student) {
            saveAutoLogin(data.student, payload.hardwareId);
        }

        setTimeout(() => {
            window.location.href = 'https://www.bogaziciyonetim.com';
        }, 4000);

    } catch (err) {
        console.error("VDS API Hatası:", err);
        setPageError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
        setIsVerifying(false);
        setTcInput('');
    }
  };

  // ============================================================
  // TC INPUT HANDLER
  // ============================================================
  const handleTcChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setTcInput(val);

    if (val.length === 4) {
      // Rate Limiting
      const rateCheck = checkRateLimit();
      if (rateCheck.blocked) {
        alert(`Çok fazla deneme yaptınız. ${rateCheck.remaining} saniye bekleyin.`);
        setTcInput('');
        return;
      }

      setIsVerifying(true);
      
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const currentSessionId = urlParams.get('sessionId') || 'web_fallback';
        const qrType = urlParams.get('type') || 'institution';
        const action = urlParams.get('action') || 'toggle';

        const payload = {
            tc: val,
            sessionId: currentSessionId,
            qrType: qrType,
            action: action,
            incognitoScore: incognitoScore,
            clientIp: clientIp || 'unknown',
            hardwareId: hardwareId || localStorage.getItem('__bgz_hardware_id') || 'unknown',
            deviceId: hardwareId || localStorage.getItem('__bgz_hardware_id') || 'unknown',
            stableId: localStorage.getItem('__bgz_stable_id') || 'unknown',
            deviceOs: osName || 'unknown'
        };

        const res = await fetch('http://213.142.159.36:8080/api/qr/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!data.success) {
            setPageError(data.error || "Bilinmeyen bir hata oluştu.");
            setIsVerifying(false);
            setTcInput('');
            return;
        }

        setStudent(data.student);
        setSuccessMessage(data.message || "Yoklamanız başarıyla alındı.");
        
        // Cihaza kaydet
        if (data.student) {
            saveAutoLogin(data.student, payload.hardwareId);
        }

        setTimeout(() => {
            window.location.href = 'https://www.bogaziciyonetim.com';
        }, 4000);

      } catch (err) {
        console.error("VDS API Hatası:", err);
        setPageError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
        setIsVerifying(false);
        setTcInput('');
      }
    }
  };

  // ============================================================
  // RENDER: EXPIRED
  // ============================================================
  if (isExpired) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e3a8a', fontFamily: 'Inter, sans-serif', color: 'white', textAlign: 'center', padding: '20px' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 style={{ margin: '0 0 10px', fontSize: '24px', color: '#ffffff' }}>Karekod Süresi Doldu</h2>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '15px' }}>Güvenlik nedeniyle bu karekod imha edilmiştir. Lütfen yeni bir karekod okutunuz.</p>
      </div>
    );
  }

  // ============================================================
  // RENDER: PAGE ERROR
  // ============================================================
  if (pageError) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e3a8a', fontFamily: 'Inter, sans-serif', color: 'white', textAlign: 'center', padding: '20px', overflow: 'hidden' }}>
        <div style={{ position: 'relative', marginBottom: '36px', zIndex: 10 }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '24px', backgroundColor: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', transform: 'rotate(-5deg)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: '800', color: '#ffffff', zIndex: 10 }}>
          Erişim Reddedildi
        </h2>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', padding: '16px 24px', borderRadius: '16px', fontSize: '15px', fontWeight: '600', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 10, maxWidth: '300px', lineHeight: '1.4' }}>
          {pageError}
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER: VALIDATION LOADING
  // ============================================================
  if (!isLinkValidated) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e3a8a', color: 'white' }}>
        <style>
          {`
            @keyframes pulseFast {
              0% { transform: scale(0.9); opacity: 0.5; }
              50% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(0.9); opacity: 0.5; }
            }
          `}
        </style>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', animation: 'pulseFast 1s infinite' }}></div>
        <p style={{ marginTop: '20px', fontWeight: '600', fontSize: '15px' }}>Güvenlik doğrulaması yapılıyor...</p>
      </div>
    );
  }

  // ============================================================
  // RENDER: STUDENT RESULT
  // ============================================================
  if (student) {
    const isWarning = successMessage.includes("Zaten") || successMessage.includes("Önce") || successMessage.includes("Güvenlik") || successMessage.includes("süresi");
    const isCheckout = successMessage.toLowerCase().includes('çık');

    let subText = "Bu işlem zaten kayıt altına alınmış. Çift geçiş yapmanıza gerek yoktur.";
    if (successMessage.includes("Önce")) {
      subText = "Giriş yapmadan çıkış yapamazsınız.";
    } else if (successMessage.includes("Güvenlik") || successMessage.includes("süresi")) {
      subText = "Karekod okutma işlemi sırasında bir güvenlik kuralı ihlali tespit edildi.";
    }

    // Modern Full-Screen Status Gradient Colors
    const headerColor = isWarning 
      ? 'linear-gradient(180deg, #ea580c 0%, #9a3412 100%)' // Rich Orange gradient for warnings
      : (isCheckout 
          ? 'linear-gradient(180deg, #be123c 0%, #7f1d1d 100%)' // Deep Burgundy gradient for checkout
          : 'linear-gradient(180deg, #10b981 0%, #047857 100%)'); // Rich Emerald gradient for checkin

    const themeColorHex = isWarning ? '#ea580c' : (isCheckout ? '#be123c' : '#10b981');
    const baseBg = isWarning ? '#9a3412' : (isCheckout ? '#7f1d1d' : '#047857'); // Deep matching color for bottom overscroll

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: headerColor, fontFamily: 'Inter, sans-serif', color: 'white', textAlign: 'center', overflow: 'hidden' }}>
        <ThemeColorUpdater topColor={themeColorHex} bottomColor={baseBg} />
        {/* Inner container to restore padding for content without clipping absolute backgrounds */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100%', zIndex: 10 }}>
        

        <style>
          {`
            @keyframes clayFloat {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(2deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
            @keyframes float3D {
              0% { transform: translateY(0px) rotate(0deg) scale(1); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); }
              50% { transform: translateY(-25px) rotate(8deg) scale(1.05); filter: drop-shadow(0 30px 35px rgba(0,0,0,0.25)); }
              100% { transform: translateY(0px) rotate(0deg) scale(1); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); }
            }
            @keyframes float3DReverse {
              0% { transform: translateY(0px) rotate(0deg) scale(1); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); }
              50% { transform: translateY(20px) rotate(-8deg) scale(0.95); filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1)); }
              100% { transform: translateY(0px) rotate(0deg) scale(1); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); }
            }
          `}
        </style>

        {/* Floating 3D Background Objects - TOP AREA */}
        <div style={{
          position: 'absolute', top: '8%', left: '8%', zIndex: 2,
          width: '65px', height: '65px', borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.05) 100%)',
          boxShadow: 'inset -5px -5px 15px rgba(255,255,255,0.2), inset 5px 5px 15px rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          animation: 'float3D 6s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute', top: '15%', right: '5%', zIndex: 2,
          width: '85px', height: '85px', borderRadius: '50%',
          border: '16px solid rgba(255,255,255,0.25)',
          boxShadow: 'inset 0 5px 15px rgba(255,255,255,0.6), inset 0 -5px 15px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(8px)',
          animation: 'float3DReverse 8s ease-in-out infinite'
        }}></div>

        {/* Floating 3D Background Objects - BOTTOM AREA */}
        <div style={{
          position: 'absolute', bottom: '15%', left: '3%', zIndex: 2,
          width: '45px', height: '110px', borderRadius: '40px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)',
          boxShadow: 'inset -4px -4px 10px rgba(255,255,255,0.2), inset 4px 4px 20px rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          animation: 'float3DReverse 7s ease-in-out infinite',
          transform: 'rotate(-25deg)' // Initial rotation offset
        }}></div>

        <div style={{
          position: 'absolute', bottom: '25%', right: '6%', zIndex: 2,
          width: '75px', height: '75px', borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)',
          boxShadow: 'inset -2px -2px 10px rgba(255,255,255,0.2), inset 4px 4px 20px rgba(255,255,255,0.7)',
          backdropFilter: 'blur(15px)',
          animation: 'float3D 9s ease-in-out infinite'
        }}></div>

        <div style={{ position: 'relative', marginBottom: isWarning ? '36px' : '24px', zIndex: 10, marginTop: '20px' }}>
          <img src={student.photo} alt="Profile" style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 15px 35px rgba(0,0,0,0.25)' }} />
          
          {isWarning ? (
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', backgroundColor: '#ef4444', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #ffffff', zIndex: 11, animation: 'clayFloat 3s ease-in-out infinite' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
          ) : (
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', backgroundColor: isCheckout ? '#e11d48' : '#10b981', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #ffffff', zIndex: 11 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {isCheckout ? (
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                ) : (
                  <polyline points="20 6 9 17 4 12"></polyline>
                )}
              </svg>
            </div>
          )}
        </div>
        
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800', color: '#ffffff', zIndex: 10 }}>
          {isWarning 
            ? 'Bir Saniye!' 
            : (isCheckout ? 'Görüşmek Üzere' : 'Hoş geldiniz')}
        </h2>
        
        <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', zIndex: 10 }}>
          {student.name}
        </h3>
        
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          color: '#ffffff', 
          padding: '16px 24px', 
          borderRadius: '16px', 
          fontSize: '15px', 
          fontWeight: '600', 
          textAlign: 'center', 
          border: '1px solid rgba(255,255,255,0.25)', 
          backdropFilter: 'blur(12px)', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', 
          zIndex: 10, 
          maxWidth: '300px', 
          lineHeight: '1.4' 
        }}>
          {successMessage}
        </div>

        {isWarning && (
          <div style={{ marginTop: '24px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '280px', lineHeight: '1.5', zIndex: 10, fontWeight: '500' }}>
            {subText}
          </div>
        )}
        </div> {/* End of inner padding container */}
      </div>
    );
  }

  // ============================================================
  // RENDER: MAIN QR PAGE
  // ============================================================
  return (
    <div style={{
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e3a8a',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      <ThemeColorUpdater topColor="#f8fafc" bottomColor="#1e3a8a" />
      <style>
        {`
          @keyframes floatVolumetric {
            0% { transform: translateY(0px); filter: drop-shadow(0 15px 10px rgba(30,58,138,0.2)); }
            50% { transform: translateY(-8px); filter: drop-shadow(0 25px 15px rgba(30,58,138,0.15)); }
            100% { transform: translateY(0px); filter: drop-shadow(0 15px 10px rgba(30,58,138,0.2)); }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(159, 18, 57, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(159, 18, 57, 0); }
            100% { box-shadow: 0 0 0 0 rgba(159, 18, 57, 0); }
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
      {/* Top Bright Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '40vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        overflow: 'hidden'
      }}>
        {/* Timer Badge */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(159,18,57,0.1)', color: '#9f1239', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', animation: timeLeft <= 10 ? 'pulseGlow 1.5s infinite' : 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>

        <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(159,18,57,0.06) 0%, rgba(159,18,57,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(30,58,138,0.06) 0%, rgba(30,58,138,0) 70%)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', animation: 'floatVolumetric 4s ease-in-out infinite', marginBottom: '20px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" viewBox="-60 -50 120 100">
              {blocks.map((block, i) => <Cube key={i} x={block.x} y={block.y} z={block.z || 0} />)}
            </svg>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>BGZ <span style={{ color: '#9f1239' }}>Mobil</span></h1>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Güvenli Geçiş</p>
        </div>
      </div>

      {/* Bottom Navy Section */}
      <div style={{
        position: 'relative',
        flex: 1,
        backgroundColor: '#1e3a8a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 24px calc(30px + env(safe-area-inset-bottom, 20px))',
        zIndex: 10
      }}>

        <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '10px' }}>
          {!showFallback ? (
            <>
              <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 12px', letterSpacing: '-0.3px' }}>Karekod Okundu</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: '1.5', margin: '0 0 32px', fontWeight: '500' }}>Bu işlemi tamamlayabilmek için <strong style={{ color: '#ffffff', fontWeight: '700' }}>BGZ Mobil</strong> uygulamasını açmalısınız.</p>

              <button onClick={openInApp} style={{ width: '100%', padding: '16px', backgroundColor: '#ffffff', color: '#1e3a8a', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', transition: 'all 0.2s ease' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Uygulamada Aç
              </button>

              <a href={storeLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', boxSizing: 'border-box', marginBottom: '30px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Uygulamayı İndir {osName && `(${osName})`}
              </a>

              <button onClick={startFallback} style={{ background: 'none', border: 'none', color: '#93c5fd', textDecoration: 'underline', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Uygulamanız yok mu? Tarayıcıdan onaylayın.
              </button>
            </>
          ) : (
            <div style={{ width: '100%', animation: 'floatVolumetric 0.3s ease-out' }}>
              <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '0 0 20px' }}>{(() => {
                const urlP = new URLSearchParams(window.location.search);
                const t = urlP.get('type');
                const a = urlP.get('action');
                if (t === 'attendance' || t === 'yoklama') return 'Web Yoklama Ekranı';
                if (a === 'exit') return 'Web Çıkış Ekranı';
                return 'Web Kurum Giriş Ekranı';
              })()}</h2>
              
              {geoStatus === 'allowed' && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#86efac', fontSize: '14px', fontWeight: '500', marginBottom: '24px', letterSpacing: '0.3px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Konum Doğrulandı
                </div>
              )}
              
              {geoStatus === 'checking' && (
                <div style={{ color: '#93c5fd', padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulseGlow 2s infinite' }}><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>
                  Güvenlik için konumunuz doğrulanıyor...
                </div>
              )}

              {geoStatus === 'far' && (
                <div style={{ color: '#fca5a5', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  Kurum konumundan uzaktasınız. Yoklama işlemi buradan yapılamaz.
                </div>
              )}

              {geoStatus === 'timeout' && (
                <div style={{ color: '#fca5a5', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  Konum tespiti çok uzun sürdü veya sinyal alınamadı.
                  <button onClick={startFallback} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Tekrar Dene</button>
                </div>
              )}

              {geoStatus === 'denied' && (
                <div style={{ color: '#fca5a5', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <strong>Konum izni reddedildi.</strong> 
                  Sistem güvenliği gereği konum izni olmadan geçiş yapamazsınız. Tarayıcınızın ayarlarından konum iznini aktif edip sayfayı yenileyiniz.
                  <button onClick={() => window.location.reload()} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' }}>Sayfayı Yenile</button>
                </div>
              )}

              {geoStatus === 'allowed' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {isVerifying ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '10px 0', width: '100%', animation: 'fadeIn 0.3s ease' }}>
                       <style>
                         {`
                           @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                           @keyframes particleFade {
                             0% { opacity: 1; fill: #10b981; transform: scale(1.1); }
                             100% { opacity: 0.2; fill: #022c22; transform: scale(0.9); }
                           }
                         `}
                       </style>
                       <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <svg width="70" height="70" viewBox="0 0 100 100">
                           {[...Array(12)].map((_, i) => (
                             <g key={i} style={{ transformOrigin: '50px 50px', transform: `rotate(${i * 30}deg)` }}>
                               <circle 
                                 cx="50" 
                                 cy="14" 
                                 r="7" 
                                 style={{
                                   transformOrigin: '50px 14px',
                                   animation: `particleFade 1.2s linear infinite`,
                                   animationDelay: `${(i - 12) * 0.1}s`,
                                 }}
                               />
                             </g>
                           ))}
                         </svg>
                       </div>
                       <div style={{ textAlign: 'center' }}>
                         <h3 style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '18px', fontWeight: '600', letterSpacing: '-0.3px' }}>İşleminiz Gerçekleştiriliyor</h3>
                         <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Lütfen bekleyin, bilgileriniz doğrulanıyor...</p>
                       </div>
                    </div>
                  ) : autoLoginReady && autoLoginStudent ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
                      <img src={autoLoginStudent.photo} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
                      <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0, letterSpacing: '-0.3px' }}>{autoLoginStudent.name}</p>
                      
                      <button 
                        onClick={handleAutoLoginConfirm}
                        style={{ 
                          width: '100%', 
                          padding: '16px 32px', 
                          backgroundColor: '#10b981', 
                          color: '#ffffff', 
                          border: 'none', 
                          borderRadius: '9999px', 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          letterSpacing: '-0.3px',
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '8px', 
                          marginTop: '12px', 
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Otomatik Girişi Onayla
                      </button>
                      
                      <button 
                        onClick={() => setAutoLoginStudent(null)}
                        style={{ background: 'none', border: 'none', color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginTop: '4px', transition: 'color 0.2s ease' }}
                        onMouseOver={(e) => e.target.style.color = '#ffffff'}
                        onMouseOut={(e) => e.target.style.color = '#cbd5e1'}
                      >
                        Farklı bir hesapla giriş yap
                      </button>
                    </div>
                  ) : (
                    <>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: '0 0 24px', fontWeight: '500', lineHeight: '1.5' }}>TC Kimlik Numaranızın <strong style={{color: 'white'}}>son 4 hanesini</strong> giriniz</p>
                      
                      {/* Elegant 4-digit PIN input */}
                      <div 
                        style={{ position: 'relative', display: 'flex', gap: '12px', marginBottom: '8px', cursor: 'text', WebkitTapHighlightColor: 'transparent' }}
                      >
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} style={{
                            width: '52px',
                            height: '64px',
                            borderRadius: '14px',
                            backgroundColor: tcInput[i] ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                            border: tcInput[i] ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}>
                            {tcInput[i] ? (
                              <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ffffff' }}></div>
                            ) : (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Hidden actual input */}
                      <input
                        ref={inputRef}
                        type="tel"
                        inputMode="numeric"
                        maxLength={4}
                        autoComplete="off"
                        value={tcInput}
                        onChange={handleTcChange}
                        onFocus={(e) => {
                          setIsFocused(true);
                          setTimeout(() => {
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 350);
                        }}
                        onBlur={() => setIsFocused(false)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          zIndex: 10,
                          cursor: 'text',
                          color: 'transparent',
                          background: 'transparent',
                          caretColor: 'transparent',
                          border: 'none',
                          outline: 'none',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '40px', paddingBottom: isFocused ? '45vh' : '20px', transition: 'padding 0.3s ease' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Boğaziçi Koleji © {new Date().getFullYear()}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QRCodeRedirect;
