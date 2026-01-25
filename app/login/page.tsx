'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function UnifiedLoginPage() {
    const router = useRouter();
    const [loginType, setLoginType] = useState<'staff' | 'parent'>('staff');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStaffLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('dashboard_users')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single();

            if (error || !data) {
                setError('Ongeldige gebruikersnaam of wachtwoord');
            } else {
                localStorage.setItem('moskee_user', JSON.stringify({
                    id: data.id,
                    username: data.username,
                    role: data.role || 'Docent'
                }));
                router.push('/');
            }
        } catch (err) {
            setError('Er is een fout opgetreden bij het inloggen');
        } finally {
            setLoading(false);
        }
    };

    const handleParentLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: studentId, error } = await supabase
                .rpc('verify_parent_code', {
                    search_name: username.trim(),
                    input_code: password
                });

            if (error || !studentId) {
                setError('Onjuiste combinatie van naam en code.');
            } else {
                localStorage.setItem('moskee_user', JSON.stringify({
                    id: studentId,
                    username: username,
                    role: 'Parent',
                    studentId: studentId
                }));
                router.push(`/parent-portal?studentId=${studentId}`);
            }
        } catch (err) {
            setError('Er is een fout opgetreden bij het inloggen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: loginType === 'staff'
                ? 'radial-gradient(circle at center, #0f2e23 0%, #0a1f18 100%)'
                : 'radial-gradient(circle at center, #1a237e 0%, #000000 100%)',
            transition: 'background 0.5s ease'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', border: `1px solid ${loginType === 'staff' ? 'var(--color-gold)' : '#5c6bc0'}` }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{loginType === 'staff' ? '🕌' : '👨‍👩‍👧‍👦'}</div>
                    <h1 className="heading-lg" style={{ fontSize: '2rem' }}>Al-Madrasa</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Centraal Inlogportaal</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                    <button
                        onClick={() => setLoginType('staff')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '4px', cursor: 'pointer',
                            background: loginType === 'staff' ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)',
                            color: loginType === 'staff' ? 'black' : 'white',
                            border: 'none', fontWeight: 'bold'
                        }}
                    >
                        Personeel
                    </button>
                    <button
                        onClick={() => setLoginType('parent')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '4px', cursor: 'pointer',
                            background: loginType === 'parent' ? '#3949ab' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            border: 'none', fontWeight: 'bold'
                        }}
                    >
                        Ouders
                    </button>
                </div>

                <form onSubmit={loginType === 'staff' ? handleStaffLogin : handleParentLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ padding: '10px', background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {loginType === 'staff' ? 'Gebruikersnaam' : 'Naam Kind'}
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {loginType === 'staff' ? 'Wachtwoord' : 'Pincode'}
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            marginTop: '10px', width: '100%',
                            background: loginType === 'staff' ? 'var(--color-gold)' : '#3949ab',
                            color: loginType === 'staff' ? 'black' : 'white',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                    </button>
                </form>
            </div>
        </main>
    );
}
