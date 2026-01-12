import Link from 'next/link';
import { MOCK_GROUPS } from '../lib/data';

export default function GroupsPage() {
    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">Klassen & Groepen</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van alle lesgroepen, docenten en lokalen.</p>
                    </div>
                    <Link href="/groups/new" className="btn btn-primary">
                        + &nbsp; Nieuwe Groep
                    </Link>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {MOCK_GROUPS.map(group => (
                        <Link href={`/groups/${group.id}`} key={group.id} style={{ display: 'block' }}>
                            <div className="card" style={{
                                height: '100%',
                                transition: 'all 0.2s',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer'
                            }}

                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <h2 className="heading-md" style={{ marginBottom: '4px' }}>{group.name}</h2>
                                    <span style={{
                                        background: 'rgba(212, 175, 55, 0.1)',
                                        color: 'var(--color-gold)',
                                        padding: '4px 10px',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {group.studentsCount} leerlingen
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>🎓</span>
                                        <span>{group.teacher}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>📍</span>
                                        <span>{group.room}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>🕒</span>
                                        <span>{group.schedule}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
