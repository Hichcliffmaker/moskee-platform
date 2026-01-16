'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function GradesPage() {
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGrades() {
            setLoading(true);
            // Fetch grades and join with students table to get names
            const { data, error } = await supabase
                .from('grades')
                .select(`
                    *,
                    students (
                        first_name,
                        last_name,
                        group_name
                    )
                `)
                .order('date', { ascending: false });

            if (data) {
                setGrades(data);
            } else if (error) {
                console.error('Error fetching grades:', error);
            }
            setLoading(false);
        }
        fetchGrades();
    }, []);

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">Cijferlijsten</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van resultaten per vak en groep.</p>
                    </div>
                    <Link href="/grades/enter" className="btn btn-primary">
                        + &nbsp; Cijfer Invoeren
                    </Link>
                </header>

                {/* Filters (Mock - functionaliteit volgt) */}
                <div className="card" style={{ marginBottom: '30px', display: 'flex', gap: '16px' }}>
                    <select style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: '#0a1f18', color: 'white', border: '1px solid var(--color-border)' }}>
                        <option>Alle Groepen</option>
                        <option>Groep 3</option>
                        <option>Groep 4</option>
                    </select>
                    <select style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: '#0a1f18', color: 'white', border: '1px solid var(--color-border)' }}>
                        <option>Alle Vakken</option>
                        <option>Koran</option>
                        <option>Fiqh</option>
                    </select>
                </div>

                {/* Global Grades Table */}
                <div className="card">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Laden...</div>
                    ) : grades.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Nog geen cijfers ingevoerd.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px' }}>Student</th>
                                    <th style={{ padding: '16px' }}>Groep</th>
                                    <th style={{ padding: '16px' }}>Vak</th>
                                    <th style={{ padding: '16px' }}>Type</th>
                                    <th style={{ padding: '16px' }}>Omschrijving</th>
                                    <th style={{ padding: '16px' }}>Datum</th>
                                    <th style={{ padding: '16px', textAlign: 'right' }}>Cijfer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade) => (
                                    <tr key={grade.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '16px', fontWeight: '600' }}>
                                            {grade.students?.first_name} {grade.students?.last_name}
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>
                                            {grade.students?.group_name || '-'}
                                        </td>
                                        <td style={{ padding: '16px' }}>{grade.subject}</td>
                                        <td style={{ padding: '16px' }}>Toets</td>
                                        {/* Type is often not in explicit column yet, treating generic or could utilize 'topic' */}
                                        <td style={{ padding: '16px' }}>{grade.topic || '-'}</td>
                                        <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>
                                            {new Date(grade.date).toLocaleDateString('nl-NL')}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: grade.grade >= 5.5 ? '#81c784' : '#e57373' }}>
                                            {grade.grade}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}
