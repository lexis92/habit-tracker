'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Palette, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const ACCENT_COLORS = [
  { label: 'Clay', value: '#C4845A' },
  { label: 'Sage', value: '#8BAF8A' },
  { label: 'Slate', value: '#7A9CB8' },
  { label: 'Mauve', value: '#9B8AAE' },
  { label: 'Rose', value: '#C47A7A' },
  { label: 'Gold', value: '#C4A85A' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [accentColor, setAccentColor] = useState('#C4845A')
  const [confettiEnabled, setConfettiEnabled] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || '')
        setUserName(data.user.user_metadata?.full_name || '')
      }
    })
    const savedAccent = localStorage.getItem('streak_accent_color')
    if (savedAccent) setAccentColor(savedAccent)
    const savedConfetti = localStorage.getItem('streak_confetti')
    if (savedConfetti === '0') setConfettiEnabled(false)
  }, [])

  function handleAccentChange(color: string) {
    setAccentColor(color)
    localStorage.setItem('streak_accent_color', color)
    document.documentElement.style.setProperty('--color-clay-300', color)
  }

  function handleConfettiToggle() {
    const next = !confettiEnabled
    setConfettiEnabled(next)
    localStorage.setItem('streak_confetti', next ? '1' : '0')
  }

  async function handleSignOut() {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth')
    } catch {
      toast.error('Sign out failed')
      setLoading(false)
    }
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="font-serif text-2xl text-clay-700 mb-6">Settings</h1>

      {/* Profile */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ background: '#E8D4C4' }}
          >
            {userName ? userName[0].toUpperCase() : '?'}
          </div>
          <div>
            {userName && <p className="font-semibold text-clay-700">{userName}</p>}
            <p className="text-sm text-clay-400">{email}</p>
          </div>
        </div>
      </div>

      {/* Accent color */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-clay-400" />
          <p className="text-sm font-semibold text-clay-600">Accent color</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleAccentChange(value)}
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="w-9 h-9 rounded-full"
                style={{
                  background: value,
                  outline: accentColor === value ? `3px solid ${value}` : 'none',
                  outlineOffset: '2px',
                }}
              />
              <span className="text-[10px] text-clay-400">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confetti toggle */}
      <div
        className="rounded-3xl p-5 mb-6 flex items-center justify-between"
        style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-clay-400" />
          <p className="text-sm font-semibold text-clay-600">Confetti on check-off</p>
        </div>
        <button
          onClick={handleConfettiToggle}
          className="w-12 h-6 rounded-full transition-colors relative"
          style={{ background: confettiEnabled ? '#C4845A' : '#D4C4B8' }}
        >
          <motion.div
            animate={{ x: confettiEnabled ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
          />
        </button>
      </div>

      {/* Sign out */}
      <Button
        onClick={handleSignOut}
        disabled={loading}
        variant="outline"
        className="w-full h-12 rounded-2xl font-semibold border-clay-200 text-clay-600 flex items-center gap-2"
      >
        <LogOut size={16} />
        {loading ? 'Signing out...' : 'Sign out'}
      </Button>
    </div>
  )
}
