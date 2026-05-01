'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import type { Habit } from '@/lib/types'

const QUOTES = [
  '"We are what we repeatedly do." — Aristotle',
  '"Success is the sum of small efforts, repeated." — Robert Collier',
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"Motivation gets you going, but habit keeps you growing." — John C. Maxwell',
  '"First forget inspiration. Habit is more dependable." — Octavia Butler',
]

interface Props {
  habit: Habit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function HabitDetailSheet({ habit, open, onOpenChange }: Props) {
  if (!habit) return null

  const completedDays = habit.history.filter(Boolean).length
  const completionPct = habit.history.length > 0
    ? Math.round((completedDays / habit.history.length) * 100)
    : 0

  const last7 = habit.history.slice(-7)
  const thisWeek = last7.filter(Boolean).length

  const quote = QUOTES[habit.id % QUOTES.length]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-0 overflow-hidden border-0"
        style={{ maxHeight: '85dvh', background: '#F9F6F0' }}
      >
        {/* Hero */}
        <div
          className="px-6 pt-8 pb-6 flex flex-col items-center text-center"
          style={{
            background: `linear-gradient(160deg, ${hexToRgba(habit.color, 0.18)} 0%, ${hexToRgba(habit.color, 0.05)} 100%)`,
          }}
        >
          <div className="text-5xl mb-3">{habit.emoji}</div>
          <h2 className="text-xl font-semibold text-clay-700">{habit.name}</h2>
          <span
            className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: hexToRgba(habit.color, 0.15), color: habit.color }}
          >
            {habit.category}
          </span>
        </div>

        <div className="px-6 pb-8 overflow-y-auto">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 my-5">
            {[
              { label: 'Completion', value: `${completionPct}%` },
              { label: 'Best streak', value: `${habit.streak}d` },
              { label: 'This week', value: `${thisWeek}/7` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-3 text-center"
                style={{ background: hexToRgba(habit.color, 0.08) }}
              >
                <div className="text-xl font-bold text-clay-700">{value}</div>
                <div className="text-xs text-clay-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Heatmap — 4 weeks × 7 days */}
          <h3 className="text-sm font-semibold text-clay-500 mb-3">4-week heatmap</h3>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-clay-400">{d}</div>
            ))}
            {habit.history.slice(-28).map((done, i) => (
              <div
                key={i}
                className="aspect-square rounded-md"
                style={{
                  background: done
                    ? hexToRgba(habit.color, 0.7)
                    : '#E0D4C8',
                }}
              />
            ))}
          </div>

          {/* Motivational quote */}
          <div
            className="mt-6 p-4 rounded-2xl"
            style={{ background: hexToRgba(habit.color, 0.06) }}
          >
            <p className="text-sm text-clay-500 italic leading-relaxed">{quote}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
