import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ReadLight — 독서 동반자',
  description: '당신의 독서를 함께하는 동반자',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 pb-20">{children}</main>

          <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
            <div className="max-w-lg mx-auto flex">
              <NavItem href="/" label="홈" icon="🏠" />
              <NavItem href="/session" label="세션" icon="📖" />
              <NavItem href="/capture" label="캡처" icon="✏️" />
              <NavItem href="/library" label="서재" icon="📚" />
            </div>
          </nav>
        </div>
      </body>
    </html>
  )
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex-1 flex flex-col items-center py-3 text-muted-foreground hover:text-primary transition-colors min-h-[44px]"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs mt-0.5">{label}</span>
    </Link>
  )
}
