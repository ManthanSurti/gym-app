export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getExercisesForBodyParts, BODY_PART_META, thumbUrl } from '@/lib/exercises'
import ExerciseGrid from '@/components/ExerciseGrid'
import type { BodyPart } from '@/lib/types'

interface Props {
  searchParams: Promise<Record<string, string | string[]>>
}

export default async function ExercisesMultiPage({ searchParams }: Props) {
  const sp = await searchParams

  const rawPart = sp['part']
  const rawEq = sp['eq']
  const parts: string[] = rawPart ? (Array.isArray(rawPart) ? rawPart : [rawPart]) : []
  const equipment: string[] = rawEq ? (Array.isArray(rawEq) ? rawEq : [rawEq]) : []

  const exercises = getExercisesForBodyParts(parts, equipment)
  const eqQuery = equipment.map((e) => `eq=${encodeURIComponent(e)}`).join('&')

  const title =
    parts.length === 1
      ? (BODY_PART_META[parts[0] as BodyPart]?.label ?? parts[0])
      : parts.length > 1
      ? `${parts.length} Muscle Groups`
      : 'All Exercises'

  const exerciseData = exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    target: ex.target,
    equipment: ex.equipment,
    thumb: thumbUrl(ex),
  }))

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/muscles?${eqQuery}`}
          style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          ← Back to muscles
        </Link>
        <div className="mt-4">
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
            <span style={{ color: 'var(--accent)' }}>{title}</span>
            <br />
            <span>exercises</span>
          </h1>
          {parts.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {parts.map((p) => (
                <span
                  key={p}
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
                  {BODY_PART_META[p as BodyPart]?.label ?? p}
                </span>
              ))}
            </div>
          )}
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginTop: 8 }}>
            {exercises.length} exercises found
          </p>
        </div>
      </div>

      <ExerciseGrid exercises={exerciseData} eqQuery={eqQuery} />
    </div>
  )
}
