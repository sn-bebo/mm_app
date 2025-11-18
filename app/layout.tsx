import './globals.css'
import type { Metadata, Viewport } from 'next'
import ServiceWorkerUpdate from '@/components/ServiceWorkerUpdate'
import ThemeProvider from '@/components/ThemeProvider'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            {children}
            <ServiceWorkerUpdate />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
