'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];

export default function NewGroupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        teacher: '',
        room: '',
        description: ''
    });

    // Schedule State: Track times for each day independently
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [dayTimes, setDayTimes] = useState<Record<string, { start: string, end: string }>>({});

    const [loading, setLoading] = useState(false);

    const handleDayToggle = (day: string) => {
        if (selectedDays.includes(day)) {
            // Remove day
            setSelectedDays(selectedDays.filter(d => d !== day));
            const newTimes = { ...dayTimes };
            delete newTimes[day];
            setDayTimes(newTimes);
        } else {
            // Add day with default times
            const newSelection = [...selectedDays, day];
            // Sort based on week order
            newSelection.sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
            setSelectedDays(newSelection);

            // Set default time or copy from last added day for convenience
            setDayTimes({
                ...dayTimes,
                [day]: { start: '10:00', end: '13:00' }
            });
        }
    };

    const handleTimeChange = (day: string, type: 'start' | 'end', value: string) => {
        setDayTimes({
            ...dayTimes,
            [day]: { ...dayTimes[day], [type]: value }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Build the schedule string
        // Format: "Zaterdag 10:00-13:00 & Zondag 11:00-14:00"
        const scheduleParts = selectedDays.map(day => {
            const times = dayTimes[day];
            return `${day} ${times.start}-${times.end}`;
        });

        const scheduleString = scheduleParts.length > 0
            ? scheduleParts.join(' & ')
            : 'Geen roostertijden';

        const { error } = await supabase.from('groups').insert([{
            name: formData.name,
            teacher: formData.teacher,
            room: formData.room,
            schedule: scheduleString,
            description: formData.description
        }]);

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
            setLoading(false);
        } else {
            router.push('/groups');
        }
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

                    {/* Flexible Schedule Selector */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', color: 'var(--color-text-muted)' }}>Lestijden & Dagen</label>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>

                            {/* Day Buttons */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                {DAYS.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDayToggle(day)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: selectedDays.includes(day) ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                                            background: selectedDays.includes(day) ? 'var(--color-gold)' : 'transparent',
                                            color: selectedDays.includes(day) ? 'black' : 'var(--color-text-muted)',
                                            fontWeight: selectedDays.includes(day) ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            {/* Time Inputs Per Selected Day */}
                            {selectedDays.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {selectedDays.map(day => (
                                        <div key={day} style={{
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--color-border)'
                                        }}>
                                            <div style={{ width: '100px', fontWeight: 'bold', color: 'var(--color-gold)' }}>{day}</div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="time"
                                                    required
                                                    value={dayTimes[day]?.start || '10:00'}
                                                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', background: '#0a1f18', color: 'white' }}
                                                />
                                                <span style={{ color: 'var(--color-text-muted)' }}>tot</span>
                                                <input
                                                    type="time"
                                                    required
                                                    value={dayTimes[day]?.end || '13:00'}
                                                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', background: '#0a1f18', color: 'white' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                    Selecteer hierboven de dagen om tijden in te stellen.
                                </div>
                            )}
                        </div>
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
