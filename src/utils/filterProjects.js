/**
 * Filter daftar proyek berdasarkan kategori dan query pencarian.
 *
 * @param {Array} projects - Array objek proyek dari Data_File
 * @param {string} kategori - Kategori yang dipilih, atau 'Semua' untuk semua proyek
 * @param {string} query - Teks pencarian substring (case-insensitive) pada nama/deskripsi
 * @returns {Array} Array proyek yang lolos kedua filter
 *
 * Requirements: 4.2, 4.4, 4.5, 4.7
 */
export function filterProjects(projects, kategori, query) {
  return projects.filter(p => {
    const cocokKategori = kategori === 'Semua' || p.kategori === kategori
    const q = query.trim().toLowerCase()
    const cocokSearch = q.length === 0
      || p.nama.toLowerCase().includes(q)
      || p.deskripsi.toLowerCase().includes(q)
    return cocokKategori && cocokSearch
  })
}
