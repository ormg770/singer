import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Diana Mae — Official Website',
  description: 'Official website of Diana Mae — Singer, Songwriter, Performer. Discover her music, upcoming shows, videos, and more.',
  keywords: ['Diana Mae', 'singer', 'songwriter', 'music', 'concerts', 'songs'],
  openGraph: {
    title: 'Diana Mae — Official Website',
    description: 'Official website of Diana Mae — Singer, Songwriter, Performer.',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#050508] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
