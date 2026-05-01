'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/today')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        })
        if (error) throw error
        if (data.session) {
          router.push('/today')
        } else {
          setEmailSent(true)
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6" style={{ background: '#F9F6F0' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="text-6xl mb-6">📬</div>
          <h1 className="text-2xl font-serif text-clay-700 mb-3">Check your email</h1>
          <p className="text-clay-500 leading-relaxed">
            We sent a confirmation link to <strong>{email}</strong>. Open it to activate your account.
          </p>
          <Button
            className="mt-8 w-full h-12 rounded-2xl text-white font-semibold"
            style={{ background: '#7A4A3C' }}
            onClick={() => { setEmailSent(false); setMode('login') }}
          >
            Back to login
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6" style={{ background: '#F9F6F0' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-5xl mb-3">🔥</div>
          <h1 className="font-serif text-3xl text-clay-700">Streak</h1>
          <p className="text-clay-400 text-sm mt-1">Build habits that actually stick.</p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-2xl p-1 mb-6" style={{ background: '#EDE6DB' }}>
          {(['login', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={mode === m
                ? { background: '#FEFCF9', color: '#7A4A3C', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                : { color: '#8A6E62' }
              }
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl border-cream-300 bg-cream-50 text-clay-700 placeholder:text-clay-400 focus:border-clay-400 focus:ring-clay-300"
                  required={mode === 'signup'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border-cream-300 bg-cream-50 text-clay-700 placeholder:text-clay-400"
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-cream-300 bg-cream-50 text-clay-700 placeholder:text-clay-400 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-clay-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl text-white font-semibold text-base mt-2"
            style={{ background: '#7A4A3C' }}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : mode === 'login' ? (
              'Log in'
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
