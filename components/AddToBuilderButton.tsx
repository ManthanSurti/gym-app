'use client'

import { useState } from 'react'
import type { Exercise } from '@/lib/types'

const STORAGE_KEY = 'gymflow_builder'

export default function AddToBuilderButton({ exercise }: { exercise: Exercise }) {
  const [added, setAdded] = useState(false)

  function add() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const list: { id: string; sets: number; reps: string; note: string }[] = raw ? JSON.parse(raw) : []
      if (!list.find((e) => e.id === exercise.id)) {
        list.push({ id: exercise.id, sets: 3, reps: '8-12', note: '' })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      }
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={add}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        borderRadius: 999,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
        background: added ? 'var(--green-dim)' : 'var(--accent)',
        color: added ? 'var(--green)' : '#fff',
        transition: 'all 0.2s ease',
      }}
    >
      {added ? '✓ Added to builder' : '+ Add to workout'}
    </button>
  )
}
