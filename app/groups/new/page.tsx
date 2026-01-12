'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewGroupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        teacher: '',
        room: '',
        schedule: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        console.log('Creating group:', formData);

        setTimeout(() => {
            setLoading(false);
            // Redirect to groups list
            router.push('/groups');
        }, 1500);
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/groups" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar klassenoverzicht</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Nieuwe Groep Aanmaken</h1>
                </header>

                <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '24px' }}>

                    <h2 className="heading-md">Details van de klas</h2>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Naam Groep</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            type="text"
                            placeholder="Bijv. Groep 4 (Koran - Hifz)"
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Docent</label>
                            <input
                                required
                                value={formData.teacher}
                                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                type="text"
                                placeholder="Bijv. Ustadh Ali"
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Lokaal / Ruimte</label>
                            <input
                                required
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                type="text"
                                placeholder="Bijv. Lokaal 2.03"
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Lestijden (Schema)</label>
                        <input
                            required
                            value={formData.schedule}
                            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                            type="text"
                            placeholder="Bijv. Zaterdag & Zondag 10:00 - 13:00"
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Omschrijving</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            placeholder="Extra informatie over deze groep..."
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                            {loading ? 'Bezig met maken...' : 'Groep Toevoegen'}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}
