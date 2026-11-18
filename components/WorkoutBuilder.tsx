'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Exercise } from '@/lib/types'

const BUILDER_KEY = 'gymflow_builder'
const WORKOUTS_KEY = 'gymflow_workouts'

interface BuilderItem { id: string; sets: number; reps: string; note: string }
interface SavedWorkout { id: string; name: string; items: BuilderItem[]; savedAt: string }

export default function WorkoutBuilder({ exerciseMap }: { exerciseMap: Record<string, Exercise> }) {
  const [items, setItems] = useState<BuilderItem[]>([])
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([])
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const r = localStorage.getItem(BUILDER_KEY)
      if (r) setItems(JSON.parse(r))
      const w = localStorage.getItem(WORKOUTS_KEY)
      if (w) setWorkouts(JSON.parse(w))
    } catch {}
  }, [])

  function persist(next: BuilderItem[]) {
    setItems(next)
    localStorage.setItem(BUILDER_KEY, JSON.stringify(next))
  }

  function remove(id: string) { persist(items.filter((i) => i.id !== id)) }

  function update(id: string, field: keyof BuilderItem, value: string | number) {
    persist(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  function saveWorkout() {
    if (!name.trim() || items.length === 0) return
    const w: SavedWorkout = { id: Date.now().toString(), name: name.trim(), items: [...items], savedAt: new Date().toISOString() }
    const next = [w, ...workouts]
    setWorkouts(next)
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(next))
    setName('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function deleteWorkout(id: string) {
    const next = workouts.filter((w) => w.id !== id)
    setWorkouts(next)
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(next))
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 8 }}>
          Workout Builder
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
          Add exercises from any exercise page. Adjust sets and reps here.
        </p>
      </div>

      {/* Current plan */}
      {items.length === 0 ? (
        <div style={{
          border: '1px dashed var(--border)',
          borderRadius: 20,
          padding: '64px 32px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🏋️</p>
          <p style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>No exercises yet</p>
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 20 }}>
            Browse exercises and tap &quot;Add to workout&quot; to start building.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '10px 22px',
              borderRadius: 999,
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Browse exercises →
          </Link>
        </div>
      ) : (
        <div>
          <AnimatePresence>
            {items.map((item) => {
              const ex = exerciseMap[item.id]
              if (!ex) return null
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 16px',
                    borderRadius: 16,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-glass)',
                    marginBottom: 10,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--bg-2)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <Image
                      src={`https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${ex.image}`}
                      alt={ex.name}
                      fill
                      style={{ objectFit: 'contain', padding: 4 }}
                      unoptimized
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ex.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--accent)', textTransform: 'capitalize', marginTop: 2 }}>
                      {ex.target}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {(['sets', 'reps'] as const).map((field) => (
                      <div key={field} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                          {field}
                        </label>
                        <input
                          type={field === 'sets' ? 'number' : 'text'}
                          min={1}
                          max={99}
                          value={item[field]}
                          onChange={(e) => update(item.id, field, field === 'sets' ? parseInt(e.target.value) || 1 : e.target.value)}
                          style={{
                            width: field === 'sets' ? 44 : 56,
                            textAlign: 'center',
                            padding: '5px 6px',
                            borderRadius: 8,
                            border: '1px solid var(--border)',
                            background: 'var(--bg-3)',
                            color: 'var(--text)',
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => remove(item.id)}
                      style={{ color: 'var(--text-tertiary)', cursor: 'pointer', background: 'none', border: 'none', fontSize: 20, lineHeight: 1, marginLeft: 4, padding: '0 4px' }}
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Save bar */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <input
              type="text"
              placeholder="Name this workout…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveWorkout()}
              style={{
                flex: 1,
                padding: '11px 18px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: 'var(--bg-glass)',
                color: 'var(--text)',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              onClick={saveWorkout}
              disabled={!name.trim()}
              style={{
                padding: '11px 22px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                border: 'none',
                background: saved ? 'var(--green-dim)' : name.trim() ? 'var(--accent)' : 'var(--bg-glass)',
                color: saved ? 'var(--green)' : name.trim() ? '#fff' : 'var(--text-tertiary)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {saved ? '✓ Saved' : 'Save workout'}
            </button>
          </div>
        </div>
      )}

      {/* Saved workouts */}
      {workouts.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 16 }}>
            Saved workouts
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {workouts.map((w) => (
              <div
                key={w.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-glass)',
                }}
              >
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{w.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {w.items.length} exercise{w.items.length !== 1 ? 's' : ''} · {new Date(w.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button
                    onClick={() => persist(w.items)}
                    style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteWorkout(w.id)}
                    style={{ fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
