import './globals.css'
import type { Metadata, Viewport } from 'next'
import ServiceWorkerUpdate from '@/components/ServiceWorkerUpdate'

export const metadata: Metadata = {
  title: 'Travel Companion',
  description: 'Your offline-first travel planning companion',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Travel Companion',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        <div className="min-h-screen bg-background">
          {children}
          <ServiceWorkerUpdate />
        </div>
      </body>
    </html>
  )
}
