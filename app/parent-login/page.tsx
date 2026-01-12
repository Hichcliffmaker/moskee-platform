import Link from 'next/link';

export default function ParentLoginPage() {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1a237e 0%, #000000 100%)' // Slightly different color for parent portal
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', border: '1px solid #5c6bc0' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👨‍👩‍👧‍👦</div>
                    <h1 className="heading-lg" style={{ fontSize: '1.8rem', color: '#fff' }}>Ouder Portaal</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Log in om de voortgang van uw kind te bekijken.</p>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Mijn Kind (Studentnummer)</label>
                        <input
                            type="text"
                            defaultValue="ST-2024-001"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #3949ab',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Pincode</label>
                        <input
                            type="password"
                            defaultValue="****"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #3949ab',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        />
                    </div>

                    <Link href="/parent-portal" className="btn" style={{ marginTop: '10px', width: '100%', textAlign: 'center', background: '#3949ab', color: 'white' }}>
                        Inloggen Ouder
                    </Link>

                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
                        <Link href="/login" style={{ color: '#9fa8da' }}>Bent u docent? Klik hier</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
