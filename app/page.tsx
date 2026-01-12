'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mosqueName, setMosqueName] = useState('Al-Madrasa Dashboard');

  useEffect(() => {
    // Initial load
    const savedName = localStorage.getItem('mosqueName');
    if (savedName) setMosqueName(savedName + ' Dashboard');

    // Listener for updates
    const handleStorageChange = () => {
      const newName = localStorage.getItem('mosqueName');
      if (newName) setMosqueName(newName + ' Dashboard');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <main style={{ padding: '40px' }}>
      <div className="container">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="heading-lg">{mosqueName}</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Welkom terug, Beheerder.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/students/new" className="btn btn-primary">Nieuwe Student</Link>
            <Link href="/login" className="btn btn-ghost" style={{ border: '1px solid var(--color-border)' }}>
              Uitloggen
            </Link>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Gebedstijden Widget */}
          <Link href="/prayer-times" className="card" style={{ background: 'linear-gradient(180deg, var(--color-bg-card), #0a1f18)', display: 'block' }}>
            <h2 className="heading-md" style={{ color: 'var(--color-gold)' }}>Gebedstijden</h2>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>Fajr</span>
                <span style={{ fontWeight: 'bold' }}>06:42</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>Dhuhr</span>
                <span style={{ fontWeight: 'bold' }}>12:45</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>Asr</span>
                <span style={{ fontWeight: 'bold' }}>14:55</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>Maghrib</span>
                <span style={{ fontWeight: 'bold' }}>17:15</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span>Isha</span>
                <span style={{ fontWeight: 'bold' }}>19:00</span>
              </div>
            </div>
          </Link>

          {/* Snel Naar */}
          <div className="card">
            <h2 className="heading-md">Snel Naar</h2>
            <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
              <Link href="/students" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                👥 Studenten Beheer
              </Link>
              <Link href="/groups" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                🏫 Klassen & Groepen
              </Link>
              <Link href="/grades" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                📊 Cijferlijsten
              </Link>
              <Link href="/attendance" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                📅 Absenties
              </Link>
              <Link href="/homework" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                📚 Huiswerk
              </Link>
              <Link href="/agenda" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                🗓️ Agenda
              </Link>
              <Link href="/quran-tracker" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                📖 Koran Volgsysteem
              </Link>
              <Link href="/announcements" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                📢 Aankondigingen
              </Link>
              <Link href="/parent-login" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                👨‍👩‍👧‍👦 Ouder Portaal (Demo)
              </Link>
              <Link href="/settings" className="btn btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid var(--color-border)' }}>
                ⚙️ Instellingen
              </Link>
            </div>
          </div>

          {/* Statistieken */}
          <div className="card">
            <h2 className="heading-md">School Overzicht</h2>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>504</div>
                <div style={{ color: 'var(--color-text-muted)' }}>Actieve Studenten</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>98%</div>
                <div style={{ color: 'var(--color-text-muted)' }}>Aanwezigheid Vandaag</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
