import Link from 'next/link';
import { MOCK_GROUPS } from '../lib/data';

export default function QuranTrackerPage() {
    // Only show groups relevant for Quran (mock filter)
    const quranGroups = MOCK_GROUPS.filter(g => g.name.toLowerCase().includes('koran') || g.name.toLowerCase().includes('hifz') || g.name.toLowerCase().includes('basis'));

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Dashboard</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Koran Volgsysteem</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Selecteer een groep om voortgang te registreren.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {quranGroups.map(group => (
                        <Link href={`/quran-tracker/${group.id}`} key={group.id} className="card" style={{ display: 'block', transition: 'all 0.2s', border: '1px solid var(--color-border)', cursor: 'pointer', background: 'linear-gradient(135deg, var(--color-bg-card), #08201a)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h2 className="heading-md">{group.name}</h2>
                                <span style={{ fontSize: '2rem' }}>📖</span>
                            </div>
                            <div style={{ color: 'var(--color-text-muted)' }}>
                                <div>🎓 {group.teacher}</div>
                                <div>🕒 {group.schedule}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
