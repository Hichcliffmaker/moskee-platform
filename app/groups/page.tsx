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

            // Auth & Role Check
            const userStr = localStorage.getItem('moskee_user');
            const user = userStr ? JSON.parse(userStr) : null;

            let query = supabase
                .from('groups')
                .select('*');

            // If Docent, only show their groups
            if (user && user.role === 'Docent') {
                const { data: links } = await supabase.from('group_teachers').select('group_id').eq('teacher_id', user.id);
                const ids = links?.map(l => l.group_id) || [];

                if (ids.length > 0) {
                    // Filter by join table IDs OR legacy teacher name
                    query = query.or(`id.in.(${ids.map(id => `"${id}"`).join(',')}),teacher.eq.${user.username}`);
                } else {
                    query = query.eq('teacher', user.username);
                }
            }

            const { data, error } = await query.order('name');

            if (error) {
                console.error('Error fetching groups:', error);
                alert('Fout bij ophalen groepen: ' + error.message); // Visible feedback
            } else if (data) {
                console.log('Fetched groups:', data);
                // Map to flatten the count
                const formattedGroups = data.map(g => ({
                    ...g,
                    studentsCount: 0 // Placeholder until we link table
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
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mobile-column">
                    <div>
                        <h1 className="heading-lg">Klassen & Groepen</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van alle lesgroepen. (v1.1 FIX LOADED)</p>
                        <p style={{ color: 'orange', fontSize: '0.8rem' }}>Debug: {groups.length} groepen gevonden.</p>
                    </div>
                    <Link href="/groups/new" className="btn btn-primary mobile-full-width">
                        + &nbsp; Nieuwe Groep
                    </Link>
                </header>

                {loading ? (
                    <div style={{ color: 'var(--color-text-muted)' }}>Laden... (Moment geduld)</div>
                ) : groups.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--color-text-muted)' }}>Nog geen groepen aangemaakt.</p>
                        <Link href="/groups/new" style={{ color: 'var(--color-gold)', marginTop: '10px', display: 'inline-block' }}>Eerste groep aanmaken →</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
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
