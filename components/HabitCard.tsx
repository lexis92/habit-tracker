'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Flame, Check, Trash2 } from 'lucide-react'
import type { Habit } from '@/lib/types'

interface Props {
  habit: Habit
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onPress: (habit: Habit) => void
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function HabitCard({ habit, onToggle, onDelete, onPress }: Props) {
  const [deleted, setDeleted] = useState(false)
  const [dragX, setDragX] = useState(0)
  const constraintsRef = useRef(null)

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -80) {
      setDeleted(true)
      setTimeout(() => onDelete(habit.id), 300)
    } else {
      setDragX(0)
    }
  }

  return (
    <motion.div
      animate={{ opacity: deleted ? 0 : 1, height: deleted ? 0 : 'auto' }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl mb-3"
    >
      {/* Delete background */}
      <div className="absolute inset-0 flex items-center justify-end pr-5 rounded-2xl bg-red-500">
        <Trash2 size={22} className="text-white" />
      </div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onClick={() => onPress(habit)}
        className="relative flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer select-none"
        style={{
          background: habit.doneToday
            ? hexToRgba(habit.color, 0.12)
            : '#FEFCF9',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          x: dragX,
        }}
      >
        {/* Emoji */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: hexToRgba(habit.color, 0.15) }}
        >
          {habit.emoji}
        </div>

        {/* Name + streak */}
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm text-clay-700 truncate"
            style={habit.doneToday ? { textDecoration: 'line-through', opacity: 0.6 } : {}}
          >
            {habit.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Flame size={12} style={{ color: habit.color }} />
            <span className="text-xs text-clay-400">{habit.streak} day streak</span>
          </div>
        </div>

        {/* Check button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            onToggle(habit.id)
          }}
          whileTap={{ scale: 0.85 }}
          animate={{ scale: habit.doneToday ? [1, 1.25, 1] : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-200"
          style={habit.doneToday
            ? { background: habit.color, borderColor: habit.color }
            : { background: 'transparent', borderColor: '#D4C4B8' }
          }
        >
          {habit.doneToday && <Check size={16} className="text-white" strokeWidth={3} />}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
