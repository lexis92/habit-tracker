import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { SplashScreen } from '@/components/SplashScreen'

export const metadata: Metadata = {
  title: 'Streakcred+',
  description: 'Build habits that actually stick.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Streakcred+' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#B07D6E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream-100 font-sans antialiased">
        <div className="mx-auto max-w-[480px] h-dvh relative overflow-hidden bg-cream-100">
          <SplashScreen />
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
