'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { Badge, Student } from '../../lib/data';
import { supabase } from '../../lib/supabase';

// Helper to get initials
const getInitials = (firstName: string, lastName: string) => {
    return (firstName?.[0] || '') + (lastName?.[0] || '');
};

const PRESET_BADGES = [
    { name: 'Hifz Held', icon: '👑', color: '#ffd700', description: 'Uitmuntende prestatie in memorisatie' },
    { name: 'Vroege Vogel', icon: '🌅', color: '#81c784', description: 'Altijd op tijd aanwezig' },
    { name: 'Huiswerk Topper', icon: '📚', color: '#64b5f6', description: 'Huiswerk altijd perfect in orde' },
    { name: 'Behulpzaam', icon: '🤝', color: '#e57373', description: 'Helpt anderen graag' },
    { name: 'Stille Kracht', icon: '🦁', color: '#ba68c8', description: 'Rustig en gefocust in de les' },
];

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    // Core Data State
    const [student, setStudent] = useState<Student | undefined>(undefined);
    const [grades, setGrades] = useState<any[]>([]);
    const [absences, setAbsences] = useState<any[]>([]); // New State
    const [loading, setLoading] = useState(true);

    // UI/Flow State
    const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'absences' | 'notes'>('overview');
    const [showAwardModal, setShowAwardModal] = useState(false);

    // Notes State
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState<{ date: string, text: string }[]>([]);

    // Quick Actions State
    const [isSickReported, setIsSickReported] = useState(false);

    // Edit/Delete State
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [groups, setGroups] = useState<{ id: string, name: string }[]>([]);
    const router = require('next/navigation').useRouter();


    // Fetch Student Data & Related Info
    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // 1. Get Student
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('id', id)
                .single();

            if (studentData) {
                // Fetch related data in parallel
                const [gradesRes, absencesRes, notesRes, badgesRes, groupsRes] = await Promise.all([
                    supabase.from('grades').select('*').eq('student_id', id).order('date', { ascending: false }),
                    supabase.from('absences').select('*').eq('student_id', id).order('date', { ascending: false }),
                    supabase.from('notes').select('*').eq('student_id', id).order('created_at', { ascending: false }),
                    supabase.from('badges').select('*').eq('student_id', id).order('date', { ascending: false }),
                    supabase.from('groups').select('id, name').order('name')
                ]);

                if (groupsRes.data) {
                    setGroups(groupsRes.data);
                }

                setStudent({
                    id: studentData.id,
                    firstName: studentData.first_name,
                    lastName: studentData.last_name,
                    group: studentData.group_name || 'Geen Groep',
                    dob: studentData.dob,
                    parentName: studentData.parent_name,
                    phone: studentData.phone,
                    email: studentData.email,     // NEW
                    address: studentData.address, // NEW
                    status: (studentData.status as 'active' | 'inactive') || 'active',
                    badges: badgesRes.data ? badgesRes.data.map(b => ({
                        id: b.id, name: b.name, icon: b.icon, color: b.color, description: b.description, date: b.date
                    })) : []
                });

                if (gradesRes.data) {
                    setGrades(gradesRes.data.map(g => ({
                        subject: g.subject,
                        topic: g.topic || '-',
                        date: new Date(g.date).toLocaleDateString('nl-NL'),
                        grade: g.grade,
                        passed: g.grade >= 5.5
                    })));
                }

                if (absencesRes.data) {
                    setAbsences(absencesRes.data.map(a => ({
                        date: new Date(a.date).toLocaleDateString('nl-NL'),
                        type: a.reason,
                        status: a.status
                    })));
                }

                if (notesRes.data) {
                    setNotes(notesRes.data.map(n => ({
                        date: new Date(n.created_at).toLocaleDateString('nl-NL'),
                        text: n.content
                    })));
                }

            } else {
                console.error('Student not found:', studentError);
            }
            setLoading(false);
        }
        if (id) fetchData();
    }, [id]);

    useEffect(() => {
        if (student) {
            setFormData({
                firstName: student.firstName,
                lastName: student.lastName,
                group: student.group,
                dob: student.dob,
                parentName: student.parentName,
                phone: student.phone,
                email: student.email,
                address: student.address,
                status: student.status
            });
        }

        const userStr = localStorage.getItem('moskee_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'Super Admin' || user.role === 'Admin') {
                setIsAdmin(true);
            }
        }
    }, [student]);

    const handleSave = async () => {
        const { error } = await supabase
            .from('students')
            .update({
                first_name: formData.firstName,
                last_name: formData.lastName,
                group_name: formData.group,
                dob: formData.dob || null,
                parent_name: formData.parentName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                status: formData.status
            })
            .eq('id', id);

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
        } else {
            setStudent({ ...student!, ...formData });
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('WEET JE HET ZEKER? Dit verwijdert het hele dossier inclusief cijfers en notities.')) return;

        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Fout bij verwijderen: ' + error.message);
        } else {
            router.push('/students');
        }
    };

    const handleReportSick = async () => {
        if (!student) return;
        if (confirm(`Wilt u ${student.firstName} ziekmelden voor vandaag?`)) {
            const today = new Date().toISOString().split('T')[0];
            const { error } = await supabase.from('absences').insert([{
                student_id: student.id,
                date: today,
                reason: 'Ziek',
                status: 'Gemeld'
            }]);

            if (error) {
                alert('Fout: ' + error.message);
            } else {
                setIsSickReported(true);
                alert('✅ Ziekmelding verwerkt in database.');
            }
        }
    };

    const handleCallParent = () => {
        if (student?.phone) {
            window.location.href = `tel:${student.phone}`;
        }
    };

    // We remove MOCK_ABSENCES here as we will fetch them later (or I need to add state for it)

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>Laden uit database...</div>;
    }

    if (!student) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1 className="heading-lg">Student niet gevonden</h1>
                <Link href="/students" className="btn btn-primary" style={{ marginTop: '20px' }}>
                    Terug naar overzicht
                </Link>
            </div>
        );
    }

    const handleAddBadge = async (badgeTemplate: typeof PRESET_BADGES[0]) => {
        if (!student) return;

        const { data, error } = await supabase.from('badges').insert([{
            student_id: student.id,
            name: badgeTemplate.name,
            icon: badgeTemplate.icon,
            color: badgeTemplate.color,
            description: badgeTemplate.description,
            date: new Date().toISOString().split('T')[0]
        }]).select();

        if (error) {
            alert('Fout bij toevoegen badge: ' + error.message);
        } else if (data) {
            // Update local UI
            const newBadge = {
                id: data[0].id,
                name: data[0].name,
                icon: data[0].icon,
                color: data[0].color,
                description: data[0].description,
                date: data[0].date
            };
            setStudent({ ...student, badges: [newBadge, ...(student.badges || [])] });
            setShowAwardModal(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim() || !student) return;

        const { error } = await supabase.from('notes').insert([{
            student_id: student.id,
            content: noteText,
            date: new Date().toISOString().split('T')[0]
        }]);

        if (error) {
            alert('Fout bij opslaan notitie: ' + error.message);
        } else {
            setNotes([{ date: new Date().toLocaleDateString('nl-NL'), text: noteText }, ...notes]);
            setNoteText('');
        }
    };

    return (
        <main style={{ padding: '40px', position: 'relative' }}>
            {/* Modal for Awards */}
            {showAwardModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 className="heading-md">Kies een Award</h2>
                            <button onClick={() => setShowAwardModal(false)} className="btn btn-ghost" style={{ fontSize: '1.2rem' }}>✕</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {PRESET_BADGES.map((badge, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAddBadge(badge)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${badge.color}`,
                                        borderRadius: '8px',
                                        padding: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                        transition: 'transform 0.1s'
                                    }}
                                >
                                    <span style={{ fontSize: '2.5rem' }}>{badge.icon}</span>
                                    <span style={{ fontWeight: 'bold' }}>{badge.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                {/* Breadcrumb / Back */}
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/students" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ← Terug naar overzicht
                    </Link>
                </div>

                {/* Header Profile */}
                <div className="card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, var(--color-bg-card), #08201a)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>

                    {isEditing ? (
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 className="heading-md">Student Bewerken</h2>

                            <h3 className="heading-sm" style={{ color: 'var(--color-text-muted)' }}>Persoonsgegevens</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Voornaam</label>
                                    <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Achternaam</label>
                                    <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Groep</label>
                                    <select value={formData.group} onChange={e => setFormData({ ...formData, group: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }}>
                                        <option value="">Selecteer groep...</option>
                                        {groups.map(g => (
                                            <option key={g.id} value={g.name}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Geboortedatum</label>
                                    <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <h3 className="heading-sm" style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>Contactgegevens</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Naam Ouder/Voogd</label>
                                    <input type="text" value={formData.parentName} onChange={e => setFormData({ ...formData, parentName: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Telefoonnummer</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Emailadres</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Adres</label>
                                    <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                                <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>Opslaan</button>
                                <button onClick={() => setIsEditing(false)} className="btn btn-ghost" style={{ flex: 1, border: '1px solid var(--color-border)' }}>Annuleren</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--color-bg-main)',
                                border: '3px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '3rem', color: 'var(--color-gold)', flexShrink: 0
                            }}>
                                {student.firstName[0]}{student.lastName[0]}
                            </div>

                            <div style={{ flex: 1, paddingTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h1 className="heading-lg" style={{ marginBottom: '8px' }}>{student.firstName} {student.lastName}</h1>
                                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>{student.group} • {student.id}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                        <div style={{ marginBottom: '8px' }}>
                                            <span style={{ padding: '6px 16px', background: 'rgba(76, 175, 80, 0.2)', color: '#81c784', border: '1px solid rgba(76, 175, 80, 0.3)', borderRadius: '20px', fontWeight: 'bold' }}>
                                                {student.status === 'active' ? 'Actief' : 'Inactief'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => setIsEditing(true)} className="btn btn-ghost" style={{ border: '1px solid var(--color-border)', fontSize: '0.8rem' }}>✏️ Bewerk</button>
                                            {isAdmin && (
                                                <button onClick={handleDelete} className="btn btn-ghost" style={{ border: '1px solid rgba(244, 67, 54, 0.3)', color: '#e57373', fontSize: '0.8rem' }}>🗑️</button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px', display: 'flex', gap: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>OUDER / VOOGD</div>
                                        <div style={{ fontWeight: '600' }}>{student.parentName}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>TELEFOONNR.</div>
                                        <div style={{ fontWeight: '600' }}>{student.phone}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>GEBOORTEDATUM</div>
                                        <div style={{ fontWeight: '600' }}>{student.dob}</div>
                                    </div>
                                </div>

                                {/* Extra Contact Info Row */}
                                {(student.email || student.address) && (
                                    <div style={{ marginTop: '16px', display: 'flex', gap: '40px' }}>
                                        {student.email && (
                                            <div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>EMAILADRES</div>
                                                <div style={{ fontWeight: '600' }}>{student.email}</div>
                                            </div>
                                        )}
                                        {student.address && (
                                            <div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>ADRES</div>
                                                <div style={{ fontWeight: '600' }}>{student.address}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs / Sub-navigation */}
                <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--color-border)', display: isEditing ? 'none' : 'flex', gap: '30px' }}>
                    <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'overview' ? '3px solid var(--color-gold)' : '3px solid transparent', padding: '10px 0', color: activeTab === 'overview' ? 'var(--color-gold)' : 'var(--color-text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
                        Overzicht
                    </button>
                    <button onClick={() => setActiveTab('grades')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'grades' ? '3px solid var(--color-gold)' : '3px solid transparent', padding: '10px 0', color: activeTab === 'grades' ? 'var(--color-gold)' : 'var(--color-text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
                        Cijferlijst
                    </button>
                    <button onClick={() => setActiveTab('absences')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'absences' ? '3px solid var(--color-gold)' : '3px solid transparent', padding: '10px 0', color: activeTab === 'absences' ? 'var(--color-gold)' : 'var(--color-text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
                        Absenties
                    </button>
                    <button onClick={() => setActiveTab('notes')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'notes' ? '3px solid var(--color-gold)' : '3px solid transparent', padding: '10px 0', color: activeTab === 'notes' ? 'var(--color-gold)' : 'var(--color-text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
                        Notities
                    </button>
                </div>

                <div style={{ display: isEditing ? 'none' : 'grid', gridTemplateColumns: activeTab === 'overview' ? '2fr 1fr' : '1fr', gap: '24px' }}>

                    {/* OVERVIEW CONTENT */}
                    {activeTab === 'overview' && (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* Awards & Badges Section */}
                                <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(to right, rgba(212, 175, 55, 0.05), transparent)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h2 className="heading-md" style={{ color: 'var(--color-gold)' }}>🏆 Behaalde Awards</h2>
                                        <button
                                            onClick={() => setShowAwardModal(true)}
                                            className="btn btn-ghost"
                                            style={{ fontSize: '0.8rem', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}
                                        >
                                            + Award Toekennen
                                        </button>
                                    </div>

                                    {student.badges && student.badges.length > 0 ? (
                                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                            {student.badges.map(badge => (
                                                <div key={badge.id} style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                                    background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px',
                                                    border: `1px solid ${badge.color || '#444'}`, minWidth: '120px'
                                                }}>
                                                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{badge.icon}</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{badge.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{badge.date}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Nog geen awards behaald.</div>
                                    )}
                                </div>

                                {/* Recent Grades Preview */}
                                <div className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h2 className="heading-md">Recente Resultaten</h2>
                                        <button onClick={() => setActiveTab('grades')} className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Alle Cijfers →</button>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Vak</th>
                                                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Onderdeel</th>
                                                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>Datum</th>
                                                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 'normal', textAlign: 'right' }}>Cijfer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grades.slice(0, 3).map((g, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '16px 0', fontWeight: 'bold' }}>{g.subject}</td>
                                                    <td style={{ padding: '16px 0' }}>{g.topic}</td>
                                                    <td style={{ padding: '16px 0', color: 'var(--color-text-muted)' }}>{g.date}</td>
                                                    <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 'bold', color: '#81c784' }}>{g.grade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="card">
                                    <h2 className="heading-md">Aanwezigheid</h2>
                                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>Aanwezigheidspercentage</span>
                                            <span style={{ fontWeight: 'bold', color: 'var(--color-gold)' }}>92%</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: '92%', height: '100%', background: 'var(--color-gold)' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h2 className="heading-md">Snel Actie</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                                        <button className="btn btn-ghost" style={{ border: '1px solid var(--color-border)', justifyContent: 'flex-start' }}>✏️ Cijfer Invoeren</button>
                                        <Link href={`/students/${student.id}/certificate`} className="btn btn-ghost" style={{ border: '1px solid var(--color-gold)', color: 'var(--color-gold)', justifyContent: 'flex-start' }}>🎓 Certificaat Maken</Link>
                                        <button
                                            onClick={handleReportSick}
                                            disabled={isSickReported}
                                            className="btn btn-ghost"
                                            style={{ border: '1px solid var(--color-border)', justifyContent: 'flex-start', color: isSickReported ? '#81c784' : 'inherit' }}
                                        >
                                            {isSickReported ? '✅ Ziekmelding Verstuurd' : '🤒 Ziekmelden'}
                                        </button>
                                        <button
                                            onClick={handleCallParent}
                                            className="btn btn-ghost"
                                            style={{ border: '1px solid var(--color-border)', justifyContent: 'flex-start' }}
                                        >
                                            📞 Ouders Bellen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* GRADES TAB */}
                    {activeTab === 'grades' && (
                        <div className="card">
                            <h2 className="heading-md" style={{ marginBottom: '20px' }}>Volledige Cijferlijst</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Vak</th>
                                        <th style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Onderdeel</th>
                                        <th style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Datum</th>
                                        <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', textAlign: 'right' }}>Cijfer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.map((g, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '16px 0', fontWeight: 'bold' }}>{g.subject}</td>
                                            <td style={{ padding: '16px 0' }}>{g.topic}</td>
                                            <td style={{ padding: '16px 0', color: 'var(--color-text-muted)' }}>{g.date}</td>
                                            <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 'bold', color: '#81c784' }}>{g.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ABSENCES TAB */}
                    {activeTab === 'absences' && (
                        <div className="card">
                            <h2 className="heading-md" style={{ marginBottom: '20px' }}>Absentie Overzicht</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Datum</th>
                                        <th style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Type</th>
                                        <th style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {absences.length > 0 ? (
                                        absences.map((a, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px 0', color: 'white' }}>{a.date}</td>
                                                <td style={{ padding: '12px 0', color: 'var(--color-text-muted)' }}>{a.type}</td>
                                                <td style={{ padding: '12px 0', textAlign: 'right' }}>
                                                    <span style={{
                                                        padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem',
                                                        background: 'rgba(255, 152, 0, 0.2)', color: '#ffcc80', border: '1px solid rgba(255, 152, 0, 0.3)'
                                                    }}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                Geen absenties geregistreerd.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* NOTES TAB */}
                    {activeTab === 'notes' && (
                        <div className="card">
                            <h2 className="heading-md" style={{ marginBottom: '20px' }}>Notities & Dossier</h2>

                            <form onSubmit={handleAddNote} style={{ marginBottom: '30px' }}>
                                <textarea
                                    className="input"
                                    placeholder="Nieuwe notitie schrijven..."
                                    rows={3}
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '8px', marginBottom: '10px' }}
                                />
                                <div style={{ textAlign: 'right' }}>
                                    <button type="submit" className="btn btn-primary" disabled={!noteText.trim()}>Notitie Toevoegen</button>
                                </div>
                            </form>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {notes.map((note, i) => (
                                    <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{note.date} - Docent</div>
                                        <div>{note.text}</div>
                                    </div>
                                ))}
                                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>01 Sept 2024 - Systeem</div>
                                    <div>Student dossier aangemaakt.</div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main >
    );
}
