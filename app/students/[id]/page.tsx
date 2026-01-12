'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_STUDENTS, Badge, Student } from '../../lib/data';

// Mock additional data which isn't in the global store yet
const MOCK_ALL_GRADES = [
    { subject: 'Koran', topic: 'Surah Yasin (Volledig)', date: '10 Jan 2024', grade: 9.5, passed: true },
    { subject: 'Fiqh', topic: 'Wudu (Praktijk)', date: '05 Jan 2024', grade: 8.0, passed: true },
    { subject: 'Gedrag', topic: 'Winter Periode', date: '20 Dec 2023', grade: 'Goed', passed: true },
    { subject: 'Arabisch', topic: 'Lezen Hoofdstuk 4', date: '15 Dec 2023', grade: 7.2, passed: true },
    { subject: 'Tajweed', topic: 'Noon Saakinah', date: '12 Dec 2023', grade: 6.5, passed: true },
    { subject: 'Koran', topic: 'Surah Al-Mulk', date: '01 Dec 2023', grade: 8.8, passed: true },
];

const MOCK_ABSENCES = [
    { date: '14 Jan 2024', type: 'Ziek', status: 'Gemeld' },
    { date: '02 Dec 2023', type: 'Te Laat', status: 'Ongeoorloofd' },
    { date: '15 Nov 2023', type: 'Ziek', status: 'Gemeld' },
];

const PRESET_BADGES = [
    { name: 'Hifz Held', icon: '👑', color: '#ffd700', description: 'Uitmuntende prestatie in memorisatie' },
    { name: 'Vroege Vogel', icon: '🌅', color: '#81c784', description: 'Altijd op tijd aanwezig' },
    { name: 'Huiswerk Topper', icon: '📚', color: '#64b5f6', description: 'Huiswerk altijd perfect in orde' },
    { name: 'Behulpzaam', icon: '🤝', color: '#e57373', description: 'Helpt anderen graag' },
    { name: 'Stille Kracht', icon: '🦁', color: '#ba68c8', description: 'Rustig en gefocust in de les' },
];

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // Find initial student
    const initialStudent = MOCK_STUDENTS.find((s) => s.id === id);

    // State for local updates (like adding a badge)
    const [student, setStudent] = useState<Student | undefined>(initialStudent);

    // Tab State
    const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'absences' | 'notes'>('overview');

    // Award Modal State
    const [showAwardModal, setShowAwardModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState<{ date: string, text: string }[]>([]);

    // Quick Actions State
    const [isSickReported, setIsSickReported] = useState(false);

    const handleReportSick = () => {
        if (confirm(`Wilt u ${student?.firstName} ziekmelden voor vandaag?`)) {
            setIsSickReported(true);
            setTimeout(() => alert('✅ Ziekmelding verwerkt.'), 100);
        }
    };

    const handleCallParent = () => {
        if (student?.phone) {
            window.location.href = `tel:${student.phone}`;
        }
    };

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

    const handleAddBadge = (badgeTemplate: typeof PRESET_BADGES[0]) => {
        const newBadge: Badge = {
            id: Math.random().toString(36).substr(2, 9),
            name: badgeTemplate.name,
            icon: badgeTemplate.icon,
            color: badgeTemplate.color,
            description: badgeTemplate.description,
            date: new Date().toLocaleDateString('nl-NL')
        };

        // Update local state (in a real app, this would be an API call)
        const updatedStudent = { ...student, badges: [...(student.badges || []), newBadge] };
        setStudent(updatedStudent);
        setShowAwardModal(false);
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim()) return;

        setNotes([{ date: new Date().toLocaleDateString('nl-NL'), text: noteText }, ...notes]);
        setNoteText('');
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
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ marginBottom: '8px' }}>
                                        <span style={{ padding: '6px 16px', background: 'rgba(76, 175, 80, 0.2)', color: '#81c784', border: '1px solid rgba(76, 175, 80, 0.3)', borderRadius: '20px', fontWeight: 'bold' }}>
                                            {student.status === 'active' ? 'Actief' : 'Inactief'}
                                        </span>
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
                        </div>
                    </div>
                </div>

                {/* Tabs / Sub-navigation */}
                <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '30px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'overview' ? '2fr 1fr' : '1fr', gap: '24px' }}>

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
                                            {MOCK_ALL_GRADES.slice(0, 3).map((g, i) => (
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
                                    {MOCK_ALL_GRADES.map((g, i) => (
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
                                    {MOCK_ABSENCES.map((a, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '16px 0' }}>{a.date}</td>
                                            <td style={{ padding: '16px 0', fontWeight: 'bold' }}>{a.type}</td>
                                            <td style={{ padding: '16px 0' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem',
                                                    background: a.status === 'Gemeld' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(229, 115, 115, 0.2)',
                                                    color: a.status === 'Gemeld' ? '#81c784' : '#e57373'
                                                }}>
                                                    {a.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
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
        </main>
    );
}
