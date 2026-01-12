'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function HomeButton() {
    const pathname = usePathname();

    // Don't show on dashboard
    if (pathname === '/') return null;

    return (
        <Link
            href="/"
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-gold)',
                color: '#0a1f18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                zIndex: 9999,
                fontSize: '2rem',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Terug naar Dashboard"
        >
            🏠
        </Link>
    );
}
