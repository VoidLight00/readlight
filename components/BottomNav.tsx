'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, BookIcon, PenIcon, LibraryIcon } from '@/components/icons'

const navItems = [
  { href: '/', label: '홈', Icon: HomeIcon },
  { href: '/session', label: '세션', Icon: BookIcon },
  { href: '/capture', label: '캡처', Icon: PenIcon },
  { href: '/library', label: '서재', Icon: LibraryIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-border">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-3 transition-colors min-h-[44px] relative ${
                isActive ? 'text-primary' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary" />
              )}
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
