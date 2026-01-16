'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

interface HomeworkItem {
    id: string;
    subject: string;
    title: string;
    description: string;
    due_date: string; // "YYYY-MM-DD"
    groups: {
        name: string;
    };
}

export default function HomeworkPage() {
    const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHomework() {
            setLoading(true);
            const { data, error } = await supabase
                .from('homework')
                .select(`
                    id,
                    subject,
                    title,
                    description,
                    due_date,
                    groups (
                        name
                    )
                `)
                .order('due_date', { ascending: true });

            if (error) {
                console.error('Error fetching homework:', error);
            } else if (data) {
                // @ts-ignore - Supabase types are dynamic, but we know the shape
                setHomeworkList(data);
            }
            setLoading(false);
        }

        fetchHomework();
    }, []);

    // Helper to format date nicely
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">Huiswerk</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van openstaand en opgegeven huiswerk.</p>
                    </div>
                    <Link href="/homework/new" className="btn btn-primary">
                        + &nbsp; Huiswerk Opgeven
                    </Link>
                </header>

                {loading ? (
                    <div style={{ color: 'var(--color-text-muted)' }}>Laden...</div>
                ) : homeworkList.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--color-text-muted)' }}>Nog geen huiswerk opgegeven.</p>
                        <Link href="/homework/new" style={{ color: 'var(--color-gold)', marginTop: '10px', display: 'inline-block' }}>Eerste huiswerk plaatsen →</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {homeworkList.map(hw => (
                            <div key={hw.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <span style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '4px 12px',
                                            borderRadius: '99px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            color: 'var(--color-gold)'
                                        }}>
                                            {hw.subject}
                                        </span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            {// @ts-ignore
                                                hw.groups?.name || 'Onbekende Groep'}
                                        </span>
                                    </div>
                                    <h2 className="heading-md" style={{ marginBottom: '8px' }}>{hw.title}</h2>
                                    <p style={{ color: 'var(--color-text-muted)' }}>{hw.description}</p>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>INLEVEREN VOOR</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{formatDate(hw.due_date)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
