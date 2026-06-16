import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const sohne = localFont({
  src: '../public/SohneVF.woff2',
  variable: '--font-sohne',
  display: 'swap',
})

const title = 'Canada Express Entry Statistics'
const description =
  'Track CRS cutoff scores, invitations, and candidate pool data for Express Entry draws.'

export const metadata: Metadata = {
  metadataBase: new URL('https://ee-live.pages.dev'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://ee-live.pages.dev',
    siteName: title,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
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
