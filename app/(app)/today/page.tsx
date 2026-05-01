'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useHabits } from '@/hooks/useHabits'
import { HabitCard } from '@/components/HabitCard'
import { CreateHabitSheet } from '@/components/CreateHabitSheet'
import { HabitDetailSheet } from '@/components/HabitDetailSheet'
import { ProgressRing } from '@/components/ProgressRing'
import type { Habit } from '@/lib/types'

// Canvas confetti loaded client-side only
let confettiFn: ((opts?: import('canvas-confetti').Options) => Promise<undefined> | null) | null = null
async function fireConfetti() {
  if (typeof window === 'undefined') return
  if (!confettiFn) {
    const mod = await import('canvas-confetti')
    confettiFn = mod.default
  }
  confettiFn?.({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ['#C4845A','#B07D6E','#9B8AAE','#8BAF8A'] })
}

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function TodayPage() {
  const { habits, toggleHabit, deleteHabit, addHabit } = useHabits()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const now = new Date()
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`

  const doneCount = habits.filter((h) => h.doneToday).length
  const total = habits.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const headline =
    doneCount === 0
      ? 'Ready to start?'
      : doneCount === total
      ? 'Perfect day! 🎉'
      : `${doneCount} down, ${total - doneCount} to go`

  const handleToggle = useCallback(
    (id: number) => {
      const habit = habits.find((h) => h.id === id)
      if (habit && !habit.doneToday) {
        fireConfetti()
      }
      toggleHabit(id)
    },
    [habits, toggleHabit]
  )

  return (
    <div className="px-5 pt-8">
      {/* Date header */}
      <p className="text-xs font-semibold tracking-widest text-clay-400 uppercase mb-1">
        {dateStr}
      </p>

      {/* Headline */}
      <h1 className="font-serif text-2xl text-clay-700 mb-5">{headline}</h1>

      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-5 rounded-3xl p-5 mb-6"
        style={{ background: '#FEFCF9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <div className="relative">
          <ProgressRing pct={pct} size={80} stroke={7} color="#C4845A" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-clay-700">{pct}%</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-clay-700">
            {doneCount}<span className="text-clay-300 font-normal">/{total}</span>
          </p>
          <p className="text-xs text-clay-400 mt-0.5">habits completed today</p>
        </div>
      </motion.div>

      {/* Habit list */}
      <div>
        {habits.map((habit, i) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <HabitCard
              habit={habit}
              onToggle={handleToggle}
              onDelete={deleteHabit}
              onPress={setSelectedHabit}
            />
          </motion.div>
        ))}
      </div>

      {/* Add habit button */}
      <button
        onClick={() => setCreateOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed text-sm font-semibold transition-colors mb-8"
        style={{ borderColor: '#D4C4B8', color: '#B0A098' }}
      >
        <Plus size={18} />
        Add habit
      </button>

      <CreateHabitSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onAdd={addHabit}
        existingCount={habits.length}
      />

      <HabitDetailSheet
        habit={selectedHabit}
        open={!!selectedHabit}
        onOpenChange={(open) => { if (!open) setSelectedHabit(null) }}
      />
    </div>
  )
}
