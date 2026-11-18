import { readFileSync } from 'fs'
import path from 'path'
import type { Exercise, BodyPart, EquipmentGroup } from './types'

let _cache: Exercise[] | null = null

export function getAllExercises(): Exercise[] {
  if (_cache) return _cache
  const filePath = path.join(process.cwd(), 'public', 'data', 'exercises.json')
  const raw = readFileSync(filePath, 'utf-8')
  _cache = JSON.parse(raw) as Exercise[]
  return _cache
}

export function getExerciseById(id: string): Exercise | undefined {
  return getAllExercises().find((e) => e.id === id)
}

export function filterByEquipment(equipment: string[]): Exercise[] {
  if (!equipment.length) return getAllExercises()
  const set = new Set(equipment)
  return getAllExercises().filter((e) => set.has(e.equipment))
}

export function getBodyPartsForEquipment(equipment: string[]): BodyPart[] {
  const exercises = filterByEquipment(equipment)
  return [...new Set(exercises.map((e) => e.body_part))] as BodyPart[]
}

export function getExercisesForBodyPart(bodyPart: string, equipment: string[]): Exercise[] {
  return filterByEquipment(equipment).filter((e) => e.body_part === bodyPart)
}

export function getExercisesForBodyParts(bodyParts: string[], equipment: string[]): Exercise[] {
  if (!bodyParts.length) return filterByEquipment(equipment)
  const set = new Set(bodyParts)
  return filterByEquipment(equipment).filter((e) => set.has(e.body_part))
}

export function getRelatedExercises(exerciseId: string, equipment: string[], limit = 6): Exercise[] {
  const ex = getExerciseById(exerciseId)
  if (!ex) return []
  const pool = equipment.length ? filterByEquipment(equipment) : getAllExercises()
  return pool
    .filter((e) => e.id !== exerciseId)
    .map((e) => ({
      ex: e,
      score:
        (e.target === ex.target ? 3 : 0) +
        (e.equipment === ex.equipment ? 2 : 0) +
        (e.body_part === ex.body_part ? 1 : 0),
    }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((e) => e.ex)
}

export function getEquipmentCounts(): Record<string, number> {
  const all = getAllExercises()
  const counts: Record<string, number> = {}
  for (const ex of all) {
    counts[ex.equipment] = (counts[ex.equipment] ?? 0) + 1
  }
  return counts
}

export const GIF_BASE = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/'

export function gifUrl(exercise: Exercise): string {
  return GIF_BASE + exercise.gif_url
}

export function thumbUrl(exercise: Exercise): string {
  return GIF_BASE + exercise.image
}

export interface EquipmentItem {
  value: string       // exact dataset key
  label: string       // user-friendly display name
  description: string // tooltip/subtitle
  icon: string        // svg path content (viewBox 0 0 24 24)
  count: number       // exercises available
}

export interface EquipmentSection {
  label: string
  items: EquipmentItem[]
  specialty?: boolean  // collapsed by default
}

export const EQUIPMENT_PRESETS: Record<string, string[]> = {
  'Bodyweight Only': ['body weight'],
  'Home Gym': ['body weight', 'dumbbell', 'band', 'resistance band', 'kettlebell', 'weighted'],
  'Full Gym': ['body weight', 'dumbbell', 'barbell', 'cable', 'leverage machine', 'smith machine', 'kettlebell', 'ez barbell', 'weighted', 'band', 'resistance band'],
}

const ICONS: Record<string, string> = {
  'body weight': `<circle cx="12" cy="5" r="2.5"/><path d="M12 10c-2 0-4 1-4 3v1h8v-1c0-2-2-3-4-3z"/><path d="M8 20v-5M16 20v-5"/>`,
  'assisted': `<circle cx="12" cy="5" r="2.5"/><path d="M12 10c-2 0-4 1-4 3v1h8v-1c0-2-2-3-4-3z"/><path d="M6 17c0 0 1-2 6-2s6 2 6 2"/>`,
  'weighted': `<rect x="3" y="9" width="18" height="6" rx="2"/><path d="M7 9V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/>`,
  'dumbbell': `<rect x="2" y="10" width="4" height="4" rx="1"/><rect x="18" y="10" width="4" height="4" rx="1"/><rect x="6" y="11" width="12" height="2" rx="1"/><rect x="4" y="8" width="2" height="8" rx="1"/><rect x="18" y="8" width="2" height="8" rx="1"/>`,
  'barbell': `<rect x="1" y="11" width="22" height="2" rx="1"/><rect x="4" y="8" width="2" height="8" rx="1"/><rect x="18" y="8" width="2" height="8" rx="1"/><rect x="2" y="9.5" width="2" height="5" rx="0.5"/><rect x="20" y="9.5" width="2" height="5" rx="0.5"/>`,
  'ez barbell': `<path d="M2 12 Q6 8 12 12 Q18 16 22 12"/><rect x="4" y="8" width="2" height="8" rx="1"/><rect x="18" y="8" width="2" height="8" rx="1"/>`,
  'olympic barbell': `<rect x="1" y="11" width="22" height="2" rx="1"/><rect x="3" y="7" width="3" height="10" rx="1"/><rect x="18" y="7" width="3" height="10" rx="1"/>`,
  'trap bar': `<path d="M4 12h16M12 6v12"/><rect x="2" y="9" width="4" height="6" rx="1"/><rect x="18" y="9" width="4" height="6" rx="1"/>`,
  'kettlebell': `<path d="M12 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="none"/><circle cx="12" cy="2" r="2.5"/><path d="M8 7c-1 1-2 3-2 5a6 6 0 1 0 12 0c0-2-1-4-2-5H8z"/>`,
  'hammer': `<path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.75l-3.5-3.5-1.5 1.5 1.5 1.5-2 2-1.5-1.5-1.5 1.5 3.5 3.5h.75c.85 0 1.65.33 2.25.93l1.25 1.25"/>`,
  'cable': `<rect x="2" y="4" width="4" height="16" rx="1"/><circle cx="4" cy="12" r="2.5"/><path d="M6 12h12"/><circle cx="20" cy="8" r="2"/><path d="M18 8v8c0 1-1 2-2 2h-8"/>`,
  'leverage machine': `<rect x="3" y="3" width="18" height="18" rx="2" fill="none"/><path d="M3 9h18M9 3v18M15 3v18"/>`,
  'smith machine': `<path d="M4 20V4M20 20V4"/><path d="M4 12h16"/><rect x="8" y="10" width="8" height="4" rx="1"/>`,
  'band': `<path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="none" stroke-width="3"/>`,
  'resistance band': `<path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" fill="none" stroke-width="2.5"/><path d="M3 8l3 4-3 4M21 8l-3 4 3 4"/>`,
  'medicine ball': `<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16" stroke-opacity="0.3"/>`,
  'stability ball': `<circle cx="12" cy="14" r="8"/><path d="M6 10c1-2 3-3 6-3s5 1 6 3"/>`,
  'bosu ball': `<path d="M4 16c0-4.4 3.6-8 8-8s8 3.6 8 8"/><line x1="2" y1="16" x2="22" y2="16"/>`,
  'roller': `<rect x="3" y="9" width="18" height="6" rx="3"/>`,
  'wheel roller': `<circle cx="12" cy="12" r="6"/><path d="M5 12H2M22 12h-3M12 5V2M12 22v-3"/>`,
  'rope': `<path d="M4 20C4 20 8 4 12 4s8 16 8 16" fill="none"/><path d="M4 12c4-4 8-4 16 0"/>`,
  'sled machine': `<path d="M3 17l4-10h10l4 10"/><path d="M5 17h14"/><circle cx="8" cy="20" r="2"/><circle cx="16" cy="20" r="2"/>`,
  'stationary bike': `<circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M7 17l5-10 5 7"/><path d="M12 7h4"/>`,
  'elliptical machine': `<circle cx="12" cy="5" r="2"/><path d="M9 10c0 0-4 2-4 7h14c0-5-4-7-4-7"/><path d="M6 17c-2 0-3 1-3 2h18c0-1-1-2-3-2"/>`,
  'skierg machine': `<path d="M12 2v20M6 6l6 6 6-6M6 12l6 6 6-6"/>`,
  'stepmill machine': `<path d="M4 20h4v-4h4v-4h4v-4h4"/><path d="M4 20V8"/>`,
  'tire': `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>`,
  'upper body ergometer': `<circle cx="12" cy="12" r="3"/><path d="M12 9V4M15 10.5l4-2M15 13.5l4 2M12 15v5M9 13.5l-4 2M9 10.5l-4-2"/>`,
}

const DISPLAY_LABELS: Record<string, string> = {
  'body weight': 'Bodyweight',
  'assisted': 'Assisted Machine',
  'weighted': 'Weight Vest / Belt',
  'dumbbell': 'Dumbbells',
  'barbell': 'Barbell',
  'ez barbell': 'EZ Bar',
  'olympic barbell': 'Olympic Barbell',
  'trap bar': 'Trap Bar',
  'kettlebell': 'Kettlebell',
  'hammer': 'Hammer',
  'cable': 'Cable Machine',
  'leverage machine': 'Plate-Loaded Machine',
  'smith machine': 'Smith Machine',
  'band': 'Resistance Band',
  'resistance band': 'Resistance Band (loop)',
  'medicine ball': 'Medicine Ball',
  'stability ball': 'Stability Ball',
  'bosu ball': 'BOSU Ball',
  'roller': 'Foam Roller',
  'wheel roller': 'Ab Wheel',
  'rope': 'Battle Rope',
  'sled machine': 'Sled / Prowler',
  'stationary bike': 'Stationary Bike',
  'elliptical machine': 'Elliptical',
  'skierg machine': 'SkiErg',
  'stepmill machine': 'Stepmill',
  'tire': 'Tire',
  'upper body ergometer': 'Upper Body Erg',
}

const DISPLAY_DESCRIPTIONS: Record<string, string> = {
  'body weight': 'No equipment needed',
  'assisted': 'Machine-assisted exercises',
  'weighted': 'Added weight via vest or belt',
  'dumbbell': 'Pairs of free weights',
  'barbell': 'Olympic or standard barbell',
  'ez barbell': 'Curved grip bar for curls',
  'olympic barbell': 'Standard 20kg Olympic bar',
  'trap bar': 'Hexagonal lifting bar',
  'kettlebell': 'Cast iron bell weights',
  'hammer': 'Hammer-style grip',
  'cable': 'Pulley weight system',
  'leverage machine': 'Plate-loaded gym machines',
  'smith machine': 'Guided barbell rack',
  'band': 'Flat or tube resistance band',
  'resistance band': 'Loop-style band',
  'medicine ball': 'Weighted throw ball',
  'stability ball': 'Large inflatable ball',
  'bosu ball': 'Half-dome balance trainer',
  'roller': 'Foam roller for mobility',
  'wheel roller': 'Ab wheel roller',
  'rope': 'Heavy battle ropes',
  'sled machine': 'Weighted push/pull sled',
  'stationary bike': 'Spin bike or cycle',
  'elliptical machine': 'Low-impact cardio machine',
  'skierg machine': 'Ski simulation machine',
  'stepmill machine': 'Rotating staircase',
  'tire': 'Heavy tire for flips',
  'upper body ergometer': 'Arm crank ergometer',
}

export function buildEquipmentSections(counts: Record<string, number>): EquipmentSection[] {
  function item(value: string): EquipmentItem {
    return {
      value,
      label: DISPLAY_LABELS[value] ?? value,
      description: DISPLAY_DESCRIPTIONS[value] ?? '',
      icon: ICONS[value] ?? ICONS['dumbbell'],
      count: counts[value] ?? 0,
    }
  }

  return [
    {
      label: 'Bodyweight',
      items: ['body weight', 'assisted', 'weighted'].map(item),
    },
    {
      label: 'Free Weights',
      items: ['dumbbell', 'barbell', 'kettlebell', 'ez barbell', 'olympic barbell', 'trap bar', 'hammer'].map(item),
    },
    {
      label: 'Machines',
      items: ['cable', 'leverage machine', 'smith machine'].map(item),
    },
    {
      label: 'Bands',
      items: ['band', 'resistance band'].map(item),
    },
    {
      label: 'Accessories',
      items: ['medicine ball', 'stability ball', 'rope', 'roller', 'wheel roller', 'bosu ball'].map(item),
    },
    {
      label: 'Cardio & Specialty',
      specialty: true,
      items: ['sled machine', 'stationary bike', 'elliptical machine', 'skierg machine', 'stepmill machine', 'tire', 'upper body ergometer'].map(item),
    },
  ]
}

export const BODY_PART_META: Record<BodyPart, { label: string; emoji: string }> = {
  back: { label: 'Back', emoji: '🔙' },
  cardio: { label: 'Cardio', emoji: '🏃' },
  chest: { label: 'Chest', emoji: '💪' },
  'lower arms': { label: 'Lower Arms', emoji: '🤜' },
  'lower legs': { label: 'Lower Legs', emoji: '🦵' },
  neck: { label: 'Neck', emoji: '🦒' },
  shoulders: { label: 'Shoulders', emoji: '🤷' },
  'upper arms': { label: 'Upper Arms', emoji: '💪' },
  'upper legs': { label: 'Upper Legs', emoji: '🦵' },
  waist: { label: 'Waist / Core', emoji: '⭕' },
}

// Keep for backwards compat
export const EQUIPMENT_GROUPS = buildEquipmentSections({}).map((s) => ({
  label: s.label,
  items: s.items.map((i) => i.value),
}))
