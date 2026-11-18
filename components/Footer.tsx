import Link from 'next/link'

const DumbbellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={13} height={13}>
    <rect x="2" y="10" width="4" height="4" rx="1"/>
    <rect x="18" y="10" width="4" height="4" rx="1"/>
    <rect x="6" y="11" width="12" height="2" rx="1"/>
    <rect x="4" y="8" width="2" height="8" rx="1"/>
    <rect x="18" y="8" width="2" height="8" rx="1"/>
  </svg>
)

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: 80,
      padding: '48px 24px 40px',
      background: 'var(--bg-1)',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>
        {/* Brand side */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <DumbbellIcon />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em', color: 'var(--text)' }}>
              Gym<span style={{ color: 'var(--accent)' }}>Flow</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.65, maxWidth: 280 }}>
            Find the right exercises for the equipment you actually have.
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 20, opacity: 0.6 }}>
            © {new Date().getFullYear()} GymFlow
          </p>
        </div>

        {/* Links side */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>
            Quick links
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: '/', label: 'Pick Equipment' },
              { href: '/builder', label: 'Workout Builder' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
