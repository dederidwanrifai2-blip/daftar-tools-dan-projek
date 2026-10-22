/**
 * Mengelompokkan array proyek berdasarkan kategori.
 * Kategori "Otomasi" selalu ditempatkan pertama,
 * kategori lainnya diurutkan secara abjad (locale: 'id').
 *
 * @param {Array<{kategori: string, [key: string]: any}>} projects
 * @returns {Array<{kategori: string, proyek: Array}>}
 */
export function groupByCategory(projects) {
  // Gunakan Map agar nama kategori tidak bentrok dengan inherited properties
  // seperti "toString", "valueOf", "constructor", dll.
  const map = new Map()
  for (const p of projects) {
    if (!map.has(p.kategori)) map.set(p.kategori, [])
    map.get(p.kategori).push(p)
  }

  // "Otomasi" selalu pertama, lainnya abjad
  const keys = [...map.keys()].sort((a, b) => {
    if (a === 'Otomasi') return -1
    if (b === 'Otomasi') return 1
    return a.localeCompare(b, 'id')
  })

  return keys.map(k => ({ kategori: k, proyek: map.get(k) }))
}
