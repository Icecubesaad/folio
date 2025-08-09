import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PortfolioBuilder - Create Beautiful Portfolios with AI',
  description: 'Build stunning professional portfolios in minutes using AI. No coding required.',
  keywords: 'portfolio, resume, CV, AI, builder, professional, website',
  authors: [{ name: 'PortfolioBuilder Team' }],
  openGraph: {
    title: 'PortfolioBuilder - Create Beautiful Portfolios with AI',
    description: 'Build stunning professional portfolios in minutes using AI. No coding required.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}>
        <div id="root">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}