export interface Habit {
  id: number
  name: string
  emoji: string
  color: string
  streak: number
  goal: number
  doneToday: boolean
  history: number[]
  category: 'Mind' | 'Body' | 'Soul' | 'Work'
}

export interface JournalEntry {
  text: string
  date: string
  prompt: string
}
