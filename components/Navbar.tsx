'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DumbbellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={15} height={15}>
    <rect x="2" y="10" width="4" height="4" rx="1"/>
    <rect x="18" y="10" width="4" height="4" rx="1"/>
    <rect x="6" y="11" width="12" height="2" rx="1"/>
    <rect x="4" y="8" width="2" height="8" rx="1"/>
    <rect x="18" y="8" width="2" height="8" rx="1"/>
  </svg>
)

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <DumbbellIcon />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1 }}>
            Gym<span style={{ color: 'var(--accent)' }}>Flow</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { href: '/', label: 'Exercises' },
            { href: '/builder', label: 'Builder' },
          ].map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: active ? 'var(--bg-glass)' : 'transparent',
                  transition: 'color 0.15s, background 0.15s',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
