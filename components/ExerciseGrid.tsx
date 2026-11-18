'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface ExerciseItem { id: string; name: string; target: string; equipment: string; thumb: string }
interface Props { exercises: ExerciseItem[]; eqQuery: string }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const card = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function ExerciseGrid({ exercises, eqQuery }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))', gap: 12 }}
    >
      {exercises.map((ex) => (
        <motion.div key={ex.id} variants={card} transition={{ duration: 0.28, ease: 'easeOut' }}>
          <Link
            href={`/exercise/${ex.id}?${eqQuery}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: 'var(--bg-glass)',
              overflow: 'hidden',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border-hover)'
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            <div style={{ aspectRatio: '1', background: 'var(--bg-2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ex.thumb}
                alt={ex.name}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: 12,
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>
            <div style={{ padding: '12px 14px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>
                {ex.name}
              </p>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)', textTransform: 'capitalize' }}>
                {ex.target}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'capitalize', marginTop: 2 }}>
                {ex.equipment}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
