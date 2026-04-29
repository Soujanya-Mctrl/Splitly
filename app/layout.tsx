import type { Metadata, Viewport } from 'next'
import { Roboto, JetBrains_Mono, Lugrasimo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { WalletProvider } from '../context/WalletContext'
import { ConnectWallet } from '../components/ConnectWallet'
import { MovingGradientBackground } from '../components/MovingGradientBackground'
import Link from 'next/link'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

const lugrasimo = Lugrasimo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Splitly — Stellar Testnet Wallet',
  description:
    'Splitly is a beginner-friendly Stellar testnet dApp for connecting Freighter, checking native XLM balance, and sending a real XLM transaction with feedback.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0a0a14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${jetbrainsMono.variable} ${lugrasimo.variable}`}>
      <body className="font-sans antialiased bg-black text-neutral-100 min-h-screen">
        <MovingGradientBackground />
        <WalletProvider>
          {/* Sticky nav bar */}
          <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-bold text-neutral-100 transition-colors hover:text-white"
              >
                <span className="font-script text-2xl tracking-normal">Splitly</span>
              </Link>
              <ConnectWallet />
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto max-w-5xl px-4 py-8">
            {children}
          </main>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
