export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getExerciseById, getRelatedExercises, gifUrl, thumbUrl } from '@/lib/exercises'
import AddToBuilderButton from '@/components/AddToBuilderButton'
import RelatedExerciseCard from '@/components/RelatedExerciseCard'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[]>>
}

export default async function ExerciseDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const ex = getExerciseById(id)
  if (!ex) notFound()

  const rawEq = sp['eq']
  const equipment: string[] = rawEq ? (Array.isArray(rawEq) ? rawEq : [rawEq]) : []
  const eqQuery = equipment.map((e) => `eq=${encodeURIComponent(e)}`).join('&')
  const steps = ex.instruction_steps?.en ?? []

  const tags = [
    { label: ex.equipment },
    { label: ex.body_part },
    { label: ex.muscle_group },
  ].filter(Boolean)

  return (
    <div>
      {/* Back */}
      <Link
        href={`/exercises/${encodeURIComponent(ex.body_part)}?${eqQuery}`}
        style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}
      >
        ← {ex.body_part}
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: 48, alignItems: 'start' }}>
        {/* Left: GIF */}
        <div>
          <div style={{
            borderRadius: 24,
            border: '1px solid var(--border)',
            background: 'var(--bg-1)',
            overflow: 'hidden',
            aspectRatio: '1',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifUrl(ex)}
              alt={ex.name}
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: 16,
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>

          {/* Muscle tags */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              padding: '14px 16px',
              borderRadius: 14,
              border: '1px solid var(--border)',
              background: 'var(--bg-glass)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>
                Primary muscle
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', textTransform: 'capitalize' }}>
                {ex.target}
              </p>
            </div>
            {ex.secondary_muscles.length > 0 && (
              <div style={{
                padding: '14px 16px',
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'var(--bg-glass)',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>
                  Secondary
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                  {ex.secondary_muscles.join(' · ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {tags.map((t) => (
              <span
                key={t.label}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '4px 12px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  textTransform: 'capitalize',
                }}
              >
                {t.label}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text)', marginBottom: 28 }}>
            {ex.name}
          </h1>

          {/* Add to builder */}
          <div style={{ marginBottom: 36 }}>
            <AddToBuilderButton exercise={ex} />
          </div>

          {/* Steps */}
          {steps.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                How to perform
              </p>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {steps.map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{
                      flexShrink: 0,
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: 'var(--bg-3)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, paddingTop: 2 }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 32 }}>{ex.attribution}</p>
        </div>
      </div>

      {/* Related exercises */}
      {(() => {
        const related = getRelatedExercises(ex.id, equipment)
        if (!related.length) return null
        return (
          <div style={{ marginTop: 64 }}>
            <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 20 }}>
              More exercises
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
              gap: 12,
            }}>
              {related.map((r) => (
                <RelatedExerciseCard
                  key={r.id}
                  href={`/exercise/${r.id}?${eqQuery}`}
                  name={r.name}
                  target={r.target}
                  thumb={thumbUrl(r)}
                />
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
