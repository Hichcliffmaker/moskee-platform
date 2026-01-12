'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [mosqueName, setMosqueName] = useState('Al-Madrasa');
    const [city, setCity] = useState('Amsterdam');
    const [allowTeacherLogin, setAllowTeacherLogin] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    // Admin Management State
    const [admins, setAdmins] = useState([
        { id: 1, name: 'admin', role: 'Super Admin' },
        { id: 2, name: 'bestuur', role: 'Moderator' }
    ]);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminRole, setNewAdminRole] = useState('Moderator');

    // Saving State
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Initial load from local storage
    useState(() => {
        if (typeof window !== 'undefined') {
            const savedName = localStorage.getItem('mosqueName');
            const savedCity = localStorage.getItem('mosqueCity');
            if (savedName) setMosqueName(savedName);
            if (savedCity) setCity(savedCity);
        }
    });

    const handleSaveSettings = () => {
        setIsSaving(true);
        // Persist to LocalStorage
        localStorage.setItem('mosqueName', mosqueName);
        localStorage.setItem('mosqueCity', city);

        // Dispatch a custom event so other components update immediately if they are listening
        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const handleAddAdmin = () => {
        if (newAdminName.trim() === '') return;
        const newAdmin = {
            id: Date.now(),
            name: newAdminName,
            role: newAdminRole
        };
        setAdmins([...admins, newAdmin]);
        setNewAdminName('');
        setShowAddAdmin(false);
    };

    const handleDeleteAdmin = (id: number) => {
        setAdmins(admins.filter((a) => a.id !== id));
    };

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Dashboard</Link>
                    <h1 className="heading-lg" style={{ marginTop: '10px' }}>Instellingen</h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>

                    {/* Sidebar Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => setActiveTab('general')}
                            style={{
                                textAlign: 'left',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                background: activeTab === 'general' ? 'var(--color-bg-card)' : 'transparent',
                                color: activeTab === 'general' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                                border: activeTab === 'general' ? '1px solid var(--color-border)' : '1px solid transparent',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'general' ? 'bold' : 'normal'
                            }}
                        >
                            Algemeen
                        </button>
                        <button
                            onClick={() => setActiveTab('school')}
                            style={{
                                textAlign: 'left',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                background: activeTab === 'school' ? 'var(--color-bg-card)' : 'transparent',
                                color: activeTab === 'school' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                                border: activeTab === 'school' ? '1px solid var(--color-border)' : '1px solid transparent',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'school' ? 'bold' : 'normal'
                            }}
                        >
                            School & Onderwijs
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            style={{
                                textAlign: 'left',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                background: activeTab === 'users' ? 'var(--color-bg-card)' : 'transparent',
                                color: activeTab === 'users' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                                border: activeTab === 'users' ? '1px solid var(--color-border)' : '1px solid transparent',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'users' ? 'bold' : 'normal'
                            }}
                        >
                            Gebruikersbeheer
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="card">

                        {activeTab === 'general' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <h2 className="heading-md">Algemene Instellingen</h2>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Naam Moskee / School</label>
                                    <input
                                        type="text"
                                        value={mosqueName}
                                        onChange={(e) => setMosqueName(e.target.value)}
                                        style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Stad (voor gebedstijden)</label>
                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                    >
                                        <option>Amsterdam</option>
                                        <option>Rotterdam</option>
                                        <option>Den Haag</option>
                                        <option>Utrecht</option>
                                    </select>
                                </div>

                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={maintenanceMode}
                                            onChange={(e) => setMaintenanceMode(e.target.checked)}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>Onderhoudsmodus</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Blokkeer toegang voor ouders/studenten</div>
                                        </div>
                                    </label>
                                </div>

                                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isSaving}
                                        className="btn btn-primary"
                                    >
                                        {isSaving ? 'Bezig...' : 'Opslaan'}
                                    </button>
                                    {showSuccess && <span style={{ marginLeft: '10px', color: '#81c784', fontSize: '0.9rem' }}>✅ Opgeslagen!</span>}
                                </div>
                            </div>
                        )}

                        {activeTab === 'school' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <h2 className="heading-md">School Configuratie</h2>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Huidig Schooljaar</label>
                                    <input
                                        type="text"
                                        defaultValue="2025-2026"
                                        style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Standaard Cijferschaal</label>
                                    <select style={{ width: '100%', padding: '12px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: 'var(--radius-sm)' }}>
                                        <option>1 - 10 (Nederlands)</option>
                                        <option>A - F (Internationaal)</option>
                                        <option>O/V/G (Beoordeling)</option>
                                    </select>
                                </div>

                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Export & Data</h3>
                                    <button className="btn btn-ghost" style={{ border: '1px solid var(--color-border)', marginRight: '10px' }}>
                                        📥 Exporteer Alle Studenten (CSV)
                                    </button>
                                    <button className="btn btn-ghost" style={{ border: '1px solid var(--color-border)' }}>
                                        📥 Exporteer Cijferlijsten (Excel)
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <h2 className="heading-md">Gebruikers & Rechten</h2>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={allowTeacherLogin}
                                        onChange={(e) => setAllowTeacherLogin(e.target.checked)}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Docenten Login Toestaan</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Docenten mogen zelf cijfers invoeren</div>
                                    </div>
                                </label>

                                <div style={{ marginTop: '20px' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Beheerders</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {admins.map((admin) => (
                                            <div key={admin.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                <span>{admin.name} ({admin.role})</span>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <span style={{ color: '#81c784', fontSize: '0.9rem' }}>Actief</span>
                                                    {admin.role !== 'Super Admin' && (
                                                        <button
                                                            onClick={() => handleDeleteAdmin(admin.id)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                            title="Verwijder"
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!showAddAdmin ? (
                                        <button
                                            onClick={() => setShowAddAdmin(true)}
                                            className="btn btn-ghost"
                                            style={{ marginTop: '12px', fontSize: '0.9rem', border: '1px solid var(--color-border)' }}
                                        >
                                            + Beheerder Toevoegen
                                        </button>
                                    ) : (
                                        <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                                            <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Nieuwe Beheerder</h4>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Gebruikersnaam"
                                                    value={newAdminName}
                                                    onChange={(e) => setNewAdminName(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: '4px' }}
                                                />
                                                <select
                                                    value={newAdminRole}
                                                    onChange={(e) => setNewAdminRole(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', background: '#0a1f18', border: '1px solid var(--color-border)', color: 'white', borderRadius: '4px' }}
                                                >
                                                    <option>Moderator</option>
                                                    <option>Admin</option>
                                                    <option>Lees-alleen</option>
                                                </select>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                    <button onClick={handleAddAdmin} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Toevoegen</button>
                                                    <button onClick={() => setShowAddAdmin(false)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Annuleren</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}
