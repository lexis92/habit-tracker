'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

const SLIDES = [
  {
    emoji: '🔥',
    headline: 'Build streaks that stick',
    subtext: 'Track daily habits and watch your consistency compound over time.',
  },
  {
    emoji: '📊',
    headline: 'See your progress clearly',
    subtext: 'Heatmaps, streaks, and weekly stats show exactly how far you\'ve come.',
  },
  {
    emoji: '🌱',
    headline: 'Reflect and grow',
    subtext: 'Daily journaling prompts help you stay mindful and intentional.',
  },
]

interface Props {
  userName: string
  onDone: () => void
}

export function Onboarding({ userName, onDone }: Props) {
  const [step, setStep] = useState(0)

  function handleNext() {
    if (step < SLIDES.length - 1) {
      setStep(step + 1)
    } else {
      localStorage.setItem('streak_onboarding_done', '1')
      onDone()
    }
  }

  const slide = SLIDES[step]

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8"
      style={{ background: '#F9F6F0' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="text-center max-w-xs w-full"
        >
          <div className="text-7xl mb-8">{slide.emoji}</div>
          <h2 className="font-serif text-3xl text-clay-700 mb-4 leading-snug">
            {step === 0 && userName
              ? `Welcome, ${userName.split(' ')[0]}!`
              : slide.headline}
          </h2>
          <p className="text-clay-500 text-base leading-relaxed">
            {step === 0 && userName
              ? slide.subtext
              : slide.subtext}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-2 mt-12 mb-8">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              background: i === step ? '#7A4A3C' : '#E0D4C8',
            }}
          />
        ))}
      </div>

      <Button
        onClick={handleNext}
        className="w-full max-w-xs h-12 rounded-2xl text-white font-semibold text-base"
        style={{ background: '#7A4A3C' }}
      >
        {step < SLIDES.length - 1 ? 'Continue' : 'Get started'}
      </Button>

      {step < SLIDES.length - 1 && (
        <button
          onClick={() => {
            localStorage.setItem('streak_onboarding_done', '1')
            onDone()
          }}
          className="mt-4 text-sm text-clay-400"
        >
          Skip
        </button>
      )}
    </div>
  )
}
