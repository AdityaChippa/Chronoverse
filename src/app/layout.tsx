import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Nova } from '@/components/features/Nova'
import { SoundManager } from '@/components/features/SoundManager'
import { EventProvider } from '@/contexts/EventContext'
import { ThreeProvider } from '@/contexts/ThreeContext'
import { SoundProvider } from '@/contexts/SoundContext'
import { AIProvider } from '@/contexts/AIContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: 'ChronoVerse - Where Every Day Births a Universe of Discovery',
  description: 'An immersive astronomical journey through space and time. Explore celestial events, missions, and the cosmos with AI-powered guidance.',
  keywords: ['space', 'astronomy', 'NASA', 'planetarium', 'education', 'cosmos'],
  authors: [{ name: 'ChronoVerse Team' }],
  openGraph: {
    title: 'ChronoVerse',
    description: 'Explore the universe through time',
    images: ['/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-cosmic-black text-cosmic-grey-100 min-h-screen">
        <EventProvider>
          <ThreeProvider>
            <SoundProvider>
              <AIProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 relative">
                    {children}
                    <Nova />
                    <SoundManager />
                  </main>
                  <Footer />
                </div>
              </AIProvider>
            </SoundProvider>
          </ThreeProvider>
        </EventProvider>
      </body>
    </html>
  )
}