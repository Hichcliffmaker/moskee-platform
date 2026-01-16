'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Student, Group } from '../../../lib/data';

export default function PlanningPage({ params }: { params: Promise<{ groupId: string }> }) {
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
                    studentsCount: 0 // Not needed for this view
                });

                // 2. Fetch Students for this group
                // Note: Matching by group_name string as per current schema design
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
        month: 'Februari 2026',
        hifzGoalTotal: '',
        murajaahGoalTotal: '',
        week1: '',
        week2: '',
        week3: '',
        week4: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Saving planning:', formData);

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
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Maandplanning Maken</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Stel de doelen vast voor de komende maand.</p>
                </header>

                <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '24px' }}>

                    {/* Student & Maand */}
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
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Maand</label>
                            <select
                                required
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            >
                                <option disabled value="">Kies een maand...</option>
                                <optgroup label="2025">
                                    <option>September 2025</option>
                                    <option>Oktober 2025</option>
                                    <option>November 2025</option>
                                    <option>December 2025</option>
                                </optgroup>
                                <optgroup label="2026">
                                    <option>Januari 2026</option>
                                    <option>Februari 2026</option>
                                    <option>Maart 2026</option>
                                    <option>April 2026</option>
                                    <option>Mei 2026</option>
                                    <option>Juni 2026</option>
                                    <option>Juli 2026</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '10px 0' }}></div>

                    {/* Hoofddoelen */}
                    <div>
                        <h3 className="heading-md" style={{ marginBottom: '16px', color: 'var(--color-gold)' }}>🎯 Hoofddoelen deze maand</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Hifz Doel (Totaal)</label>
                                <input
                                    type="text"
                                    placeholder="Bijv. 1/2 Juz (10 paginas)"
                                    value={formData.hifzGoalTotal}
                                    onChange={(e) => setFormData({ ...formData, hifzGoalTotal: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Muraja'ah Doel (Totaal)</label>
                                <input
                                    type="text"
                                    placeholder="Bijv. 3 Juz herhalen"
                                    value={formData.murajaahGoalTotal}
                                    onChange={(e) => setFormData({ ...formData, murajaahGoalTotal: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '10px 0' }}></div>

                    {/* Week Planning */}
                    <div>
                        <h3 className="heading-md" style={{ marginBottom: '16px', color: 'var(--color-gold)' }}>📅 Week Planning (Specifiek)</h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: '16px' }}>
                                <label style={{ fontWeight: 'bold' }}>Week 1</label>
                                <input
                                    type="text"
                                    placeholder="Bijv. Pagina 162-164 + Juz 28"
                                    value={formData.week1}
                                    onChange={(e) => setFormData({ ...formData, week1: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: '16px' }}>
                                <label style={{ fontWeight: 'bold' }}>Week 2</label>
                                <input
                                    type="text"
                                    placeholder="Planning..."
                                    value={formData.week2}
                                    onChange={(e) => setFormData({ ...formData, week2: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: '16px' }}>
                                <label style={{ fontWeight: 'bold' }}>Week 3</label>
                                <input
                                    type="text"
                                    placeholder="Planning..."
                                    value={formData.week3}
                                    onChange={(e) => setFormData({ ...formData, week3: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: '16px' }}>
                                <label style={{ fontWeight: 'bold' }}>Week 4</label>
                                <input
                                    type="text"
                                    placeholder="Planning..."
                                    value={formData.week4}
                                    onChange={(e) => setFormData({ ...formData, week4: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        {loading ? 'Bezig met opslaan...' : '💾 Planning Opslaan'}
                    </button>

                </form>
            </div>
        </main>
    );
}
