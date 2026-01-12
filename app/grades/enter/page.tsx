'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Student } from '../../lib/data';
import Link from 'next/link';

const SUBJECTS = ["Koran", "Fiqh", "Aqidah", "Seerah", "Arabisch", "Gedrag"];
const TYPES = ["Huiswerk", "Overhoring", "Toets", "Tentamen", "Praktijk"];

export default function EnterGradePage() {
    const [students, setStudents] = useState<Student[]>([]);

    // Form State
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
    const [selectedType, setSelectedType] = useState(TYPES[0]); // Not used in DB yet schema but good to have in UI
    const [grade, setGrade] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch students for dropdown
    useEffect(() => {
        async function fetchStudents() {
            const { data } = await supabase
                .from('students')
                .select('*')
                .order('first_name', { ascending: true });

            if (data) {
                const mapped: Student[] = data.map(s => ({
                    id: s.id,
                    firstName: s.first_name,
                    lastName: s.last_name,
                    group: s.group_name || '',
                    dob: s.dob,
                    parentName: s.parent_name,
                    phone: s.phone,
                    status: s.status,
                    badges: []
                }));
                setStudents(mapped);
            }
            setLoading(false);
        }
        fetchStudents();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase
            .from('grades')
            .insert([
                {
                    student_id: selectedStudentId,
                    subject: selectedSubject,
                    topic: description, // Mapping topic to description input
                    grade: parseFloat(grade),
                    date: date
                }
            ]);

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
        } else {
            setSubmitted(true);
            // Reset form after delay
            setTimeout(() => {
                setSubmitted(false);
                setGrade('');
                setDescription('');
            }, 3000);
        }
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/grades" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Cijferlijsten</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Cijfer Invoeren</h1>
                </header>

                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>

                        {/* Student Select */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Student</label>
                            <select
                                required
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: '#0a1f18',
                                    border: '1px solid var(--color-border)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontFamily: 'inherit',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="" disabled>Selecteer een student...</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.group})</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                            {/* Subject */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Vak</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: '#0a1f18',
                                        border: '1px solid var(--color-border)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-sm)',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: '#0a1f18',
                                        border: '1px solid var(--color-border)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-sm)',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Grade & Date */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Cijfer</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="10"
                                    required
                                    placeholder="Bijv. 7.5"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: '#0a1f18',
                                        border: '1px solid var(--color-border)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-sm)',
                                        fontFamily: 'inherit',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Datum</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: '#0a1f18',
                                        border: '1px solid var(--color-border)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-sm)',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Omschrijving</label>
                            <input
                                type="text"
                                placeholder="Bijv. Surah Yasin Ayah 1-10"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: '#0a1f18',
                                    border: '1px solid var(--color-border)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Submit */}
                        <div style={{ marginTop: '20px' }}>
                            <button
                                type="submit"
                                disabled={submitted}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                            >
                                {submitted ? '✓ Cijfer Opgeslagen!' : 'Opslaan'}
                            </button>
                            {submitted && (
                                <div style={{ marginTop: '10px', textAlign: 'center', color: '#81c784' }}>
                                    Het cijfer is succesvol toegevoegd aan het dossier.
                                </div>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
}
