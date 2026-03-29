import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ReadLight',
    short_name: 'ReadLight',
    description: '독서 동반자 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#F5A623',
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
  }
}
