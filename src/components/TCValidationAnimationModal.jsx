"use client";
import './TCValidationModal.css';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  FileText, 
  Binary, 
  CheckCircle, 
  KeyRound,
  Check,
  X,
  CreditCard
} from 'lucide-react';

// Resmi Modulo-10 TC Kimlik Algoritması
export function validateTCKimlik(tc) {
  const tcStr = String(tc || '').trim();
  if (tcStr.length !== 11 || !/^\d{11}$/.test(tcStr)) return false;
  const digits = tcStr.split('').map(Number);
  if (digits[0] === 0) return false;
  
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  
  let d10 = ((oddSum * 7) - evenSum) % 10;
  if (d10 < 0) d10 += 10;
  if (digits[9] !== d10) return false;
  
  const first10Sum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  if (digits[10] !== (first10Sum % 10)) return false;
  
  return true;
}

export default function TCValidationAnimationModal({
  tcKimlik = '',
  mode = 'register', // 'register' | 'login'
  onComplete = () => {}
}) {
  // Phase: 'materializing' -> 'extracting' -> 'verifying' -> 'finalizing' -> 'result'
  const [phase, setPhase] = useState('materializing');
  const [statusText, setStatusText] = useState('Güvenli bağlantı kuruluyor...');
  const [progress, setProgress] = useState(0);
  const [revealedDigits, setRevealedDigits] = useState(0);
  const [isValid, setIsValid] = useState(null);

  const initialSteps = mode === 'register' ? [
    { id: 0, title: 'Güvenli Bağlantı', icon: Lock, state: 'pending' },
    { id: 1, title: 'Format Denetimi', icon: FileText, state: 'pending' },
    { id: 2, title: 'Seri Algoritması', icon: Binary, state: 'pending' },
    { id: 3, title: 'Sağlama Doğrulaması', icon: ShieldCheck, state: 'pending' },
    { id: 4, title: 'Dijital İmza', icon: KeyRound, state: 'pending' }
  ] : [
    { id: 0, title: 'Güvenli Bağlantı', icon: Lock, state: 'pending' },
    { id: 1, title: 'Kimlik Denetimi', icon: FileText, state: 'pending' },
    { id: 2, title: 'Oturum Yetkisi', icon: KeyRound, state: 'pending' }
  ];

  const [steps, setSteps] = useState(initialSteps);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    isCancelledRef.current = false;

    async function runPipeline() {
      const digits = String(tcKimlik).trim().split('').map(Number);
      const isFormatValid = digits.length === 11 && digits[0] !== 0;
      const isAlgValid = validateTCKimlik(tcKimlik);

      // 1. Materializing
      setPhase('materializing');
      setStatusText('Güvenli bağlantı kuruluyor...');
      await new Promise(r => setTimeout(r, 600));
      if (isCancelledRef.current) return;

      // 2. Extracting Digits
      setPhase('extracting');
      setStatusText('Kimlik verileri ayrıştırılıyor...');
      for (let i = 0; i < 11; i++) {
        setRevealedDigits(i + 1);
        await new Promise(r => setTimeout(r, 45));
        if (isCancelledRef.current) return;
      }

      // 3. Verifying Steps
      setPhase('verifying');
      let checks = [];
      if (mode === 'register') {
        checks = [
          true,
          isFormatValid,
          isFormatValid && isAlgValid,
          isFormatValid && isAlgValid,
          isAlgValid
        ];
      } else {
        checks = [true, isAlgValid, isAlgValid];
      }

      let allPassed = true;
      for (let idx = 0; idx < steps.length; idx++) {
        setSteps(prev => prev.map((s, i) => i === idx ? { ...s, state: 'running' } : s));
        setStatusText(steps[idx].title + '...');
        await new Promise(r => setTimeout(r, mode === 'register' ? 650 : 350));
        if (isCancelledRef.current) return;

        const ok = checks[idx];
        setSteps(prev => prev.map((s, i) => i === idx ? { ...s, state: ok ? 'passed' : 'failed' } : s));
        setProgress(Math.round(((idx + 1) / steps.length) * 100));

        if (!ok) {
          allPassed = false;
          break;
        }
        await new Promise(r => setTimeout(r, 100));
        if (isCancelledRef.current) return;
      }

      // 4. Finalizing
      setPhase('finalizing');
      setStatusText(allPassed ? 'Sonuç onaylanıyor...' : 'İşlem sonlandırılıyor...');
      setProgress(100);
      await new Promise(r => setTimeout(r, 400));
      if (isCancelledRef.current) return;

      // 5. Result
      const validFinal = allPassed && isAlgValid;
      setIsValid(validFinal);
      setPhase('result');
      setStatusText(validFinal ? 'Doğrulama tamamlandı.' : 'Geçersiz T.C. Kimlik numarası.');

      await new Promise(r => setTimeout(r, 1200));
      if (isCancelledRef.current) return;
      onComplete(validFinal);
    }

    runPipeline();

    return () => {
      isCancelledRef.current = true;
    };
  }, [tcKimlik, mode]);

  const rawDigits = (tcKimlik || '').slice(0, 11).split('');
  while (rawDigits.length < 11) rawDigits.push('•');

  const maskedTC = tcKimlik.length === 11 
    ? `${tcKimlik.slice(0, 3)} ••• ••• ${tcKimlik.slice(9, 11)}`
    : (tcKimlik || '—');

  return (
    <div className="tc-modal-backdrop animate-fade-in">
      <div className="tc-modal-container">
        
        {/* Header Badge */}
        <div className="tc-header-badge">
          <ShieldCheck size={14} className="badge-shield-icon" />
          <span>GÜVENLİ KİMLİK DOĞRULAMA</span>
        </div>

        {/* Title Block */}
        <div className="tc-title-block">
          <h2 className={`tc-main-title ${phase === 'result' ? (isValid ? 'title-success' : 'title-error') : ''}`}>
            {phase === 'result' 
              ? (isValid ? 'Kimlik Doğrulandı' : 'Geçersiz Kimlik Numarası') 
              : 'Kimlik Doğrulanıyor'}
          </h2>
          <p className="tc-status-desc">{statusText}</p>
          <div className="tc-red-line"></div>
        </div>

        {/* 3D Holo ID Card or Clay Result */}
        <div className="holo-scene-wrap">
          {phase === 'result' ? (
            <div className={`clay-result-bubble ${isValid ? 'clay-success' : 'clay-error'} animate-pop-in`}>
              <div className="clay-pulse-ring"></div>
              <div className="clay-inner-sphere">
                {isValid ? (
                  <Check size={48} strokeWidth={3.5} className="clay-icon-svg" />
                ) : (
                  <X size={48} strokeWidth={3.5} className="clay-icon-svg" />
                )}
              </div>
            </div>
          ) : (
            <div className="holo-card-3d">
              <div className="holo-card-inner">
                <div className="holo-card-chip"></div>
                <div className="holo-card-header">
                  <div className="holo-turkey-flag">🇹🇷</div>
                  <div className="holo-gov-text">T.C. KİMLİK KARTI</div>
                </div>
                <div className="holo-card-body">
                  <div className="holo-photo-slot">
                    <CreditCard size={28} className="holo-photo-icon" />
                  </div>
                  <div className="holo-lines-slot">
                    <div className="holo-line w-long"></div>
                    <div className="holo-line w-med"></div>
                    <div className="holo-line w-short"></div>
                  </div>
                </div>
                {/* Laser scan ray */}
                <div className="laser-scan-ray"></div>
                {/* Specular shine */}
                <div className="specular-shine"></div>
              </div>
            </div>
          )}
        </div>

        {/* 11 Digit Bubbles */}
        <div className="digit-bubbles-row">
          {rawDigits.map((char, i) => {
            const isRevealed = i < revealedDigits;
            const bubbleStateClass = phase === 'result' 
              ? (isValid ? 'digit-pass' : 'digit-fail')
              : (isRevealed ? 'digit-revealed' : 'digit-hidden');

            return (
              <div 
                key={i} 
                className={`digit-bubble ${bubbleStateClass}`}
                style={{ transitionDelay: `${i * 15}ms` }}
              >
                <span>{isRevealed ? char : '•'}</span>
              </div>
            );
          })}
        </div>

        {/* Data Badge */}
        <div className="data-capsule-badge">
          <div className="data-icon-wrap">
            <CreditCard size={15} />
          </div>
          <div className="data-text-col">
            <span className="data-label">TC KİMLİK NO</span>
            <span className="data-val">{maskedTC}</span>
          </div>
          <div className="data-status-icon">
            {phase !== 'result' ? (
              <div className="mini-spinner"></div>
            ) : isValid ? (
              <CheckCircle size={18} className="text-success" />
            ) : (
              <ShieldAlert size={18} className="text-error" />
            )}
          </div>
        </div>

        {/* Step Bubbles */}
        <div className="step-bubbles-container">
          {steps.map((step) => {
            const IconComponent = step.icon;
            if (step.state === 'running') {
              return (
                <div key={step.id} className="step-pill-running animate-pop-in">
                  <div className="mini-spinner-red"></div>
                  <span>{step.title}</span>
                </div>
              );
            }
            if (step.state === 'passed') {
              return (
                <div key={step.id} className="step-pill-circle step-passed animate-pop-in" title={step.title}>
                  <Check size={12} strokeWidth={3} />
                </div>
              );
            }
            if (step.state === 'failed') {
              return (
                <div key={step.id} className="step-pill-circle step-failed animate-pop-in" title={step.title}>
                  <X size={12} strokeWidth={3} />
                </div>
              );
            }
            return (
              <div key={step.id} className="step-dot-pending" title={step.title}></div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {phase !== 'result' && (
          <div className="progress-track-wrapper">
            <div className="progress-track-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-percent-text">%{progress}</span>
          </div>
        )}

      </div>

      
    </div>
  );
}
