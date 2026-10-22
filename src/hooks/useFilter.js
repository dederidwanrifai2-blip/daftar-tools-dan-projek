import { useState, useMemo } from 'react'
import { filterProjects } from '../utils/filterProjects'
import { groupByCategory } from '../utils/groupByCategory'

/**
 * Hook untuk mengelola state filter kategori dan search query,
 * serta menghitung daftar proyek terfilter dan terkelompok secara efisien.
 *
 * @param {Array} projects - Array proyek dari DataContext
 * @returns {{
 *   activeKategori: string,
 *   setActiveKategori: Function,
 *   searchQuery: string,
 *   setSearchQuery: Function,
 *   filtered: Array,
 *   grouped: Array
 * }}
 *
 * Requirements: 4.2, 4.4, 4.5
 */
export function useFilter(projects) {
  const [activeKategori, setActiveKategori] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  // Hitung filtered hanya saat projects/activeKategori/searchQuery berubah — Req 4.4 (≤300ms)
  const filtered = useMemo(
    () => filterProjects(projects, activeKategori, searchQuery),
    [projects, activeKategori, searchQuery]
  )

  // Kelompokkan hasil filter per kategori — Req 3.3, 3.4
  const grouped = useMemo(
    () => groupByCategory(filtered),
    [filtered]
  )

  return {
    activeKategori,
    setActiveKategori,
    searchQuery,
    setSearchQuery,
    filtered,
    grouped,
  }
}
