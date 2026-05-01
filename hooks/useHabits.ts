'use client'
import { useState, useEffect } from 'react'
import type { Habit } from '@/lib/types'

const INITIAL_HABITS: Habit[] = [
  { id:1, name:'Morning pages', emoji:'✍️', color:'#C4845A', streak:7, goal:1, doneToday:false, history:[1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1], category:'Mind' },
  { id:2, name:'Drink 8 glasses', emoji:'💧', color:'#7A9CB8', streak:14, goal:8, doneToday:false, history:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1], category:'Body' },
  { id:3, name:'30 min walk', emoji:'🏃', color:'#8BAF8A', streak:3, goal:1, doneToday:false, history:[0,1,0,1,1,1,1,0,0,1,1,1,0,0,1,1,0,1,1,0,0,1,1,1,0,0,0,1], category:'Body' },
  { id:4, name:'Read 20 pages', emoji:'📚', color:'#B07D6E', streak:21, goal:20, doneToday:false, history:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1], category:'Mind' },
  { id:5, name:'Meditate', emoji:'🧘', color:'#9B8AAE', streak:5, goal:1, doneToday:false, history:[1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,1,0,0,1,1,1,1], category:'Mind' },
]

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window === 'undefined') return INITIAL_HABITS
    try {
      const saved = JSON.parse(localStorage.getItem('streak_habits') || 'null')
      if (!saved) return INITIAL_HABITS
      const lastDate = localStorage.getItem('streak_last_date')
      const today = new Date().toDateString()
      if (lastDate !== today) {
        localStorage.setItem('streak_last_date', today)
        return saved.map((h: Habit) => ({ ...h, doneToday: false }))
      }
      return saved
    } catch { return INITIAL_HABITS }
  })

  useEffect(() => {
    try {
      localStorage.setItem('streak_habits', JSON.stringify(habits))
      localStorage.setItem('streak_last_date', new Date().toDateString())
    } catch {}
  }, [habits])

  const toggleHabit = (id: number) =>
    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, doneToday: !h.doneToday, streak: !h.doneToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h
    ))

  const deleteHabit = (id: number) => setHabits(prev => prev.filter(h => h.id !== id))

  const addHabit = (habit: Habit) => setHabits(prev => [...prev, habit])

  return { habits, toggleHabit, deleteHabit, addHabit }
}
