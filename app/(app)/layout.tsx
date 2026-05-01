'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, BarChart2, BookOpen, Settings } from 'lucide-react'
import { Onboarding } from '@/components/Onboarding'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/today', label: 'Today', Icon: Sun },
  { href: '/stats', label: 'Progress', Icon: BarChart2 },
  { href: '/reflect', label: 'Reflect', Icon: BookOpen },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const done = localStorage.getItem('streak_onboarding_done')
    if (!done) {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUserName(data.user.user_metadata?.full_name || data.user.email || '')
        }
        setShowOnboarding(true)
      })
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {showOnboarding && (
        <Onboarding
          userName={userName}
          onDone={() => setShowOnboarding(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 flex items-center border-t"
        style={{
          background: '#FEFCF9',
          borderColor: '#EDE6DB',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? '#7A4A3C' : '#B0A098' }}
              />
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: active ? '#7A4A3C' : '#B0A098' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
