'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

// Helper for initials
const getInitials = (firstName: string, lastName: string) => {
    return (firstName?.[0] || '') + (lastName?.[0] || '');
};

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [group, setGroup] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // 1. Fetch Group
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('*')
                .eq('id', id)
                .single();

            if (groupData) {
                setGroup(groupData);

                // 2. Fetch Students via name matching (as currently stored)
                // Ideally this would be via group_id
                const { data: studentData } = await supabase
                    .from('students')
                    .select('*')
                    .eq('group_name', groupData.name);

                if (studentData) {
                    setStudents(studentData);
                }
            } else {
                console.error('Group not found:', groupError);
            }
            setLoading(false);
        }
        if (id) fetchData();
    }, [id]);


    if (loading) return <div style={{ padding: '40px', color: 'white' }}>Laden...</div>;
    if (!group) return <div style={{ padding: '40px', color: 'white' }}>Groep niet gevonden</div>;

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/groups" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ← Terug naar Groepen
                    </Link>
                </div>

                <div className="card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, var(--color-bg-card), #08201a)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="heading-lg" style={{ marginBottom: '8px' }}>{group.name}</h1>
                            <div style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', display: 'flex', gap: '24px' }}>
                                <span>📍 {group.room || 'Geen lokaal'}</span>
                                <span>🎓 {group.teacher || 'Geen docent'}</span>
                                <span>🕒 {group.schedule || '-'}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button className="btn btn-primary">Bewerk Groep</button>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="heading-md" style={{ marginBottom: '20px' }}>Studenten in deze groep</h2>

                    {students.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                            Nog geen studenten gekoppeld aan deze groep ({group.name}).
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {students.map(student => (
                                <div key={student.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-main)', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                            {getInitials(student.first_name, student.last_name)}
                                        </div>
                                        <div style={{ fontWeight: '600' }}>{student.first_name} {student.last_name}</div>
                                    </div>
                                    <Link href={`/students/${student.id}`} className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>
                                        Bekijk Dossier →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
