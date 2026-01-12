'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type PrayerTimes = {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
};

export default function PrayerTimesPage() {
    const [times, setTimes] = useState<PrayerTimes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [city, setCity] = useState('Amsterdam'); // Default

    useEffect(() => {
        fetchTimes();
    }, [city]);

    const fetchTimes = async () => {
        setLoading(true);
        try {
            const date = new Date();
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            // Aladhan API
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=Netherlands&method=2`); // Method 2 = ISNA (often used, or change to custom)
            const data = await res.json();

            if (data.code === 200) {
                setTimes(data.data.timings);
            } else {
                setError('Kon gebedstijden niet ophalen.');
            }
        } catch (err) {
            setError('Er is een fout opgetreden.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Link href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Dashboard</Link>
                        <h1 className="heading-lg" style={{ marginTop: '10px' }}>Gebedstijden</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Actuele tijden voor {city}, Nederland</p>
                    </div>
                    {/* City Selector */}
                    <div>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{
                                padding: '10px 20px',
                                background: '#0a1f18',
                                color: 'white',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="Amsterdam">Amsterdam</option>
                            <option value="Rotterdam">Rotterdam</option>
                            <option value="Den Haag">Den Haag</option>
                            <option value="Utrecht">Utrecht</option>
                        </select>
                    </div>
                </header>

                {error && (
                    <div style={{ padding: '20px', backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#e57373', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                    {/* Main Display / TV Mode Preview */}
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, var(--color-bg-card), #051612)',
                        border: '1px solid var(--color-gold)',
                        minHeight: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Pattern Overlay */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                        {loading ? (
                            <div style={{ color: 'var(--color-gold)' }}>Laden...</div>
                        ) : times && (
                            <div style={{ width: '100%', padding: '40px', position: 'relative', zIndex: 1 }}>
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>Vandaag</div>
                                    <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>
                                        {new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)' }}>
                                        {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <PrayerRow name="Fajr" time={times.Fajr} />
                                    <PrayerRow name="Dhuhr" time={times.Dhuhr} />
                                    <PrayerRow name="Asr" time={times.Asr} />
                                    <PrayerRow name="Maghrib" time={times.Maghrib} isNext={true} />
                                    <PrayerRow name="Isha" time={times.Isha} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="card">
                            <h2 className="heading-md">Handmatige Aanpassing</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                                De automatische tijden kunnen hieronder met een aantal minuten worden gecorrigeerd (+/-).
                            </p>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
                                    <div key={prayer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label>{prayer}</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="number" defaultValue="0" style={{ width: '60px', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '4px', textAlign: 'center' }} />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>min</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button className="btn btn-primary" style={{ width: '100%' }}>Opslaan</button>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="heading-md">Jummah (Vrijdag)</h2>
                            <div style={{ marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Tijdstip Khutbah</label>
                                <input type="time" defaultValue="13:30" style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

function PrayerRow({ name, time, isNext = false }: { name: string, time: string, isNext?: boolean }) {
    // Strip timezone info if present (e.g. "06:42 (CET)")
    const cleanTime = time.split(' ')[0];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isNext ? 'var(--color-gold)' : 'rgba(255,255,255,0.03)',
            color: isNext ? 'var(--color-bg-main)' : 'inherit',
            fontWeight: isNext ? 'bold' : 'normal',
            transform: isNext ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.2s',
            boxShadow: isNext ? '0 4px 12px rgba(212, 175, 55, 0.3)' : 'none'
        }}>
            <span style={{ fontSize: '1.2rem' }}>{name}</span>
            <span style={{ fontSize: '1.4rem', fontFamily: 'monospace' }}>{cleanTime}</span>
        </div>
    );
}
