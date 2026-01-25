'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function QuranTrackerPage() {
    const [quranGroups, setQuranGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('moskee_user');
        if (!userStr) {
            window.location.href = '/login';
            return;
        }
        const user = JSON.parse(userStr);

        async function fetchGroups() {
            setLoading(true);
            let query = supabase.from('groups').select('*');

            if (user.role === 'Docent') {
                query = query.eq('teacher', user.username);
            }

            const { data, error } = await query.order('name');
            if (data) {
                // Filter relevant groups (Strictly Type 'Koran')
                const filtered = data.filter(g => g.type === 'Koran');
                setQuranGroups(filtered);
            } else if (error) {
                console.error('Error fetching groups:', error);
            }
            setLoading(false);
        }
        fetchGroups();
    }, []);

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Dashboard</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Koran Volgsysteem</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Selecteer een groep om voortgang te registreren.</p>
                </header>

                {loading ? (
                    <div style={{ color: 'var(--color-text-muted)' }}>Laden...</div>
                ) : quranGroups.length === 0 ? (
                    <div style={{ color: 'var(--color-text-muted)' }}>Geen Koran-gerelateerde groepen gevonden.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                        {quranGroups.map(group => (
                            <Link href={`/quran-tracker/${group.id}`} key={group.id} className="card" style={{ display: 'block', transition: 'all 0.2s', border: '1px solid var(--color-border)', cursor: 'pointer', background: 'linear-gradient(135deg, var(--color-bg-card), #08201a)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <h2 className="heading-md">{group.name}</h2>
                                    <span style={{ fontSize: '2rem' }}>📖</span>
                                </div>
                                <div style={{ color: 'var(--color-text-muted)' }}>
                                    <div>🎓 {group.teacher || 'Geen docent'}</div>
                                    <div>🕒 {group.schedule || '-'}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
