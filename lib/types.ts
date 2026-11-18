export interface Exercise {
  id: string
  name: string
  category: string
  body_part: BodyPart
  equipment: string
  instructions: Record<string, string>
  instruction_steps: Record<string, string[]>
  muscle_group: string
  secondary_muscles: string[]
  target: string
  media_id: string
  image: string
  gif_url: string
  attribution: string
  created_at: string
}

export type BodyPart =
  | 'back'
  | 'cardio'
  | 'chest'
  | 'lower arms'
  | 'lower legs'
  | 'neck'
  | 'shoulders'
  | 'upper arms'
  | 'upper legs'
  | 'waist'

export interface EquipmentGroup {
  label: string
  items: string[]
}

export interface WorkoutExercise {
  exercise: Exercise
  sets: number
  reps: string
  note: string
}

export interface Workout {
  id: string
  name: string
  exercises: WorkoutExercise[]
  createdAt: string
}
