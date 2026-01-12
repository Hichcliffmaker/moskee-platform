'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function NewStudentPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        group: 'Groep 1 (Basis)',
        dob: '',
        parentName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('students')
            .insert([
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    group_name: formData.group,
                    dob: formData.dob || null,
                    parent_name: formData.parentName,
                    phone: formData.phone,
                    // Note: email and address are not in the current DB schema yet, 
                    // so we only save what we created in step 1.
                    status: 'active'
                }
            ]);

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
            setLoading(false);
        } else {
            // Redirect to students list
            router.push('/students');
        }
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/students" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar overzicht</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Nieuwe Student Inschrijven</h1>
                </header>

                <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '24px' }}>

                    <h2 className="heading-md">Persoonsgegevens</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Voornaam</label>
                            <input
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                type="text"
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Achternaam</label>
                            <input
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                type="text"
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Geboortedatum</label>
                            <input
                                name="dob"
                                required
                                value={formData.dob}
                                onChange={handleChange}
                                type="date"
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Groep / Klas</label>
                            <select
                                name="group"
                                value={formData.group}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            >
                                <option>Groep 1 (Basis)</option>
                                <option>Groep 2 (Beginners)</option>
                                <option>Groep 3 (Koran Basis)</option>
                                <option>Groep 4 (Koran Hifz)</option>
                                <option>Groep 5 (Fiqh & Tafsir)</option>
                                <option>Groep 6 (Gevorderd)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '10px 0' }}></div>

                    <h2 className="heading-md">Contactgegevens Ouders/Voogd</h2>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Naam Ouder/Voogd</label>
                        <input
                            name="parentName"
                            required
                            value={formData.parentName}
                            onChange={handleChange}
                            type="text"
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Telefoonnummer</label>
                            <input
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                type="tel"
                                placeholder="06-12345678"
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Emailadres</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Adres</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            type="text"
                            placeholder="Straat en huisnummer, Postcode, Stad"
                            style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
                        <button type="button" onClick={() => router.back()} className="btn btn-ghost" style={{ flex: 1, border: '1px solid var(--color-border)' }}>Annuleren</button>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                            {loading ? 'Bezig met opslaan...' : 'Student Inschrijven'}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}
