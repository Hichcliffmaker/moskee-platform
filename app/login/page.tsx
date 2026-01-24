'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Check credentials in dashboard_users table
            const { data, error } = await supabase
                .from('dashboard_users')
                .select('*')
                .eq('username', email) // Reusing 'email' state variable for username input
                .eq('password', password)
                .single();

            if (error || !data) {
                setError('Ongeldige gebruikersnaam of wachtwoord');
                setLoading(false);
            } else {
                // Login successful - Set Local Session
                localStorage.setItem('moskee_user', JSON.stringify(data));
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            setError('Er is een fout opgetreden');
            setLoading(false);
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
                    <p style={{ color: 'var(--color-text-muted)' }}>Veilig inloggen</p>
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
                            required
                            placeholder="Bijv. admin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '10px', width: '100%', textAlign: 'center', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
                        <a href="#" style={{ color: 'var(--color-gold)' }}>Wachtwoord vergeten?</a>
                    </div>
                </form>
            </div>
        </main>
    );
}
