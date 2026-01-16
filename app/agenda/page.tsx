'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function AgendaPage() {
    const [agendaItems, setAgendaItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAgenda() {
            setLoading(true);
            const { data, error } = await supabase
                .from('agenda')
                .select('*')
                .order('date', { ascending: true });

            if (data) {
                setAgendaItems(data);
            } else if (error) {
                console.error('Error fetching agenda:', error);
            }
            setLoading(false);
        }
        fetchAgenda();
    }, []);

    const handleAddItem = () => {
        alert("Functionaliteit 'Item Toevoegen' volgt binnenkort!");
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">School Agenda</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van lessen, vakanties en activiteiten.</p>
                    </div>
                    <button onClick={handleAddItem} className="btn btn-primary">
                        + &nbsp; Item Toevoegen
                    </button>
                </header>

                <div className="card">
                    {/* Simple List View */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Laden...</div>
                        ) : agendaItems.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Geen agenda items gevonden.</div>
                        ) : (
                            agendaItems.map((item, index) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    padding: '24px',
                                    borderBottom: index !== agendaItems.length - 1 ? '1px solid var(--color-border)' : 'none',
                                    gap: '24px',
                                    alignItems: 'center'
                                }}>
                                    {/* Date Box */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '80px',
                                        height: '80px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: item.type === 'holiday' ? '1px solid #e57373' : '1px solid var(--color-border)'
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                            {new Date(item.date).getDate()}
                                        </div>
                                        <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(item.date).toLocaleString('nl-NL', { month: 'short' })}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            {item.type === 'holiday' && <span style={{ fontSize: '0.8rem', background: '#e57373', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>VAKANTIE</span>}
                                            {item.type === 'event' && <span style={{ fontSize: '0.8rem', background: 'var(--color-gold)', color: 'black', padding: '2px 8px', borderRadius: '4px' }}>EVENT</span>}
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{item.time || 'Hele dag'}</span>
                                        </div>
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</h2>
                                        <p style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
