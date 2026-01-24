'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function ParentLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('ouder');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Use the database function to verify name + code securely
            const { data: studentId, error } = await supabase
                .rpc('verify_parent_code', {
                    search_name: username.trim(),
                    input_code: password
                });

            if (error) {
                console.error('Login error:', error);
                setError('Er is een technische fout opgetreden.');
                return;
            }

            if (!studentId) {
                setError('Onjuiste combinatie van naam en code.');
            } else {
                router.push(`/parent-portal?studentId=${studentId}`);
            }
        } catch (err) {
            console.error(err);
            setError('Login fout opgetreden.');
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1a237e 0%, #000000 100%)' // Slightly different color for parent portal
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', border: '1px solid #5c6bc0' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👨‍👩‍👧‍👦</div>
                    <h1 className="heading-lg" style={{ fontSize: '1.8rem', color: '#fff' }}>Ouder Portaal</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Log in om de voortgang van uw kind te bekijken.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ padding: '10px', background: 'rgba(239, 83, 80, 0.2)', color: '#ef5350', borderRadius: '4px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Mijn Kind (Studentnummer)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Bijv. ouder"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #3949ab',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Pincode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="1234"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #3949ab',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '10px', width: '100%', textAlign: 'center', background: '#3949ab', color: 'white' }}>
                        Inloggen Ouder
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
                        <Link href="/login" style={{ color: '#9fa8da' }}>Bent u docent? Klik hier</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
