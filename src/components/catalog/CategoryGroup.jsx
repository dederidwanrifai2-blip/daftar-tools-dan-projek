/**
 * CategoryGroup.jsx
 * Menampilkan satu kelompok kategori: heading + grid ProyekCard.
 *
 * Grid breakpoints (Req 7.1):
 *   < 600px   → 1 kolom
 *   600–1024px → 2 kolom
 *   > 1024px   → 3 kolom
 *
 * Props:
 *   kategori  {string}     — nama kategori yang ditampilkan sebagai heading
 *   proyek    {Project[]}  — array proyek dalam kategori ini
 *
 * Requirements: 3.3, 3.5, 7.1
 */

import { useState, useEffect } from 'react'
import ProyekCard from './ProyekCard'

/** Hitung jumlah kolom grid berdasarkan lebar window */
function getColumns() {
  const w = window.innerWidth
  if (w < 600) return 1
  if (w <= 1024) return 2
  return 3
}

const headingStyle = {
  fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
  fontWeight: '700',
  color: 'var(--text-primary)',
  margin: '0 0 16px 0',
  paddingBottom: '8px',
  borderBottom: '2px solid var(--accent)',
  display: 'inline-block',
}

/**
 * @param {{ kategori: string, proyek: import('../../types').Project[] }} props
 */
export default function CategoryGroup({ kategori, proyek }) {
  const [cols, setCols] = useState(getColumns)

  /* Update kolom saat window di-resize */
  useEffect(() => {
    const handle = () => setCols(getColumns())
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '20px',
  }

  return (
    <section aria-labelledby={`kategori-${kategori}`}>
      <h2 id={`kategori-${kategori}`} style={headingStyle}>
        {kategori}
      </h2>
      <div style={gridStyle} role="list">
        {proyek.map((p) => (
          <div key={p.id} role="listitem">
            <ProyekCard proyek={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
