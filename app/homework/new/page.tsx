'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_GROUPS } from '../../lib/data';
import { useRouter } from 'next/navigation';

export default function NewHomeworkPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        groupId: '',
        subject: 'Koran',
        title: '',
        description: '',
        dueDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Creating homework", formData);
        setTimeout(() => {
            setLoading(false);
            router.push('/homework');
        }, 1500);
    }

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/homework" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar overzicht</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Huiswerk Opgeven</h1>
                </header>

                <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Voor Groep</label>
                        <select
                            required
                            value={formData.groupId}
                            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        >
                            <option value="" disabled>Selecteer een groep...</option>
                            {MOCK_GROUPS.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Vak</label>
                            <select
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            >
                                <option>Koran</option>
                                <option>Arabisch</option>
                                <option>Fiqh</option>
                                <option>Aqidah</option>
                                <option>Seerah</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Inleverdatum</label>
                            <input
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Titel / Onderwerp</label>
                        <input
                            type="text"
                            required
                            placeholder="Bijv. Surah Al-Mulk 1-15"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Omschrijving</label>
                        <textarea
                            rows={4}
                            placeholder="Extra instructies voor de leerlingen..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)', resize: 'vertical' }}
                        />
                    </div>

                    <button disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Bezig met opslaan...' : 'Huiswerk Plaatsen'}
                    </button>
                </form>
            </div>
        </main>
    );
}
