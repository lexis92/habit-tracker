'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useHabits } from '@/hooks/useHabits'
import { Button } from '@/components/ui/button'
import type { JournalEntry } from '@/lib/types'

const MOODS = [
  { emoji: '😔', label: 'Rough' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😊', label: 'Great' },
  { emoji: '🤩', label: 'Amazing' },
]

const PROMPTS = [
  'What habit felt easiest today and why?',
  'What would make tomorrow 1% better?',
  'What are you grateful for right now?',
  'What did you learn about yourself today?',
  'What resistance did you push through?',
  'How are your habits aligning with your goals?',
  'What would your future self thank you for doing today?',
]

export default function ReflectPage() {
  const { habits } = useHabits()
  const [mood, setMood] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [promptIdx, setPromptIdx] = useState(0)

  const prompt = PROMPTS[promptIdx]

  function cyclePrompt() {
    setPromptIdx((i) => (i + 1) % PROMPTS.length)
  }

  function handleSave() {
    if (!text.trim()) return
    const entry: JournalEntry = {
      text: text.trim(),
      date: new Date().toISOString(),
      prompt,
    }
    try {
      const existing = JSON.parse(localStorage.getItem('streak_journal') || '[]')
      existing.unshift(entry)
      localStorage.setItem('streak_journal', JSON.stringify(existing.slice(0, 100)))
      setText('')
      toast.success('Journal saved')
    } catch {
      toast.error('Could not save journal')
    }
  }

  const doneCount = habits.filter((h) => h.doneToday).length

  return (
    <div className="px-5 pt-8">
      <h1 className="font-serif text-2xl text-clay-700 mb-6">Reflect</h1>

      {/* Mood selector */}
      <div
        className="rounded-3xl p-5 mb-5"
        style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <p className="text-sm font-semibold text-clay-500 mb-4">How are you feeling?</p>
        <div className="flex justify-between gap-2">
          {MOODS.map(({ emoji, label }, i) => (
            <motion.button
              key={i}
              onClick={() => setMood(i)}
              whileTap={{ scale: 0.85 }}
              animate={{ scale: mood === i ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <div
                className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: mood === i ? '#C4845A20' : '#F0EAE3',
                  outline: mood === i ? '2px solid #C4845A' : 'none',
                }}
              >
                {emoji}
              </div>
              <span className="text-[10px] text-clay-400">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Journal */}
      <div
        className="rounded-3xl p-5 mb-5"
        style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-clay-500">Today&apos;s prompt</p>
          <button onClick={cyclePrompt} className="text-clay-400 hover:text-clay-600">
            <RefreshCw size={15} />
          </button>
        </div>
        <p className="text-sm text-clay-600 italic mb-3">&ldquo;{prompt}&rdquo;</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write anything..."
          rows={4}
          className="w-full resize-none text-sm text-clay-700 placeholder:text-clay-300 bg-cream-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-clay-300"
        />
        <Button
          onClick={handleSave}
          disabled={!text.trim()}
          className="w-full h-11 rounded-2xl text-white font-semibold mt-3"
          style={{ background: '#7A4A3C' }}
        >
          Save entry
        </Button>
      </div>

      {/* Today at a glance */}
      <div
        className="rounded-3xl p-5 mb-8"
        style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <p className="text-sm font-semibold text-clay-500 mb-3">
          Today at a glance — {doneCount}/{habits.length} habits done
        </p>
        <div className="space-y-2">
          {habits.map((h) => (
            <div key={h.id} className="flex items-center gap-3">
              <span className="text-base">{h.emoji}</span>
              <span
                className="text-sm flex-1"
                style={{
                  color: h.doneToday ? '#8A6E62' : '#C4B5AB',
                  textDecoration: h.doneToday ? 'line-through' : 'none',
                }}
              >
                {h.name}
              </span>
              <span className="text-lg">{h.doneToday ? '✅' : '⬜'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
