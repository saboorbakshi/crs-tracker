import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const sohne = localFont({
  src: '../public/SohneVF.woff2',
  variable: '--font-sohne',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ee-live.pages.dev'),
  title: 'CRS Tracker',
  description:
    'Track CRS cutoff scores, invitations, and candidate pool data for Express Entry draws.',
  twitter: {
    card: 'summary_large_image',
  },
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
