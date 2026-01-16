'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

interface Group {
    id: string;
    name: string;
    teacher: string;
    room: string;
    schedule: string;
    students: { count: number }[]; // Relation count
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGroups() {
            setLoading(true);
            const { data, error } = await supabase
                .from('groups')
                .select('*, students(count)');

            if (error) {
                console.error('Error fetching groups:', error);
            } else if (data) {
                // Map to flatten the count
                const formattedGroups = data.map(g => ({
                    ...g,
                    studentsCount: g.students?.[0]?.count || 0
                }));
                setGroups(formattedGroups);
            }
            setLoading(false);
        }

        fetchGroups();
    }, []);

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">Klassen & Groepen</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van alle lesgroepen, docenten en lokalen.</p>
                    </div>
                    <Link href="/groups/new" className="btn btn-primary">
                        + &nbsp; Nieuwe Groep
                    </Link>
                </header>

                {loading ? (
                    <div style={{ color: 'var(--color-text-muted)' }}>Laden...</div>
                ) : groups.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--color-text-muted)' }}>Nog geen groepen aangemaakt.</p>
                        <Link href="/groups/new" style={{ color: 'var(--color-gold)', marginTop: '10px', display: 'inline-block' }}>Eerste groep aanmaken →</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                        {groups.map(group => (
                            <Link href={`/groups/${group.id}`} key={group.id} style={{ display: 'block' }}>
                                <div className="card" style={{
                                    height: '100%',
                                    transition: 'all 0.2s',
                                    border: '1px solid var(--color-border)',
                                    cursor: 'pointer'
                                }}

                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <h2 className="heading-md" style={{ marginBottom: '4px' }}>{group.name}</h2>
                                        <span style={{
                                            background: 'rgba(212, 175, 55, 0.1)',
                                            color: 'var(--color-gold)',
                                            padding: '4px 10px',
                                            borderRadius: '99px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {group.studentsCount} leerlingen
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>🎓</span>
                                            <span>{group.teacher || 'Geen docent'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>📍</span>
                                            <span>{group.room || 'Geen lokaal'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>🕒</span>
                                            <span>{group.schedule || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
