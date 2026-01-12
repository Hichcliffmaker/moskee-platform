'use client';

import { useState } from 'react';
import { MOCK_STUDENTS } from '../lib/data';
import Link from 'next/link';

// Helper to get unique groups
const GROUPS = Array.from(new Set(MOCK_STUDENTS.map(s => s.group))).sort();

export default function AttendancePage() {
    const [selectedGroup, setSelectedGroup] = useState(GROUPS[0] || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
    const [submitted, setSubmitted] = useState(false);

    const studentsInGroup = MOCK_STUDENTS.filter(s => s.group === selectedGroup);

    const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = () => {
        // In a real app, save to DB here
        console.log('Saving attendance:', { date, group: selectedGroup, attendance });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    // Initialize all as present if not set
    const getStatus = (id: string) => attendance[id] || 'present';

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Dashboard</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Absenties Registratie</h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px', alignItems: 'start' }}>

                    {/* Controls */}
                    <div className="card" style={{ position: 'sticky', top: '20px' }}>
                        <h2 className="heading-md">Details</h2>

                        <div style={{ marginTop: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Datum</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#0a1f18',
                                    border: '1px solid var(--color-border)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Groep</label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#0a1f18',
                                    border: '1px solid var(--color-border)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer'
                                }}
                            >
                                {GROUPS.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                {submitted ? '✓ Opgeslagen!' : 'Opslaan'}
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 className="heading-md">Studenten ({studentsInGroup.length})</h2>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Standaard status is <span style={{ color: '#81c784' }}>Aanwezig</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {studentsInGroup.map(student => {
                                const status = getStatus(student.id);
                                return (
                                    <div key={student.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-border)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'var(--color-bg-main)',
                                                border: '1px solid var(--color-gold)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--color-gold)',
                                                fontWeight: 'bold'
                                            }}>
                                                {student.firstName[0]}{student.lastName[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{student.firstName} {student.lastName}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{student.id}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'present')}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    border: '1px solid',
                                                    cursor: 'pointer',
                                                    background: status === 'present' ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
                                                    borderColor: status === 'present' ? '#81c784' : 'var(--color-border)',
                                                    color: status === 'present' ? '#81c784' : 'var(--color-text-muted)',
                                                    fontWeight: status === 'present' ? 'bold' : 'normal',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Aanwezig
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'late')}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    border: '1px solid',
                                                    cursor: 'pointer',
                                                    background: status === 'late' ? 'rgba(255, 152, 0, 0.2)' : 'transparent',
                                                    borderColor: status === 'late' ? '#ffb74d' : 'var(--color-border)',
                                                    color: status === 'late' ? '#ffb74d' : 'var(--color-text-muted)',
                                                    fontWeight: status === 'late' ? 'bold' : 'normal',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Te Laat
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'absent')}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    border: '1px solid',
                                                    cursor: 'pointer',
                                                    background: status === 'absent' ? 'rgba(244, 67, 54, 0.2)' : 'transparent',
                                                    borderColor: status === 'absent' ? '#e57373' : 'var(--color-border)',
                                                    color: status === 'absent' ? '#e57373' : 'var(--color-text-muted)',
                                                    fontWeight: status === 'absent' ? 'bold' : 'normal',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Afwezig
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
