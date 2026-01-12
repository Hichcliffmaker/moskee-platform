'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username === 'admin' && password === 'admin123') {
            router.push('/');
        } else {
            setError('Ongeldige gebruikersnaam of wachtwoord');
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #0f2e23 0%, #0a1f18 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', border: '1px solid var(--color-gold)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🕌</div>
                    <h1 className="heading-lg" style={{ fontSize: '2rem' }}>Al-Madrasa</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Log in op het platform</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ padding: '10px', background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', borderRadius: '4px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Gebruikersnaam</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--color-border)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Wachtwoord</label>
                        <input
                            type="password"
                            placeholder="admin123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--color-border)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', width: '100%', textAlign: 'center' }}>
                        Inloggen
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
                        <a href="#" style={{ color: 'var(--color-gold)' }}>Wachtwoord vergeten?</a>
                    </div>
                </form>
            </div>
        </main>
    );
}
