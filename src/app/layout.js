import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aparna Munagekar - Creative Designer Portfolio',
  description: 'Packaging Designer & Visual Storyteller. Creator of Nataraj 24 Colour Pencils packaging.',
  keywords: 'graphic designer, packaging design, mumbai designer, nataraj, illustration',
  openGraph: {
    title: 'Aparna Munagekar - Creative Designer',
    description: 'Packaging Designer & Visual Storyteller',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}