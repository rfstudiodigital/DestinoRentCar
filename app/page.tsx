'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/components/LocaleSwitcher';
import styles from './page.module.css';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const featuresRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
    const onLocaleChange = () => window.location.reload();
    window.addEventListener('localechange', onLocaleChange);
    return () => window.removeEventListener('localechange', onLocaleChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    [featuresRef.current, statsRef.current, ctaRef.current].forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <main className={styles.main}>
      {/* Hero - Logo integrado como marca */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGradient} />
          <div className={styles.logoWatermark} aria-hidden>
            <svg viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 80 Q 120 50 200 60 Q 280 65 350 58 Q 420 55 450 75" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 50 100 Q 120 130 200 120 Q 280 115 350 122 Q 420 125 450 105" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className={`${styles.heroContent} ${mounted ? styles.heroReveal : ''}`}>
          {/* Logo integrado - tipografía + líneas del auto */}
          <div className={styles.brandBlock}>
            <svg className={styles.carLines} viewBox="0 0 500 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20 35 Q 80 15 180 22 Q 280 28 360 20 Q 440 15 480 35" stroke="var(--secondary-color)" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M 20 55 Q 80 70 180 62 Q 280 56 360 65 Q 440 72 480 52" stroke="rgba(255,255,255,0.9)" strokeWidth="6" fill="none" strokeLinecap="round"/>
            </svg>
            <h1 className={styles.brandTitle}>
              <span className={styles.brandDestino}>DESTINO</span>
              <span className={styles.brandSub}>RENT A CAR</span>
            </h1>
          </div>

          <p className={styles.heroSubtitle}>{t('home.subtitle')}</p>

          <div className={styles.ctaButtons}>
            <Link href="/vehiculos" className={styles.btnPrimary}>
              {t('home.explore')}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/registro" className={styles.btnSecondary}>
              {t('home.register')}
            </Link>
          </div>
        </div>

        <div className={styles.floatingOrbs}>
          <span className={styles.orb1} />
          <span className={styles.orb2} />
          <span className={styles.orb3} />
        </div>
      </section>

      {/* Features */}
      <section id="features" ref={featuresRef} className={`${styles.features} ${visibleSections.features ? styles.visible : ''}`}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
          <div className={styles.titleBar} />
          <div className={styles.featuresGrid}>
            {[
              { icon: 'check', key: 'quick', desc: 'quickDesc' },
              { icon: 'star', key: 'premium', desc: 'premiumDesc' },
              { icon: 'clock', key: 'support', desc: 'supportDesc' },
              { icon: 'tag', key: 'prices', desc: 'pricesDesc' },
            ].map((f, i) => (
              <article key={f.key} className={styles.featureCard} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.featureIcon}>
                  {f.icon === 'check' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {f.icon === 'star' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {f.icon === 'clock' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {f.icon === 'tag' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2L9 5z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <h3>{t(`features.${f.key}`)}</h3>
                <p>{t(`features.${f.desc}`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" ref={statsRef} className={`${styles.stats} ${visibleSections.stats ? styles.visible : ''}`}>
        <div className={styles.statsInner}>
          {[
            { num: '500+', label: t('stats.vehicles') },
            { num: '10K+', label: t('stats.clients') },
            { num: '98%', label: t('stats.satisfaction') },
            { num: '24/7', label: t('stats.support') },
          ].map((s, i) => (
            <div key={s.num} className={styles.statItem} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" ref={ctaRef} className={`${styles.cta} ${visibleSections.cta ? styles.visible : ''}`}>
        <div className={styles.ctaBox}>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.text')}</p>
          <Link href="/vehiculos" className={styles.btnCta}>
            {t('cta.button')}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
