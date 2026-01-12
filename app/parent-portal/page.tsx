import Link from 'next/link';

export default function ParentPortalPage() {
    return (
        <main style={{ padding: '40px', background: '#050510', minHeight: '100vh' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg" style={{ color: '#fff' }}>Hoi, Ahmed El Amrani</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Ouder van <strong>Bilal (Groep 4)</strong></p>
                    </div>
                    <Link href="/parent-login" className="btn btn-ghost">Uitloggen</Link>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                    {/* Notices */}
                    <div className="card" style={{ gridColumn: '1 / -1', background: 'linear-gradient(90deg, #1a237e, #0d47a1)' }}>
                        <h2 className="heading-md" style={{ color: 'white' }}>📢 Mededeling</h2>
                        <p style={{ color: '#e3f2fd' }}>
                            Vergeet niet om het inschrijfformulier voor het schoolreisje in te leveren voor woensdag!
                        </p>
                    </div>

                    {/* Recent Grades */}
                    <div className="card">
                        <h2 className="heading-md">Cijfers deze week</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <span>Koran (Huiswerk)</span>
                                <span style={{ fontWeight: 'bold', color: '#81c784' }}>8.5</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <span>Aqidah (Overhoring)</span>
                                <span style={{ fontWeight: 'bold', color: '#fff' }}>7.0</span>
                            </div>
                        </div>
                        <button className="btn btn-ghost" style={{ width: '100%', marginTop: '10px' }}>Volledig rapport bekijken →</button>
                    </div>

                    {/* Homework */}
                    <div className="card">
                        <h2 className="heading-md">Huiswerk</h2>
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold' }}>Surah Al-Mulk 1-15</div>
                                <div style={{ fontSize: '0.9rem', color: '#ef5350' }}>Zaterdag 20 Jan</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 'bold' }}>Fiqh Samenvatting</div>
                                <div style={{ fontSize: '0.9rem', color: '#ef5350' }}>Dinsdag 24 Jan</div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className="card">
                        <h2 className="heading-md">Absenties</h2>
                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>0</span>
                            <div style={{ color: 'var(--color-text-muted)' }}>Ziekmeldingen dit jaar</div>
                        </div>
                        <button className="btn" style={{ width: '100%', background: '#3949ab', color: 'white' }}>Kind Ziekmelden</button>
                    </div>

                </div>
            </div>
        </main>
    );
}
