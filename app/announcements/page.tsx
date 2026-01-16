'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnnouncements() {
            setLoading(true);
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('date', { ascending: false });

            if (data) {
                setAnnouncements(data);
            } else if (error) {
                console.error('Error fetching announcements:', error);
            }
            setLoading(false);
        }
        fetchAnnouncements();
    }, []);

    const handleNewMessage = () => {
        alert("Functionaliteit 'Nieuw Bericht maken' volgt binnenkort!");
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Dashboard</Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <h1 className="heading-lg">Aankondigingen</h1>
                        <button onClick={handleNewMessage} className="btn btn-primary">Nieuw Bericht +</button>
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {loading ? (
                        <div style={{ color: 'var(--color-text-muted)' }}>Laden...</div>
                    ) : announcements.length === 0 ? (
                        <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Nog geen aankondigingen.</div>
                    ) : (
                        announcements.map(item => (
                            <div key={item.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h2 className="heading-md" style={{ fontSize: '1.4rem' }}>{item.title}</h2>
                                    <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                                        {new Date(item.date).toLocaleDateString('nl-NL')}
                                    </span>
                                </div>
                                <p style={{ lineHeight: '1.6', color: '#ddd' }}>
                                    {item.content}
                                </p>
                                <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                    Geplaatst door: {item.author || 'Bestuur'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
