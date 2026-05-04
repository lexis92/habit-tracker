'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SplashScreen() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const seen = sessionStorage.getItem('sc_splash')
    if (!seen) {
      sessionStorage.setItem('sc_splash', '1')
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2400)
      return () => clearTimeout(t)
    }
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#F9F6F0' }}
        >
          <motion.div
            initial={{ scale: 0.78, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Streakcred+"
              width={100}
              height={100}
              className="rounded-[23px] shadow-xl"
              style={{ boxShadow: '0 12px 40px rgba(61,43,31,0.18)' }}
            />
            <div className="flex flex-col items-center gap-1.5">
              <h1
                className="font-serif text-[2.6rem] leading-none tracking-tight"
                style={{ color: '#3D2B1F' }}
              >
                Streakcred<span style={{ color: '#B07D6E' }}>+</span>
              </h1>
              <p className="text-sm font-medium" style={{ color: '#8A6E62' }}>
                Build habits that actually stick.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
