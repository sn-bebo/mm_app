import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Travel Companion',
    short_name: 'Travel',
    description: 'Your personal travel companion for managing trips, places to visit, shopping, and food spots',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon?<generated>',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon?<generated>',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['travel', 'productivity', 'lifestyle'],
    screenshots: [],
  };
}
