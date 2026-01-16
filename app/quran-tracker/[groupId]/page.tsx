'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

// Helper for initials
const getInitials = (firstName: string, lastName: string) => {
    return (firstName?.[0] || '') + (lastName?.[0] || '');
};

export default function QuranGroupTracker({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = use(params);
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
                .eq('id', groupId)
                .single();

            if (groupData) {
                setGroup(groupData);

                // 2. Fetch Students
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
        if (groupId) fetchData();
    }, [groupId]);

    if (loading) return <div style={{ padding: '40px', color: 'white' }}>Laden...</div>;
    if (!group) return <div style={{ padding: '40px', color: 'white' }}>Groep niet gevonden</div>;

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
                        <div style={{ marginBottom: '8px' }}>Docent: {group.teacher || 'Geen Docent'}</div>
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
                            {students.length > 0 ? (
                                students.map(student => (
                                    <StudentTrackerRow key={student.id} student={student} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        Geen studenten found in deze groep.
                                    </td>
                                </tr>
                            )}
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

function StudentTrackerRow({ student }: { student: any }) {
    // Mock data aggegation for now
    const totalPages = 0;
    const totalRev = 0;

    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '16px', fontWeight: 'bold' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                        {getInitials(student.first_name, student.last_name)}
                    </div>
                    {student.first_name} {student.last_name}
                </div>
            </td>
            {/* Week Cells using the new interactive component */}
            {[1, 2, 3, 4].map(week => (
                <td key={week} style={{ padding: '8px', verticalAlign: 'top' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '8px', minHeight: '80px' }}>
                        <InteractiveGoal
                            title="Hifz"
                            defaultGoal={week === 1 ? "Start" : ""}
                            defaultStatus="pending"
                        />
                        <div style={{ margin: '8px 0', borderTop: '1px dashed #333' }}></div>
                        <InteractiveGoal
                            title="Muraja'ah"
                            defaultGoal=""
                            defaultStatus="pending"
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
