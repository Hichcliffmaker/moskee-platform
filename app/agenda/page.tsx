'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function AgendaPage() {
    const [agendaItems, setAgendaItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newItem, setNewItem] = useState({ date: '', title: '', description: '', type: 'event', time: '' });

    const fetchAgenda = async () => {
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
    };

    useEffect(() => {
        const userStr = localStorage.getItem('moskee_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'Admin' || user.role === 'Super Admin') {
                setIsAdmin(true);
            }
        }
        fetchAgenda();
    }, []);

    const handleAddItem = () => {
        setIsModalOpen(true);
    };

    const handleSaveItem = async () => {
        if (!newItem.date || !newItem.title) {
            alert('Datum en titel zijn verplicht.');
            return;
        }

        const { error } = await supabase
            .from('agenda')
            .insert([newItem]);

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
        } else {
            setIsModalOpen(false);
            setNewItem({ date: '', title: '', description: '', type: 'event', time: '' });
            fetchAgenda();
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return;

        const { error } = await supabase
            .from('agenda')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Fout bij verwijderen: ' + error.message);
        } else {
            fetchAgenda();
        }
    };

    return (
        <main style={{ padding: '40px' }}>
            {/* Modal for adding items */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div className="card" style={{ maxWidth: '450px', width: '100%', background: 'var(--color-bg-card)' }}>
                        <h2 className="heading-md" style={{ marginBottom: '20px' }}>Nieuw Agenda Item</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Datum</label>
                                <input type="date" value={newItem.date} onChange={e => setNewItem({ ...newItem, date: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Titel</label>
                                <input type="text" placeholder="Bijv. Suikerfeest of Lente Vakantie" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Beschrijving</label>
                                <textarea placeholder="Optionele details..." value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white', minHeight: '80px' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Type</label>
                                    <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }}>
                                        <option value="event">Evenement</option>
                                        <option value="holiday">Vakantie</option>
                                        <option value="class">Lesdag</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Tijd (optioneel)</label>
                                    <input type="text" placeholder="Bijv. 10:00 - 12:00" value={newItem.time} onChange={e => setNewItem({ ...newItem, time: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button onClick={handleSaveItem} className="btn btn-primary" style={{ flex: 1 }}>Opslaan</button>
                                <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost" style={{ flex: 1, border: '1px solid var(--color-border)' }}>Annuleren</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading-lg">School Agenda</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Overzicht van lessen, vakanties en activiteiten.</p>
                    </div>
                    {isAdmin && (
                        <button onClick={handleAddItem} className="btn btn-primary">
                            + &nbsp; Item Toevoegen
                        </button>
                    )}
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
                                    alignItems: 'center',
                                    position: 'relative'
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
                                            {item.type === 'class' && <span style={{ fontSize: '0.8rem', background: '#64b5f6', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>LESDAG</span>}
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{item.time || 'Hele dag'} {item.date.split('-').reverse()[1] !== new Date().getMonth() + 1 && <span style={{ opacity: 0.5 }}>({new Date(item.date).getFullYear()})</span>}</span>
                                        </div>
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</h2>
                                        <p style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
                                    </div>

                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            style={{ background: 'none', border: 'none', color: '#e57373', cursor: 'pointer', padding: '10px' }}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
