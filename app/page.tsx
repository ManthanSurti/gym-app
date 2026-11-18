import { getEquipmentCounts, buildEquipmentSections, EQUIPMENT_PRESETS } from '@/lib/exercises'
import EquipmentSelector from '@/components/EquipmentSelector'

export default function HomePage() {
  const counts = getEquipmentCounts()
  const sections = buildEquipmentSections(counts)
  return <EquipmentSelector sections={sections} presets={EQUIPMENT_PRESETS} />
}
