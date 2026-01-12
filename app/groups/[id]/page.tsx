import Link from 'next/link';
import { MOCK_GROUPS, MOCK_STUDENTS } from '../../lib/data';

export async function generateStaticParams() {
    return MOCK_GROUPS.map((group) => ({
        id: group.id,
    }));
}

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const group = MOCK_GROUPS.find(g => g.id === id);
    // In a real app, query students by group ID. Here we simple filter by name similarity or mock assignment
    // For demo purposes, let's just show all students, or filter if the group name matches partly
    const students = MOCK_STUDENTS.filter(s => s.group.includes(group?.name.split('(')[0].trim() || 'XYZ'));

    if (!group) return <div>Groep niet gevonden</div>;

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/groups" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ← Terug naar Groepen
                    </Link>
                </div>

                <div className="card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, var(--color-bg-card), #08201a)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="heading-lg" style={{ marginBottom: '8px' }}>{group.name}</h1>
                            <div style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', display: 'flex', gap: '24px' }}>
                                <span>📍 {group.room}</span>
                                <span>🎓 {group.teacher}</span>
                                <span>🕒 {group.schedule}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button className="btn btn-primary">Bewerk Groep</button>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="heading-md" style={{ marginBottom: '20px' }}>Studenten in deze groep</h2>

                    {students.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                            Nog geen studenten gekoppeld aan deze exacte groepsnaam in de mock data. <br />
                            (Experimenteer met naamgeving in data.ts om te zien werken)
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {students.map(student => (
                                <div key={student.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-main)', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                            {student.firstName[0]}{student.lastName[0]}
                                        </div>
                                        <div style={{ fontWeight: '600' }}>{student.firstName} {student.lastName}</div>
                                    </div>
                                    <Link href={`/students/${student.id}`} className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>
                                        Bekijk Dossier →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
