import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const sohne = localFont({
  src: '../public/SohneVF.woff2',
  variable: '--font-sohne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Canada Express Entry Statistics',
  description:
    'Track CRS cutoff scores, invitations, and candidate pool data for Express Entry draws.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sohne.variable} antialiased`}>{children}</body>
    </html>
  )
}
