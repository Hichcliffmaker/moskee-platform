import Link from 'next/link';
import { MOCK_STUDENTS } from '../lib/data';

export default function GradesPage() {
    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">Cijferlijsten</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van resultaten per vak en groep.</p>
                    </div>
                    <Link href="/grades/enter" className="btn btn-primary">
                        + &nbsp; Cijfer Invoeren
                    </Link>
                </header>

                {/* Filters (Mock) */}
                <div className="card" style={{ marginBottom: '30px', display: 'flex', gap: '16px' }}>
                    <select style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: '#0a1f18', color: 'white', border: '1px solid var(--color-border)' }}>
                        <option>Alle Groepen</option>
                        <option>Groep 3</option>
                        <option>Groep 4</option>
                    </select>
                    <select style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: '#0a1f18', color: 'white', border: '1px solid var(--color-border)' }}>
                        <option>Alle Vakken</option>
                        <option>Koran</option>
                        <option>Fiqh</option>
                    </select>
                </div>

                {/* Global Grades Table (Mock View) */}
                <div className="card">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                                <th style={{ padding: '16px' }}>Student</th>
                                <th style={{ padding: '16px' }}>Groep</th>
                                <th style={{ padding: '16px' }}>Vak</th>
                                <th style={{ padding: '16px' }}>Type</th>
                                <th style={{ padding: '16px' }}>Omschrijving</th>
                                <th style={{ padding: '16px' }}>Datum</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Cijfer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mock Rows */}
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px', fontWeight: '600' }}>Bilal El Amrani</td>
                                <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>Gr. 4</td>
                                <td style={{ padding: '16px' }}>Koran</td>
                                <td style={{ padding: '16px' }}>Huiswerk</td>
                                <td style={{ padding: '16px' }}>Surah Yasin (1-10)</td>
                                <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>13 Jan</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#81c784' }}>8.5</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px', fontWeight: '600' }}>Amina Bakker</td>
                                <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>Gr. 3</td>
                                <td style={{ padding: '16px' }}>Arabisch</td>
                                <td style={{ padding: '16px' }}>Toets</td>
                                <td style={{ padding: '16px' }}>Alfabet letters</td>
                                <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>12 Jan</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#e57373' }}>5.0</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px', fontWeight: '600' }}>Ibrahim Demir</td>
                                <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>Gr. 5</td>
                                <td style={{ padding: '16px' }}>Fiqh</td>
                                <td style={{ padding: '16px' }}>Praktijk</td>
                                <td style={{ padding: '16px' }}>Salah houding</td>
                                <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>10 Jan</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>7.8</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
