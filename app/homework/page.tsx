import Link from 'next/link';
import { MOCK_HOMEWORK } from '../lib/data';

export default function HomeworkPage() {
    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">Huiswerk</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van openstaand en opgegeven huiswerk.</p>
                    </div>
                    <Link href="/homework/new" className="btn btn-primary">
                        + &nbsp; Huiswerk Opgeven
                    </Link>
                </header>

                <div style={{ display: 'grid', gap: '24px' }}>
                    {MOCK_HOMEWORK.map(hw => (
                        <div key={hw.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '4px 12px',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        color: 'var(--color-gold)'
                                    }}>
                                        {hw.subject}
                                    </span>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{hw.groupName}</span>
                                </div>
                                <h2 className="heading-md" style={{ marginBottom: '8px' }}>{hw.title}</h2>
                                <p style={{ color: 'var(--color-text-muted)' }}>{hw.description}</p>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '150px' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>INLEVEREN VOOR</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hw.dueDate}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
