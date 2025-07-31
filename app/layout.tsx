import type { Metadata } from 'next'
import './globals.css'
import PageTransition from '@/components/ui/PageTransition'
import ProgressBar from '@/components/ui/ProgressBar'
import { AnimationProvider } from '@/contexts/AnimationContext'
import { ApiLoaderProvider } from '@/contexts/ApiLoaderContext'
import { DarkModeProvider } from '@/contexts/DarkModeContext'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'LoomSathi - Digital Solutions for Malegaon Textile Industry',
  description: 'Empowering Malegaon\'s textile and powerloom industry with digital solutions for better management, efficiency, and growth.',
  keywords: 'textile, powerloom, Malegaon, digital solutions, loom management, textile industry',
  authors: [{ name: 'LoomSathi Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

function ProgressBarWrapper() {
  return <ProgressBar isLoading={false} />
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DarkModeProvider>
          <AnimationProvider>
            <ApiLoaderProvider>
              <Suspense fallback={null}>
                <ProgressBarWrapper />
              </Suspense>
              <PageTransition>
                {children}
              </PageTransition>
            </ApiLoaderProvider>
          </AnimationProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
} 