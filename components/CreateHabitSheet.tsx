'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Habit } from '@/lib/types'

const EMOJIS = ['✍️','💧','🏃','📚','🧘','🎨','🎸','🍎','💪','😴','🌿','🧹']
const COLORS = ['#C4845A','#7A9CB8','#8BAF8A','#B07D6E','#9B8AAE','#E8A87C','#6B8FAB','#A8B5A2']
const CATEGORIES: Habit['category'][] = ['Mind','Body','Soul','Work']

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (habit: Habit) => void
  existingCount: number
}

export function CreateHabitSheet({ open, onOpenChange, onAdd, existingCount }: Props) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('✍️')
  const [color, setColor] = useState('#C4845A')
  const [category, setCategory] = useState<Habit['category']>('Mind')

  function handleSave() {
    if (!name.trim()) return
    const newHabit: Habit = {
      id: Date.now(),
      name: name.trim(),
      emoji,
      color,
      streak: 0,
      goal: 1,
      doneToday: false,
      history: [],
      category,
    }
    onAdd(newHabit)
    setName('')
    setEmoji('✍️')
    setColor('#C4845A')
    setCategory('Mind')
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-0 p-0"
        style={{ maxHeight: '90dvh', background: '#F9F6F0' }}
      >
        <div className="overflow-y-auto px-6 pt-6 pb-10">
          <SheetHeader className="mb-5">
            <SheetTitle className="font-serif text-xl text-clay-700">New habit</SheetTitle>
          </SheetHeader>

          {/* Live preview */}
          {name && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-5"
              style={{ background: `${color}18` }}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="font-semibold text-clay-700">{name}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}30`, color }}>
                {category}
              </span>
            </div>
          )}

          {/* Name */}
          <label className="text-sm font-medium text-clay-500 mb-2 block">Habit name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning run"
            className="h-12 rounded-xl mb-5 border-cream-300 bg-cream-50 text-clay-700 placeholder:text-clay-400"
            maxLength={40}
          />

          {/* Emoji picker */}
          <label className="text-sm font-medium text-clay-500 mb-2 block">Emoji</label>
          <div className="grid grid-cols-6 gap-2 mb-5">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className="text-2xl h-11 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: emoji === e ? `${color}25` : '#EDE6DB',
                  outline: emoji === e ? `2px solid ${color}` : 'none',
                }}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Color picker */}
          <label className="text-sm font-medium text-clay-500 mb-2 block">Color</label>
          <div className="flex gap-3 mb-5 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-9 h-9 rounded-full transition-all"
                style={{
                  background: c,
                  outline: color === c ? `3px solid ${c}` : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>

          {/* Category */}
          <label className="text-sm font-medium text-clay-500 mb-2 block">Category</label>
          <div className="flex gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                style={category === cat
                  ? { background: color, color: '#fff' }
                  : { background: '#EDE6DB', color: '#8A6E62' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full h-12 rounded-2xl text-white font-semibold text-base"
            style={{ background: '#7A4A3C' }}
          >
            Create habit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
