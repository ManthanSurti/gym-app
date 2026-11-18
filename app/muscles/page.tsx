export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getBodyPartsForEquipment, BODY_PART_META } from '@/lib/exercises'
import MuscleGrid from '@/components/MuscleGrid'
import type { BodyPart } from '@/lib/types'

interface Props {
  searchParams: Promise<Record<string, string | string[]>>
}

export default async function MusclesPage({ searchParams }: Props) {
  const params = await searchParams
  const rawEq = params['eq']
  const equipment: string[] = rawEq
    ? Array.isArray(rawEq) ? rawEq : [rawEq]
    : []

  const bodyParts = getBodyPartsForEquipment(equipment)
  const eqQuery = equipment.map((e) => `eq=${encodeURIComponent(e)}`).join('&')

  const parts = bodyParts.map((part) => ({
    part,
    meta: BODY_PART_META[part as BodyPart],
  }))

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-150"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← Change equipment
        </Link>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
            Step 2 of 2
          </p>
          <h1
            className="text-5xl font-bold uppercase leading-tight"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            What do you<br />
            <span style={{ color: 'var(--color-primary)' }}>want to train?</span>
          </h1>
          {equipment.length > 0 && (
            <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {bodyParts.length} muscle groups available with your equipment
            </p>
          )}
        </div>
      </div>

      <MuscleGrid parts={parts} eqQuery={eqQuery} />

      {bodyParts.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>
          No exercises found.{' '}
          <Link href="/" className="underline" style={{ color: 'var(--color-primary)' }}>
            Try different equipment
          </Link>
        </p>
      )}
    </div>
  )
}
