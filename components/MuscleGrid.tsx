'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const MUSCLE_SVG: Record<string, string> = {
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 4c0 0 1.5 2 1.5 8S6 20 6 20M18 4c0 0-1.5 2-1.5 8s1.5 8 1.5 8M12 4v16M8 10c1 1 2 1.5 4 1.5s3-.5 4-1.5"/></svg>`,
  chest: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 8c0 0 1 4 1 6s-1 4-1 4h14s-1-2-1-4 1-6 1-6z"/><path d="M12 8v10"/></svg>`,
  shoulders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5" cy="11" r="2.5"/><circle cx="19" cy="11" r="2.5"/><path d="M7.5 11h9M12 8v8"/></svg>`,
  'upper arms': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 5c0 0 .5 2.5.5 7S7 19 7 19M17 5c0 0-.5 2.5-.5 7s.5 7 .5 7M7 12h10"/></svg>`,
  'lower arms': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 5l-2 14M16 5l2 14M6.5 12h11"/></svg>`,
  'upper legs': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 5l-1.5 10M15 5l1.5 10M7.5 13h9"/></svg>`,
  'lower legs': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 8l-1 12M15 8l1 12M8 15h8"/></svg>`,
  waist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="12" cy="10" rx="7" ry="3"/><path d="M5 10v3c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-3"/></svg>`,
  neck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 5h6v7c0 2.2-1.3 4-3 4s-3-1.8-3-4V5z"/></svg>`,
  cardio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,12 5,12 7,5 10,19 13,9 15,14 17,14 19,12 22,12"/></svg>`,
}

interface PartItem { part: string; meta: { label: string; emoji: string } | undefined }
interface Props { parts: PartItem[]; eqQuery: string }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function MuscleGrid({ parts, eqQuery }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(part: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(part) ? next.delete(part) : next.add(part)
      return next
    })
  }

  function proceed() {
    const partQuery = [...selected].map((p) => `part=${encodeURIComponent(p)}`).join('&')
    router.push(`/exercises?${partQuery}${eqQuery ? `&${eqQuery}` : ''}`)
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}
      >
        {parts.map(({ part, meta }) => {
          const active = selected.has(part)
          return (
            <motion.div key={part} variants={card} transition={{ duration: 0.25, ease: 'easeOut' }}>
              <button
                onClick={() => toggle(part)}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  padding: '20px 12px',
                  borderRadius: 16,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-dim)' : 'var(--bg-glass)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s, transform 0.15s',
                  position: 'relative',
                  transform: active ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {active && (
                  <span style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    color: '#fff',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}>✓</span>
                )}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: active ? 'rgba(249,115,22,0.2)' : 'var(--accent-dim)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                  dangerouslySetInnerHTML={{ __html: MUSCLE_SVG[part] ?? MUSCLE_SVG.chest }}
                />
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>
                  {meta?.label ?? part}
                </span>
              </button>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Sticky CTA */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'sticky',
              bottom: 0,
              marginTop: 32,
              paddingTop: 20,
              paddingBottom: 20,
              background: 'linear-gradient(to top, #000 70%, transparent)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <motion.button
              onClick={proceed}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '13px 28px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
              }}
            >
              View exercises →
            </motion.button>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {selected.size} muscle group{selected.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelected(new Set())}
              style={{ fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer', background: 'none', border: 'none', marginLeft: 'auto' }}
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
