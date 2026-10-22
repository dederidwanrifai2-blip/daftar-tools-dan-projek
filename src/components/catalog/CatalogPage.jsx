/**
 * CatalogPage.jsx
 * Halaman utama: Hero + FilterBar + SearchInput + daftar CategoryGroup.
 *
 * Alur data:
 *   DataContext  →  useData()   →  { projects, loading, error }
 *   useFilter(projects)         →  { activeKategori, setActiveKategori,
 *                                    searchQuery, setSearchQuery,
 *                                    filtered, grouped }
 *
 * State / loading / error:
 *   - loading → pesan "Memuat data..."
 *   - error   → komponen ErrorMessage
 *   - data kosong tapi tidak error → "Tidak ada proyek yang tersedia"
 *   - filter/search tanpa hasil   → "Tidak ada proyek yang ditemukan"
 *
 * Requirements: 3.3, 3.4, 3.5, 3.9, 4.6, 7.1
 */

import { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { useFilter } from '../../hooks/useFilter'
import HeroSection from './HeroSection'
import FilterBar from './FilterBar'
import SearchInput from './SearchInput'
import CategoryGroup from './CategoryGroup'
import ErrorMessage from '../shared/ErrorMessage'

/* ── Styles ─────────────────────────────────────────────────── */

const mainStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '40px 24px 80px',
}

const controlsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '32px',
}

const groupListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
}

const emptyStyle = {
  padding: '48px 0',
  textAlign: 'center',
  color: 'var(--text-secondary)',
  fontSize: '1rem',
}

const loadingStyle = {
  padding: '80px 24px',
  textAlign: 'center',
  color: 'var(--text-secondary)',
  fontSize: '1rem',
}

/* ── Komponen ────────────────────────────────────────────────── */

export default function CatalogPage() {
  const { projects, loading, error } = useData()

  const {
    activeKategori,
    setActiveKategori,
    searchQuery,
    setSearchQuery,
    grouped,
  } = useFilter(projects)

  /**
   * Daftar kategori unik untuk FilterBar.
   * Urutan: "Otomasi" dulu, lain-lain abjad — konsisten dengan groupByCategory.
   */
  const kategoris = useMemo(() => {
    const unik = [...new Set(projects.map((p) => p.kategori))]
    return unik.sort((a, b) => {
      if (a === 'Otomasi') return -1
      if (b === 'Otomasi') return 1
      return a.localeCompare(b, 'id')
    })
  }, [projects])

  /* ── Render states ──────────────────────────────────────────── */

  // 1. Loading
  if (loading) {
    return (
      <>
        <HeroSection />
        <div style={loadingStyle} aria-live="polite">
          Memuat data...
        </div>
      </>
    )
  }

  // 2. Error fetch / parse
  if (error) {
    return (
      <>
        <HeroSection />
        <div style={mainStyle}>
          <ErrorMessage pesan={error} />
        </div>
      </>
    )
  }

  // 3. Data kosong sama sekali (Req 3.9)
  if (projects.length === 0) {
    return (
      <>
        <HeroSection />
        <main style={mainStyle}>
          <p style={emptyStyle}>Tidak ada proyek yang tersedia</p>
        </main>
      </>
    )
  }

  /* ── Render normal ──────────────────────────────────────────── */

  // Apakah ada hasil setelah filter/search?
  const adaHasil = grouped.length > 0

  return (
    <>
      <HeroSection />

      <main id="katalog" style={mainStyle}>
        {/* Filter & Search controls */}
        <section aria-label="Filter dan pencarian proyek" style={controlsStyle}>
          <FilterBar
            kategoris={kategoris}
            active={activeKategori}
            onSelect={setActiveKategori}
          />
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </section>

        {/* Daftar CategoryGroup atau pesan kosong */}
        {adaHasil ? (
          <div style={groupListStyle}>
            {grouped.map(({ kategori, proyek }) => (
              <CategoryGroup
                key={kategori}
                kategori={kategori}
                proyek={proyek}
              />
            ))}
          </div>
        ) : (
          /* Req 4.6: tidak ada proyek yang cocok dengan filter/search */
          <p style={emptyStyle} aria-live="polite">
            Tidak ada proyek yang ditemukan
          </p>
        )}
      </main>
    </>
  )
}
