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
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        teacher: '',
        teacher_ids: [] as string[],
        room: '',
        schedule: '',
        description: ''
    });
    const [staffUsers, setStaffUsers] = useState<any[]>([]);

    const router = require('next/navigation').useRouter(); // using require to avoid top-level import conflict if any

    useEffect(() => {
        const userStr = localStorage.getItem('moskee_user');
        if (!userStr) {
            window.location.href = '/login';
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role === 'Parent') {
            window.location.href = `/parent-portal?studentId=${user.studentId}`;
            return;
        }

        // Simple Admin Check (Client Side for UI only) - moved here to be available earlier
        if (user.role === 'Super Admin' || user.role === 'Admin') {
            setIsAdmin(true);
        }

        async function fetchData() {
            setLoading(true);

            // 1. Fetch Group
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('*')
                .eq('id', id)
                .single();

            // 2. Fetch Staff Users for Dropdown
            const { data: usersData } = await supabase
                .from('dashboard_users')
                .select('id, username, role')
                .in('role', ['Admin', 'Super Admin', 'Docent', 'Moderator']);

            if (usersData) setStaffUsers(usersData);

            if (groupData) {
                // 3. Fetch linked teachers
                const { data: teacherLinks } = await supabase
                    .from('group_teachers')
                    .select('teacher_id')
                    .eq('group_id', id);

                const linkedIds = teacherLinks?.map(l => l.teacher_id) || [];

                // Permission Check for Docents
                if (user.role === 'Docent' && !linkedIds.includes(user.id)) {
                    alert('Geen toegang tot deze groep.');
                    window.location.href = '/groups';
                    return;
                }

                setGroup(groupData);
                setFormData({
                    name: groupData.name || '',
                    type: groupData.type || 'Overig',
                    teacher: groupData.teacher || '',
                    teacher_ids: linkedIds,
                    room: groupData.room || '',
                    schedule: groupData.schedule || '',
                    description: groupData.description || ''
                });

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
                // If group not found, and not redirected by docent check, maybe redirect to groups list
                if (!groupError) { // Only if no specific error, otherwise the error message is more relevant
                    router.push('/groups');
                }
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
                teacher_ids: formData.teacher_ids, // preserve what we fetched in fetchData
                room: group.room || '',
                schedule: group.schedule || '',
                description: group.description || ''
            });
        }
    }, [group]);

    const handleSave = async () => {
        // 1. Update Group Details
        const { error } = await supabase
            .from('groups')
            .update({
                name: formData.name,
                type: formData.type,
                room: formData.room,
                schedule: formData.schedule,
                description: formData.description
            })
            .eq('id', id);

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
            return;
        }

        // 2. Sync Teachers in join table
        // This is a simplified "Re-sync" strategy: delete all and re-insert
        await supabase.from('group_teachers').delete().eq('group_id', id);
        if (formData.teacher_ids.length > 0) {
            const links = formData.teacher_ids.map(tid => ({
                group_id: id,
                teacher_id: tid
            }));
            await supabase.from('group_teachers').insert(links);
        }

        setGroup({ ...group!, ...formData });
        setIsEditing(false);
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 className="heading-md">Groep Bewerken</h2>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Naam Groep</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Type Les</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }}>
                                    <option value="Koran">Koran</option>
                                    <option value="Arabisch">Arabisch</option>
                                    <option value="Overig">Overig</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Docenten</label>
                                    <div style={{
                                        padding: '12px', background: '#0a1f18', border: '1px solid #333', borderRadius: '4px',
                                        maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'
                                    }}>
                                        {staffUsers.map(user => (
                                            <label key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.teacher_ids.includes(user.id)}
                                                    onChange={e => {
                                                        const newIds = e.target.checked
                                                            ? [...formData.teacher_ids, user.id]
                                                            : formData.teacher_ids.filter(id => id !== user.id);
                                                        setFormData({ ...formData, teacher_ids: newIds });
                                                    }}
                                                />
                                                <span>{user.username} ({user.role})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Lokaal</label>
                                    <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Lestijden (Tekst)</label>
                                <input type="text" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} placeholder="Bijv. Za 10:00-13:00" style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Beschrijving</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Korte beschrijving van de groep" style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px', minHeight: '80px' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                                <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>Opslaan</button>
                                <button onClick={() => setIsEditing(false)} className="btn btn-ghost" style={{ flex: 1, border: '1px solid var(--color-border)' }}>Annuleren</button>
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
                                    <span>🕒 {group.schedule || '-'}</span>
                                </div>
                                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--color-gold)' }}>
                                    🎓 {group.teacher || 'Docenten: '} {staffUsers.filter(u => formData.teacher_ids.includes(u.id)).map(u => u.username).join(', ')}
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

                <div style={{ display: isEditing ? 'none' : 'block' }}>
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
