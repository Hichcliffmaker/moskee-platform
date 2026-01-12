import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Al-Madrasa Moskee Platform',
        short_name: 'Al-Madrasa',
        description: 'Beheerplatform voor de moskee en school.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a1f18',
        theme_color: '#0a1f18',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
