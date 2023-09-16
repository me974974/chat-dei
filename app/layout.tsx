
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext'

import './globals.css'
import ActiveStatus from './components/ActiveStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '<ℂ𝕙𝕒𝕥 𝔻𝕖𝕚/>',
  description: '<ℂ𝕙𝕒𝕥 𝔻𝕖𝕚/>',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {childen}
        </AuthContext>
      </body>
    </html>
  )
}
