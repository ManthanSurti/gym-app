'use client'

import Link from 'next/link'

interface Props {
  href: string
  name: string
  target: string
  thumb: string
}

export default function RelatedExerciseCard({ href, name, target, thumb }: Props) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 14,
        border: '1px solid var(--border)',
        background: 'var(--bg-glass)',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-hover)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ aspectRatio: '1', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={name}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10, transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        />
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: 3 }}>
          {name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'capitalize' }}>
          {target}
        </p>
      </div>
    </Link>
  )
}
