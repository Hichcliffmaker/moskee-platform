'use client';

import { use } from 'react';
import Link from 'next/link';
import { MOCK_STUDENTS } from '../../../lib/data';

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const student = MOCK_STUDENTS.find(s => s.id === id);

    if (!student) return <div>Student niet gevonden</div>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navigation Bar (Hidden when printing) */}
            <div className="no-print" style={{ padding: '20px', background: '#0a1f18', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
                <Link href={`/students/${id}`} style={{ color: 'white' }}>← Terug naar Profiel</Link>
                <button onClick={handlePrint} className="btn btn-primary">🖨️ Download PDF / Print</button>
            </div>

            {/* Certificate Container */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#333', padding: '40px' }}>

                {/* The Certificate Paper */}
                <div className="certificate-paper" style={{
                    width: '297mm', // A4 Landscape
                    height: '210mm',
                    background: '#fff',
                    color: '#000',
                    padding: '40px',
                    position: 'relative',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Border Decoration */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        border: '10px double #0a1f18',
                        padding: '10px',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            border: '2px solid #d4af37',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(255,255,255,0) 70%)'
                        }}>

                            {/* Header */}
                            <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '4px', color: '#0a1f18', marginBottom: '20px' }}>
                                Al-Madrasa Instituut
                            </div>

                            <h1 style={{ fontSize: '4rem', fontFamily: 'serif', color: '#d4af37', margin: '0 0 20px 0', lineHeight: 1 }}>
                                Certificaat
                            </h1>

                            <div style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '30px' }}>
                                van Uitmuntendheid
                            </div>

                            <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                                Hierbij verklaren wij dat
                            </div>

                            {/* Student Name */}
                            <div style={{
                                fontSize: '3.5rem',
                                fontFamily: 'serif',
                                color: '#0a1f18',
                                borderBottom: '2px solid #d4af37',
                                padding: '0 40px',
                                margin: '20px 0 40px 0'
                            }}>
                                {student.firstName} {student.lastName}
                            </div>

                            <div style={{ fontSize: '1.2rem' }}>
                                succesvol het volgende examen heeft behaald:
                            </div>

                            {/* Milestone */}
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0a1f18', margin: '20px 0' }}>
                                JUZ 30 - AMMA
                            </div>

                            {/* Date & Signatures */}
                            <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', marginTop: '60px', textAlign: 'center' }}>
                                <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>Ustadha R. Zora</div>
                                    <div style={{ fontSize: '0.9rem' }}>Hoofddocent</div>
                                </div>

                                <div style={{ marginBottom: '-20px' }}>
                                    {/* Seal Mockup */}
                                    <div style={{ width: '100px', height: '100px', border: '3px solid #d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 'bold', fontSize: '0.8rem', transform: 'rotate(-10deg)', textShadow: '0px 0px 5px rgba(255,255,255,1)' }}>
                                        OFFICIEEL<br />ZEGEL
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString('nl-NL')}</div>
                                    <div style={{ fontSize: '0.9rem' }}>Datum</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* Print Styles */}
            <style jsx global>{`
            @media print {
                @page { 
                    size: landscape; 
                    margin: 0;
                }
                body { 
                    background: white; 
                    margin: 0;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .no-print { display: none !important; }
                .certificate-paper {
                    width: 100vw !important;
                    height: 100vh !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                main { background: white !important; display: block !important; }
            }
        `}</style>
        </main>
    );
}
