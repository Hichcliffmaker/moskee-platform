'use client';

import { useState, useEffect } from 'react';
import { Student } from '../lib/data';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('moskee_user');
        if (!user) {
            window.location.href = '/login';
            return;
        }
    }, []);

    useEffect(() => {
        async function fetchStudents() {
            setLoading(true);

            // Auth & Role Check
            const userStr = localStorage.getItem('moskee_user');
            const user = userStr ? JSON.parse(userStr) : null;

            let query = supabase.from('students').select('*');

            if (user && user.role === 'Docent') {
                // First get the groups for this teacher (by ID or name)
                const { data: myGroups } = await supabase
                    .from('groups')
                    .select('name')
                    .or(`teacher_id.eq.${user.id},teacher.eq.${user.username}`);

                const groupNames = myGroups?.map(g => g.name) || [];

                if (groupNames.length > 0) {
                    query = query.in('group_name', groupNames);
                } else {
                    // If no groups found, return empty results
                    setStudents([]);
                    setLoading(false);
                    return;
                }
            }

            const { data, error } = await query.order('first_name');
            if (data) {
                // Map DB columns (snake_case) to our App type (camelCase)
                const mappedStudents: Student[] = data.map(s => ({
                    id: s.id,
                    firstName: s.first_name,
                    lastName: s.last_name,
                    group: s.group_name || 'Geen Groep',
                    dob: s.dob,
                    parentName: s.parent_name,
                    phone: s.phone,
                    status: s.status as 'active' | 'inactive',
                    badges: [] // Badges not yet in DB
                }));
                setStudents(mappedStudents);
            }
            setLoading(false);
        }

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                {/* Header Section */}
                <header style={{
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h1 className="heading-lg">Studenten (Live Database)</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Beheer dossiers, inschrijvingen en voortgang.
                        </p>
                    </div>
                    <Link href="/students/new" className="btn btn-primary">
                        + &nbsp; Nieuwe Student
                    </Link>
                </header>

                {/* Search & Filter Bar */}
                <div className="card" style={{ marginBottom: '30px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '1.2rem',
                            opacity: 0.5
                        }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Zoek op naam, groep of ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 44px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: '#0a1f18',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--color-border)' }}>Filter ▾</button>
                    </div>
                </div>

                {/* Students List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Laden...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                            Geen studenten gevonden die aan de zoekopdracht voldoen.
                        </div>
                    ) : (
                        filteredStudents.map((student) => (
                            <StudentRow key={student.id} student={student} />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

function StudentRow({ student }: { student: Student }) {
    return (
        <Link href={`/students/${student.id}`} style={{ display: 'block' }}>
            <div className="card" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                transition: 'all 0.2s',
                cursor: 'pointer',
            }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
                {/* Avatar Placeholder */}
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg-main)',
                    border: '1px solid var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    marginRight: '20px',
                    color: 'var(--color-gold)'
                }}>
                    {student.firstName[0]}{student.lastName[0]}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', alignItems: 'center', gap: '10px' }}>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{student.firstName} {student.lastName}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{student.id}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>📚</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>{student.group}</span>
                    </div>

                    <div style={{ color: 'var(--color-text-muted)' }}>
                        👤 {student.parentName}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <StatusBadge status={student.status} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
    const isActive = status === 'active';
    return (
        <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            backgroundColor: isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
            color: isActive ? '#81c784' : '#e57373',
            border: `1px solid ${isActive ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
        }}>
            {isActive ? 'Actief' : 'Inactief'}
        </span>
    )
}
