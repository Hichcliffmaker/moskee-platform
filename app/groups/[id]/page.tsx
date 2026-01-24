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

    // Edit/Delete State
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: '', teacher: '', room: '', schedule: '' });

    const router = require('next/navigation').useRouter(); // using require to avoid top-level import conflict if any

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


    // Check Admin & Init Form
    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name || '',
                type: group.type || 'Overig',
                teacher: group.teacher || '',
                room: group.room || '',
                schedule: group.schedule || ''
            });
        }

        // Simple Admin Check (Client Side for UI only)
        const userStr = localStorage.getItem('moskee_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'Super Admin' || user.role === 'Admin') {
                setIsAdmin(true);
            }
        }
    }, [group]);

    const handleSave = async () => {
        const { error } = await supabase
            .from('groups')
            .update(formData)
            .eq('id', id);

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
        } else {
            setGroup({ ...group, ...formData });
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('WEET JE HET ZEKER? Alle gekoppelde data kan verloren gaan.')) return;

        const { error } = await supabase
            .from('groups')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Fout bij verwijderen: ' + error.message);
        } else {
            router.push('/groups');
        }
    };

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
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h2 className="heading-md">Groep Bewerken</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Groepsnaam" style={{ padding: '8px', background: '#0a1f18', border: '1px solid #333', color: 'white' }} />
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ padding: '8px', background: '#0a1f18', border: '1px solid #333', color: 'white' }}>
                                    <option value="Koran">Koran</option>
                                    <option value="Arabisch">Arabisch</option>
                                    <option value="Overig">Overig</option>
                                </select>
                            </div>
                            <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} placeholder="Lokaal" style={{ padding: '8px', background: '#0a1f18', border: '1px solid #333', color: 'white' }} />
                            <input type="text" value={formData.teacher} onChange={e => setFormData({ ...formData, teacher: e.target.value })} placeholder="Docent" style={{ padding: '8px', background: '#0a1f18', border: '1px solid #333', color: 'white' }} />
                            <input type="text" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} placeholder="Tijden (bijv. Zo. 10:00 - 13:00)" style={{ padding: '8px', background: '#0a1f18', border: '1px solid #333', color: 'white' }} />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleSave} className="btn btn-primary">Opslaan</button>
                                <button onClick={() => setIsEditing(false)} className="btn btn-ghost">Annuleren</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h1 className="heading-lg" style={{ margin: 0 }}>{group.name}</h1>
                                    <span style={{
                                        padding: '4px 10px',
                                        background: group.type === 'Koran' ? 'rgba(212, 175, 55, 0.2)' : group.type === 'Arabisch' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.1)',
                                        color: group.type === 'Koran' ? 'var(--color-gold)' : group.type === 'Arabisch' ? '#81c784' : 'var(--color-text-muted)',
                                        border: '1px solid currentColor',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem', fontWeight: 'bold'
                                    }}>
                                        {group.type || 'Overig'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', display: 'flex', gap: '24px' }}>
                                    <span>📍 {group.room || 'Geen lokaal'}</span>
                                    <span>🎓 {group.teacher || 'Geen docent'}</span>
                                    <span>🕒 {group.schedule || '-'}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setIsEditing(true)} className="btn btn-primary">Bewerk Groep</button>
                                {isAdmin && (
                                    <button onClick={handleDelete} className="btn" style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#e57373', border: '1px solid rgba(244, 67, 54, 0.3)' }}>
                                        🗑️ Verwijder
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
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
