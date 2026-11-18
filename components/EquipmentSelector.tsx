'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { EquipmentSection, EquipmentItem } from '@/lib/exercises'

interface Props {
  sections: EquipmentSection[]
  presets: Record<string, string[]>
}

const STORAGE_KEY = 'gymflow_equipment'

export default function EquipmentSelector({ sections, presets }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  const [specialtyOpen, setSpecialtyOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s) setSelected(new Set(JSON.parse(s)))
    } catch {}
  }, [])

  function save(next: Set<string>) {
    setSelected(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  }

  function toggle(value: string) {
    const next = new Set(selected)
    next.has(value) ? next.delete(value) : next.add(value)
    save(next)
  }

  function applyPreset(items: string[]) {
    save(new Set(items))
  }

  function selectSection(items: EquipmentItem[]) {
    const next = new Set(selected)
    items.forEach((i) => next.add(i.value))
    save(next)
  }

  function clearAll() { save(new Set()) }

  function proceed() {
    const params = [...selected].map((e) => `eq=${encodeURIComponent(e)}`).join('&')
    router.push(`/muscles?${params}`)
  }

  const mainSections = sections.filter((s) => !s.specialty)
  const specialtySections = sections.filter((s) => s.specialty)

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ marginBottom: 40 }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Step 1 of 2
        </p>
        <h1 style={{ fontSize: 'clamp(32px,6vw,56px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 12 }}>
          What equipment<br />
          <span style={{ color: 'var(--accent)' }}>do you have?</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 440 }}>
          Select everything available to you. We&apos;ll filter to only show exercises you can actually do.
        </p>
      </motion.div>

      {/* Quick presets */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ marginBottom: 36 }}
      >
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>
          Quick select
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(presets).map(([label, items]) => {
            const isActive = mounted && items.every((i) => selected.has(i)) && selected.size === items.length
            return (
              <motion.button
                key={label}
                onClick={() => applyPreset(items)}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-hover)'}`,
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 15 }}>
                  {label === 'Bodyweight Only' ? '🤸' : label === 'Home Gym' ? '🏠' : '🏋️'}
                </span>
                {label}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

      {/* Equipment sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {mainSections.map((section, si) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + 0.07 * si }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                {section.label}
              </span>
              <button
                onClick={() => selectSection(section.items)}
                style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                Select all
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 8 }}>
              {section.items.map((item) => (
                <EquipmentCard
                  key={item.value}
                  item={item}
                  active={mounted && selected.has(item.value)}
                  onToggle={() => toggle(item.value)}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Specialty — collapsed by default */}
        {specialtySections.map((section) => (
          <div key={section.label}>
            <button
              onClick={() => setSpecialtyOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 0',
                marginBottom: specialtyOpen ? 12 : 0,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                {section.label}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 4 }}>
                ({section.items.length} items)
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-tertiary)', marginLeft: 'auto', transform: specialtyOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                ↓
              </span>
            </button>
            <AnimatePresence>
              {specialtyOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 8 }}>
                    {section.items.map((item) => (
                      <EquipmentCard
                        key={item.value}
                        item={item}
                        active={mounted && selected.has(item.value)}
                        onToggle={() => toggle(item.value)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          position: 'sticky',
          bottom: 0,
          marginTop: 40,
          paddingTop: 20,
          paddingBottom: 20,
          background: 'linear-gradient(to top, #000 75%, transparent)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <motion.button
          onClick={proceed}
          disabled={selected.size === 0}
          whileHover={{ scale: selected.size > 0 ? 1.02 : 1 }}
          whileTap={{ scale: selected.size > 0 ? 0.97 : 1 }}
          style={{
            padding: '13px 28px',
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
            border: 'none',
            background: selected.size > 0 ? 'var(--accent)' : 'var(--bg-glass)',
            color: selected.size > 0 ? '#fff' : 'var(--text-tertiary)',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
        >
          Find exercises →
        </motion.button>

        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                {selected.size} selected
              </span>
              <button
                onClick={clearAll}
                style={{ fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function EquipmentCard({ item, active, onToggle }: { item: EquipmentItem; active: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '14px 14px',
        borderRadius: 14,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-dim)' : 'var(--bg-glass)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
    >
      {/* count badge */}
      <span style={{
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: 10,
        fontWeight: 600,
        color: active ? 'var(--accent)' : 'var(--text-tertiary)',
        letterSpacing: '0.03em',
      }}>
        {item.count}
      </span>

      {/* icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: active ? 'rgba(249,115,22,0.2)' : 'var(--bg-3)',
          color: active ? 'var(--accent)' : 'var(--text-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}
          dangerouslySetInnerHTML={{ __html: item.icon }}
        />
      </div>

      {/* label */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: active ? 'var(--text)' : 'var(--text-secondary)', lineHeight: 1.2, marginBottom: 2 }}>
          {item.label}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.3 }}>
          {item.description}
        </p>
      </div>
    </motion.button>
  )
}
