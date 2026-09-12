import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { M_PLUS_Rounded_1c, Mochiy_Pop_One } from 'next/font/google'
import './globals.css'

const rounded = M_PLUS_Rounded_1c({
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-rounded',
  display: 'swap',
  preload: false,
})

const pop = Mochiy_Pop_One({
  weight: ['400'],
  variable: '--font-pop',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: '21ブラックジャック・ポーカーバトル',
  description:
    'ブラックジャックとポーカーが融合したカードバトルRPG。合計21を狙って敵を撃破せよ！',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1730',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`dark bg-background ${rounded.variable} ${pop.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
