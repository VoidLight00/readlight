'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/session', label: '세션', icon: '📖' },
  { href: '/capture', label: '캡처', icon: '✏️' },
  { href: '/library', label: '서재', icon: '📚' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-3 transition-colors min-h-[44px] ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-xs mt-0.5">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
