'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

function ParentPortalContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const studentId = searchParams.get('studentId');

    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const [recentGrades, setRecentGrades] = useState<any[]>([]);
    const [homework, setHomework] = useState<any[]>([]);
    const [attendanceStats, setAttendanceStats] = useState({ sick: 0, total: 0 });
    const [announcement, setAnnouncement] = useState<any>(null);

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        async function extractGroupIdsAndFetch(groupName: string) {
            // Find group ID by name to link homework
            const { data: groupData } = await supabase.from('groups').select('id, name').eq('name', groupName).single();
            return groupData;
        }

        async function fetchData() {
            try {
                // 1. Fetch Student
                const { data: studentData, error: studentError } = await supabase
                    .from('students')
                    .select('*')
                    .eq('id', studentId)
                    .single();

                if (studentError || !studentData) throw new Error('Student niet gevonden');
                setStudent(studentData);

                // 2. Fetch Linked Data in Parallel
                const [gradesRes, absencesRes, announcementRes] = await Promise.all([
                    supabase.from('grades').select('*').eq('student_id', studentId).order('date', { ascending: false }).limit(5),
                    supabase.from('absences').select('*').eq('student_id', studentId),
                    supabase.from('announcements').select('*').order('date', { ascending: false }).limit(1).single()
                ]);

                setRecentGrades(gradesRes.data || []);

                if (absencesRes.data) {
                    const sickCount = absencesRes.data.filter((a: any) => a.reason === 'Ziek').length;
                    setAttendanceStats({ sick: sickCount, total: absencesRes.data.length });
                }

                if (announcementRes.data) {
                    setAnnouncement(announcementRes.data);
                }

                // 3. Fetch Homework (Needs Group Link)
                // Assuming student.group_name matches group.name
                if (studentData.group_name) {
                    // We need to find homework for this group. 
                    // Since we don't have direct group_id on student (it is group_name string), 
                    // we first find the group or filter homework by joined group name

                    const { data: hwData } = await supabase
                        .from('homework')
                        .select('*, groups!inner(name)')
                        .eq('groups.name', studentData.group_name)
                        .gte('due_date', new Date().toISOString().split('T')[0]) // Only future/today
                        .order('due_date', { ascending: true })
                        .limit(5);

                    if (hwData) setHomework(hwData);
                }

            } catch (error) {
                console.error('Error loading portal:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [studentId]);

    if (loading) {
        return <div style={{ padding: '40px', color: 'white' }}>Profiel laden...</div>;
    }

    if (!studentId || !student) {
        return (
            <main style={{ padding: '40px', minHeight: '100vh', background: '#050510', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1 className="heading-lg">Geen student geselecteerd</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>Log opnieuw in om toegang te krijgen.</p>
                <Link href="/parent-login" className="btn btn-primary">Naar Inloggen</Link>
            </main>
        );
    }

    return (
        <main style={{ padding: '40px', background: '#050510', minHeight: '100vh' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg" style={{ color: '#fff' }}>Hoi, Ouder van {student.first_name}</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Student: <strong>{student.first_name} {student.last_name} ({student.group_name || 'Geen Groep'})</strong></p>
                    </div>
                    <Link href="/parent-login" className="btn btn-ghost">Uitloggen ({student.first_name})</Link>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                    {/* Notices */}
                    {announcement && (
                        <div className="card" style={{ gridColumn: '1 / -1', background: 'linear-gradient(90deg, #1a237e, #0d47a1)' }}>
                            <h2 className="heading-md" style={{ color: 'white' }}>📢 {announcement.title}</h2>
                            <p style={{ color: '#e3f2fd' }}>{announcement.content}</p>
                            <div style={{ fontSize: '0.8rem', color: '#bbdefb', marginTop: '8px' }}>
                                {new Date(announcement.date).toLocaleDateString('nl-NL')}
                            </div>
                        </div>
                    )}

                    {/* Recent Grades */}
                    <div className="card">
                        <h2 className="heading-md">Cijfers (Laatste 5)</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                            {recentGrades.length > 0 ? recentGrades.map(grade => (
                                <div key={grade.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span>{grade.subject}</span>
                                    <span style={{ fontWeight: 'bold', color: grade.grade >= 5.5 ? '#81c784' : '#ef5350' }}>{grade.grade}</span>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--color-text-muted)' }}>Nog geen cijfers bekend.</p>
                            )}
                        </div>
                    </div>

                    {/* Homework */}
                    <div className="card">
                        <h2 className="heading-md">Huiswerk (Komend)</h2>
                        <div style={{ marginTop: '16px' }}>
                            {homework.length > 0 ? homework.map(hw => (
                                <div key={hw.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{hw.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#ef5350' }}>
                                        Deadline: {new Date(hw.due_date).toLocaleDateString('nl-NL')}
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--color-text-muted)' }}>Geen huiswerk voor de komende tijd.</p>
                            )}
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className="card">
                        <h2 className="heading-md">Absenties</h2>
                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>{attendanceStats.sick}</span>
                            <div style={{ color: 'var(--color-text-muted)' }}>Ziekmeldingen dit jaar</div>
                        </div>
                        <button
                            className="btn"
                            style={{ width: '100%', background: '#3949ab', color: 'white' }}
                            onClick={() => alert('Ziekmelden functionaliteit komt binnenkort beschikbaar.')}
                        >
                            Kind Ziekmelden
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default function ParentPortalPage() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', color: 'white' }}>Laden...</div>}>
            <ParentPortalContent />
        </Suspense>
    );
}
