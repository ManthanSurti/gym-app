import { getAllExercises } from '@/lib/exercises'
import WorkoutBuilder from '@/components/WorkoutBuilder'
import type { Exercise } from '@/lib/types'

export default function BuilderPage() {
  const exercises = getAllExercises()
  const exerciseMap: Record<string, Exercise> = {}
  exercises.forEach((e) => {
    exerciseMap[e.id] = e
  })

  return <WorkoutBuilder exerciseMap={exerciseMap} />
}
