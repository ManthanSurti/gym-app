export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getExercisesForBodyPart, thumbUrl, BODY_PART_META } from '@/lib/exercises'
import ExerciseGrid from '@/components/ExerciseGrid'
import type { BodyPart } from '@/lib/types'

interface Props {
  params: Promise<{ bodyPart: string }>
  searchParams: Promise<Record<string, string | string[]>>
}

export default async function ExercisesPage({ params, searchParams }: Props) {
  const { bodyPart: rawPart } = await params
  const bodyPart = decodeURIComponent(rawPart)
  const sp = await searchParams
  const rawEq = sp['eq']
  const equipment: string[] = rawEq
    ? Array.isArray(rawEq) ? rawEq : [rawEq]
    : []

  const exercises = getExercisesForBodyPart(bodyPart, equipment)
  const eqQuery = equipment.map((e) => `eq=${encodeURIComponent(e)}`).join('&')
  const meta = BODY_PART_META[bodyPart as BodyPart]

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
          className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-150"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← Back to muscles
        </Link>
        <div className="mt-4">
          <h1
            className="text-5xl font-bold uppercase leading-tight"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <span style={{ color: 'var(--color-primary)' }}>{meta?.label ?? bodyPart}</span>
            <br />
            <span>exercises</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {exercises.length} exercises found
          </p>
        </div>
      </div>

      <ExerciseGrid exercises={exerciseData} eqQuery={eqQuery} />
    </div>
  )
}
