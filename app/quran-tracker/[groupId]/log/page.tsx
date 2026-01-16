'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Student, Group } from '../../../lib/data';

export default function LogProgressPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = use(params);
    const router = useRouter();

    const [group, setGroup] = useState<Group | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoadingData(true);
            // 1. Fetch Group
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('*')
                .eq('id', groupId)
                .single();

            if (groupData) {
                setGroup({
                    id: groupData.id,
                    name: groupData.name,
                    teacher: groupData.teacher,
                    room: groupData.room,
                    schedule: groupData.schedule,
                    studentsCount: 0
                });

                // 2. Fetch Students
                const { data: studentsData, error: studentsError } = await supabase
                    .from('students')
                    .select('*')
                    .eq('group_name', groupData.name);

                if (studentsData) {
                    const mappedStudents: Student[] = studentsData.map(s => ({
                        id: s.id,
                        firstName: s.first_name,
                        lastName: s.last_name,
                        group: s.group_name,
                        dob: s.dob,
                        parentName: s.parent_name,
                        phone: s.phone,
                        status: s.status,
                        badges: []
                    }));
                    setStudents(mappedStudents);
                } else if (studentsError) {
                    console.error('Error fetching students:', studentsError);
                }
            } else {
                console.error('Error fetching group:', groupError);
            }
            setLoadingData(false);
        }

        if (groupId) fetchData();
    }, [groupId]);

    const [formData, setFormData] = useState({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        hifzGoal: '',
        hifzMistakes: '0',
        hifzCompleted: false,
        murajaahGoal: '',
        murajaahMistakes: '0',
        murajaahCompleted: false,
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Logging progress:', formData);

        setTimeout(() => {
            setLoading(false);
            router.push(`/quran-tracker/${groupId}`);
        }, 1000);
    };

    if (!group) return <div style={{ padding: '40px', color: 'white' }}>Groep niet gevonden</div>;

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href={`/quran-tracker/${groupId}`} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Groepsoverzicht</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Voortgang Registreren</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>{group.name}</p>
                </header>

                <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '24px' }}>

                    {/* Student & Datum */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Student</label>
                            <select
                                required
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            >
                                <option value="" disabled>Selecteer student...</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Datum</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '10px 0' }}></div>

                    {/* Hifz Section */}
                    <div>
                        <h3 className="heading-md" style={{ marginBottom: '16px', color: 'var(--color-gold)' }}>Nieuwe Hifz (Memoriseren)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Doel / Surah</label>
                                <input
                                    type="text"
                                    placeholder="Bijv. Surah Al-Mulk 10-20"
                                    value={formData.hifzGoal}
                                    onChange={(e) => setFormData({ ...formData, hifzGoal: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Aantal Fouten</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.hifzMistakes}
                                    onChange={(e) => setFormData({ ...formData, hifzMistakes: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.hifzCompleted}
                                onChange={(e) => setFormData({ ...formData, hifzCompleted: e.target.checked })}
                                style={{ width: '20px', height: '20px', accentColor: 'var(--color-gold)' }}
                            />
                            <span style={{ fontWeight: 'bold' }}>Gezien & Goedgekeurd</span>
                        </label>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '10px 0' }}></div>

                    {/* Murajaah Section */}
                    <div>
                        <h3 className="heading-md" style={{ marginBottom: '16px', color: 'var(--color-gold)' }}>Muraja'ah (Herhaling)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Doel / Juz</label>
                                <input
                                    type="text"
                                    placeholder="Bijv. Juz 29"
                                    value={formData.murajaahGoal}
                                    onChange={(e) => setFormData({ ...formData, murajaahGoal: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Aantal Fouten</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.murajaahMistakes}
                                    onChange={(e) => setFormData({ ...formData, murajaahMistakes: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.murajaahCompleted}
                                onChange={(e) => setFormData({ ...formData, murajaahCompleted: e.target.checked })}
                                style={{ width: '20px', height: '20px', accentColor: 'var(--color-gold)' }}
                            />
                            <span style={{ fontWeight: 'bold' }}>Gezien & Goedgekeurd</span>
                        </label>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Opmerkingen</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Tips voor de volgende keer..."
                            rows={3}
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)', resize: 'vertical' }}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        {loading ? 'Bezig met opslaan...' : '💾 Voortgang Opslaan'}
                    </button>

                </form>
            </div>
        </main>
    );
}
