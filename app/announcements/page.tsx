import Link from 'next/link';

export default function AnnouncementsPage() {
    const ANNOUNCEMENTS = [
        {
            id: 1,
            title: "Start van het nieuwe schooljaar",
            date: "10 Januari 2026",
            content: "Het nieuwe schooljaar gaat van start op 1 februari. Zorg dat alle inschrijvingen voor die tijd compleet zijn. De boekenlijsten zijn beschikbaar bij de administratie.",
            author: "Directie"
        },
        {
            id: 2,
            title: "Ouderavond Groep 3 & 4",
            date: "05 Januari 2026",
            content: "Op vrijdag 20 januari organiseren wij een ouderavond om de voortgang van de leerlingen te bespreken. U ontvangt hiervoor een aparte uitnodiging per mail.",
            author: "Ustadh Ahmed"
        },
        {
            id: 3,
            title: "Koran Competitie Uitslagen",
            date: "28 December 2025",
            content: "MashaAllah, de resultaten van de wintercompetitie zijn bekend! Kijk op het bord in de hal voor de volledige lijst met winnaars.",
            author: "Bestuur"
        }
    ];

    return (
        <main style={{ padding: '40px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>← Terug naar Dashboard</Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <h1 className="heading-lg">Aankondigingen</h1>
                        <button className="btn btn-primary">Nieuw Bericht +</button>
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {ANNOUNCEMENTS.map(item => (
                        <div key={item.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <h2 className="heading-md" style={{ fontSize: '1.4rem' }}>{item.title}</h2>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>{item.date}</span>
                            </div>
                            <p style={{ lineHeight: '1.6', color: '#ddd' }}>
                                {item.content}
                            </p>
                            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                Geplaatst door: {item.author}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
