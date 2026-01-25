'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [mosqueName, setMosqueName] = useState('Al-Madrasa');
    const [city, setCity] = useState('Amsterdam');
    const [allowTeacherLogin, setAllowTeacherLogin] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    // Theme State
    const [theme, setTheme] = useState('midnight');

    // Admin Management State
    const [admins, setAdmins] = useState<any[]>([]);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState(''); // New Password State
    const [newAdminRole, setNewAdminRole] = useState('Moderator');

    // Saving State
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial load from Supabase
    useEffect(() => {
        const userStr = localStorage.getItem('moskee_user');
        if (!userStr) {
            window.location.href = '/login';
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'Super Admin' && user.role !== 'Admin') {
            alert('Enkel beheerders kunnen de instellingen wijzigen.');
            window.location.href = '/';
            return;
        }

        async function fetchSettings() {
            setLoading(true);
            // Settings
            const { data: settingsData } = await supabase.from('settings').select('*');
            if (settingsData) {
                const nameSetting = settingsData.find(s => s.key === 'mosque_name');
                const citySetting = settingsData.find(s => s.key === 'mosque_city');
                if (nameSetting) setMosqueName(nameSetting.value);
                if (citySetting) setCity(citySetting.value);
            }

            // Admins
            const { data: usersData } = await supabase.from('dashboard_users').select('*');
            if (usersData) {
                setAdmins(usersData);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        // Load theme from local storage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);
    }, []);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);

        // Persist to Supabase
        const updates = [
            { key: 'mosque_name', value: mosqueName },
            { key: 'mosque_city', value: city }
        ];

        const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key' });

        if (error) {
            alert('Fout bij opslaan: ' + error.message);
            setIsSaving(false);
            return;
        }

        // Also update local storage for immediate fallback/speed if needed, but DB is truth
        localStorage.setItem('mosqueName', mosqueName);

        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 500);
    };

    const handleAddAdmin = async () => {
        if (newAdminName.trim() === '' || newAdminPassword.trim() === '') return;

        const newUser = {
            username: newAdminName,
            password: newAdminPassword,
            role: newAdminRole
        };

        const { data, error } = await supabase.from('dashboard_users').insert([newUser]).select();

        if (error) {
            alert('Fout bij toevoegen: ' + error.message);
        } else if (data) {
            setAdmins([...admins, data[0]]);
            setNewAdminName('');
            setNewAdminPassword('');
            setShowAddAdmin(false);
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) return;

        const { error } = await supabase.from('dashboard_users').delete().eq('id', id);

        if (error) {
            alert('Fout bij verwijderen: ' + error.message);
        } else {
            setAdmins(admins.filter((a) => a.id !== id));
        }
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

                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', paddingBottom: '20px' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-text-main)' }}>Thema & Uiterlijk</h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px' }}>
                                        {/* Midnight Gold */}
                                        <button
                                            onClick={() => handleThemeChange('midnight')}
                                            style={{
                                                border: theme === 'midnight' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                background: '#0a1f18',
                                                cursor: 'pointer',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ width: '100%', height: '40px', background: 'linear-gradient(135deg, #0a1f18, #0f2e23)', borderRadius: '4px', marginBottom: '8px' }}></div>
                                            <div style={{ color: 'white', fontSize: '0.9rem' }}>Midnight</div>
                                        </button>

                                        {/* Royal Blue */}
                                        <button
                                            onClick={() => handleThemeChange('royal')}
                                            style={{
                                                border: theme === 'royal' ? '2px solid #38bdf8' : '1px solid var(--color-border)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                background: '#0f172a', /* Dark Blue preview background */
                                                cursor: 'pointer',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ width: '100%', height: '40px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '4px', marginBottom: '8px' }}></div>
                                            <div style={{ color: 'white', fontSize: '0.9rem' }}>Royal Blue</div>
                                        </button>

                                        {/* Desert Sand */}
                                        <button
                                            onClick={() => handleThemeChange('desert')}
                                            style={{
                                                border: theme === 'desert' ? '2px solid #b45309' : '1px solid var(--color-border)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                background: '#fbf6f1', /* Light preview background */
                                                cursor: 'pointer',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ width: '100%', height: '40px', background: 'linear-gradient(135deg, #fbf6f1, #e7e5e4)', borderRadius: '4px', marginBottom: '8px' }}></div>
                                            <div style={{ color: '#422006', fontSize: '0.9rem' }}>Desert</div>
                                        </button>
                                    </div>
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
                                                <span>{admin.username} ({admin.role})</span>
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
                                                <input
                                                    type="text"
                                                    placeholder="Wachtwoord"
                                                    value={newAdminPassword}
                                                    onChange={(e) => setNewAdminPassword(e.target.value)}
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
