'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_GROUPS, MOCK_STUDENTS, MOCK_QURAN_PROGRESS, Student } from '../../lib/data';

// Helper to get dates in current month matching the lesson days (Mock: just getting all satiurdats/sundays for now)
function getLessonDates(schedule: string) {
    // This is a simplified mock. In real app, parse "Zaterdag" to get actual dates.
    return [
        "2026-01-03", "2026-01-04",
        "2026-01-10", "2026-01-11",
        "2026-01-17", "2026-01-18",
        "2026-01-24", "2026-01-25",
        "2026-01-31"
    ];
}

export default function QuranGroupTracker({ params }: { params: Promise<{ groupId: string }> }) {
    return <TrackerContent params={params} />
}

function TrackerContent({ params }: { params: Promise<{ groupId: string }> }) {
    const [groupId, setGroupId] = useState<string | null>(null);

    // Initial load
    useState(() => {
        params.then(p => setGroupId(p.groupId));
    });

    if (!groupId) return <div style={{ padding: '40px' }}>Laden...</div>;

    const group = MOCK_GROUPS.find(g => g.id === groupId);
    const students = MOCK_STUDENTS.filter(s => s.group === group?.name || s.group.includes(group?.name.split('(')[0].trim() || 'XYZ'));

    if (!group) return <div>Groep niet gevonden</div>;

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '1400px' }}>
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Link href="/quran-tracker" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug</Link>
                        <h1 className="heading-lg" style={{ marginTop: '10px' }}>{group.name} - Voortgang</h1>
                    </div>
                    <div style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                        <div>Maand: <strong>Januari 2026</strong></div>
                        <div style={{ marginBottom: '8px' }}>Docent: {group.teacher}</div>
                        <Link href={`/quran-tracker/${groupId}/log`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            + Nieuwe Registratie
                        </Link>
                        <Link href={`/quran-tracker/${groupId}/planning`} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.9rem', marginLeft: '10px', border: '1px solid var(--color-border)' }}>
                            📅 Planning Maken
                        </Link>
                    </div>
                </header>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px', borderBottom: '1px solid var(--color-border)', width: '250px' }}>Student</th>
                                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Week 1</th>
                                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Week 2</th>
                                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Week 3</th>
                                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Week 4</th>
                                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--color-border)', width: '150px' }}>Totaal (Mnd)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <StudentTrackerRow key={student.id} student={student} />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '40px', background: 'rgba(212, 175, 55, 0.05)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-gold)' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-gold)' }}>💡 Instructie voor de docent</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Klik op het doel (Hifz/Muraja'ah) om de status aan te passen of een opmerking toe te voegen.
                    </p>
                </div>
            </div>
        </main>
    );
}

function StudentTrackerRow({ student }: { student: Student }) {
    // Mock data aggegation
    const totalPages = Math.floor(Math.random() * 5) + 1; // Fake calc
    const totalRev = Math.floor(Math.random() * 2) + 1; // Fake calc

    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '16px', fontWeight: 'bold' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                        {student.firstName[0]}
                    </div>
                    {student.firstName} {student.lastName}
                </div>
            </td>
            {/* Week Cells using the new interactive component */}
            {[1, 2, 3, 4].map(week => (
                <td key={week} style={{ padding: '8px', verticalAlign: 'top' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '8px', minHeight: '80px' }}>
                        <InteractiveGoal
                            title="Hifz"
                            defaultGoal={week === 1 ? "P. 10-11" : ""}
                            defaultStatus={week < 2 ? 'completed' : 'pending'}
                        />
                        <div style={{ margin: '8px 0', borderTop: '1px dashed #333' }}></div>
                        <InteractiveGoal
                            title="Muraja'ah"
                            defaultGoal={week === 1 ? "Juz 29" : ""}
                            defaultStatus={week < 2 ? 'completed' : 'pending'}
                        />
                    </div>
                </td>
            ))}
            <td style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-gold)' }}>{totalPages} Pag.</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{totalRev} Juz Herh.</div>
            </td>
        </tr>
    );
}

function InteractiveGoal({ title, defaultGoal, defaultStatus }: { title: string, defaultGoal: string, defaultStatus: 'pending' | 'completed' | 'failed' }) {
    const [goal, setGoal] = useState(defaultGoal);
    const [status, setStatus] = useState(defaultStatus);
    const [note, setNote] = useState('');
    const [showPopover, setShowPopover] = useState(false);

    const getStatusColor = () => {
        if (status === 'completed') return '#81c784'; // Green
        if (status === 'failed') return '#e57373'; // Red
        return 'var(--color-text-muted)'; // Grey
    };

    const getStatusIcon = () => {
        if (status === 'completed') return '✅';
        if (status === 'failed') return '❌';
        return '⬜';
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{title}</div>

            {/* The Clickable Area */}
            <div
                onClick={() => setShowPopover(!showPopover)}
                style={{
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    border: showPopover ? '1px solid var(--color-gold)' : '1px solid transparent',
                    background: showPopover ? 'rgba(0,0,0,0.2)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <div style={{ fontSize: '0.85rem', color: goal ? 'white' : '#555', fontStyle: goal ? 'normal' : 'italic' }}>
                    {goal || "Geen doel..."}
                </div>
                <div style={{ fontSize: '0.9rem' }}>{getStatusIcon()}</div>
            </div>

            {/* Popover / Overlay */}
            {showPopover && (
                <div style={{
                    position: 'absolute',
                    zIndex: 10,
                    top: '100%',
                    left: 0,
                    width: '200px',
                    background: '#121212',
                    border: '1px solid var(--color-gold)',
                    borderRadius: '4px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Doel</label>
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            style={{ width: '100%', background: '#0a1f18', border: '1px solid #333', color: 'white', padding: '4px', fontSize: '0.8rem', borderRadius: '2px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '8px', display: 'flex', gap: '4px' }}>
                        <button
                            onClick={() => { setStatus('completed'); setShowPopover(false); }}
                            style={{ flex: 1, background: '#1b5e20', border: 'none', color: 'white', fontSize: '0.7rem', padding: '4px', borderRadius: '2px', cursor: 'pointer' }}
                        >
                            Voldaan
                        </button>
                        <button
                            onClick={() => { setStatus('failed'); setShowPopover(false); }}
                            style={{ flex: 1, background: '#b71c1c', border: 'none', color: 'white', fontSize: '0.7rem', padding: '4px', borderRadius: '2px', cursor: 'pointer' }}
                        >
                            Niet
                        </button>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Opmerking</label>
                        <textarea
                            rows={2}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            style={{ width: '100%', background: '#0a1f18', border: '1px solid #333', color: 'white', padding: '4px', fontSize: '0.8rem', borderRadius: '2px', resize: 'none' }}
                        />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <button onClick={() => setShowPopover(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.7rem', cursor: 'pointer' }}>Sluiten</button>
                    </div>
                </div>
            )}

            {/* Display Note Indicator if note exists */}
            {note && (
                <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginTop: '2px' }}>
                    📝 1 opmerking
                </div>
            )}
        </div>
    );
}
