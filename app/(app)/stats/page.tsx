'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useHabits } from '@/hooks/useHabits'

function getSlice(history: number[], period: 'week' | 'month' | 'all') {
  if (period === 'week') return history.slice(-7)
  if (period === 'month') return history.slice(-30)
  return history
}

export default function StatsPage() {
  const { habits } = useHabits()
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')

  const totalStreakDays = habits.reduce((sum, h) => sum + h.streak, 0)
  const bestStreak = Math.max(...habits.map((h) => h.streak), 0)
  const avgCompletion = habits.length
    ? Math.round(
        habits.reduce((sum, h) => {
          const slice = getSlice(h.history, period)
          return sum + (slice.filter(Boolean).length / (slice.length || 1)) * 100
        }, 0) / habits.length
      )
    : 0

  const days = period === 'week' ? 7 : period === 'month' ? 30 : 28
  const dayLabels = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return d.getDate().toString()
  })

  // Bar heights based on how many habits completed each day
  const barData = Array.from({ length: days }, (_, i) => {
    const dayIdx = -(days - i)
    const count = habits.filter((h) => {
      const val = h.history[h.history.length + dayIdx]
      return val === 1
    }).length
    return habits.length > 0 ? (count / habits.length) * 100 : 0
  })

  return (
    <div className="px-5 pt-8">
      <h1 className="font-serif text-2xl text-clay-700 mb-6">Your progress</h1>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="w-full mb-6 rounded-2xl" style={{ background: '#EDE6DB' }}>
          <TabsTrigger value="week" className="flex-1 rounded-xl">Week</TabsTrigger>
          <TabsTrigger value="month" className="flex-1 rounded-xl">Month</TabsTrigger>
          <TabsTrigger value="all" className="flex-1 rounded-xl">All</TabsTrigger>
        </TabsList>

        <TabsContent value={period}>
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Streak days', value: totalStreakDays },
              { label: 'Best streak', value: bestStreak },
              { label: 'Avg done', value: `${avgCompletion}%` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-3 text-center"
                style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div className="text-xl font-bold text-clay-700">{value}</div>
                <div className="text-[10px] text-clay-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div
            className="rounded-3xl p-5 mb-6"
            style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <h3 className="text-sm font-semibold text-clay-500 mb-4">Daily completion</h3>
            <div className="flex items-end gap-1 h-24">
              {barData.map((pct, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(pct, 4)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.02 }}
                    className="w-full rounded-t-sm"
                    style={{
                      background: pct > 0 ? '#C4845A' : '#E0D4C8',
                      minHeight: 4,
                      height: `${Math.max(pct, 4)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            {period === 'week' && (
              <div className="flex gap-1 mt-1">
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] text-clay-300">{d}</div>
                ))}
              </div>
            )}
          </div>

          {/* Per-habit progress */}
          <h3 className="text-sm font-semibold text-clay-500 mb-3">Per habit</h3>
          <div className="space-y-3">
            {habits.map((habit) => {
              const slice = getSlice(habit.history, period)
              const done = slice.filter(Boolean).length
              const pct = slice.length > 0 ? Math.round((done / slice.length) * 100) : 0
              return (
                <div
                  key={habit.id}
                  className="rounded-2xl px-4 py-3"
                  style={{ background: '#FEFCF9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{habit.emoji}</span>
                      <span className="text-sm font-medium text-clay-700">{habit.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-clay-500">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E0D4C8' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: habit.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
