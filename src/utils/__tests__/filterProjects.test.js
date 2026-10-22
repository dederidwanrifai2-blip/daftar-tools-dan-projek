import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { filterProjects } from '../filterProjects.js'

// ---------------------------------------------------------------------------
// Arbitrary generator untuk satu objek proyek
// ---------------------------------------------------------------------------

/**
 * Arbitrary untuk satu proyek yang valid untuk filterProjects.
 * Field yang dipakai fungsi: `nama`, `deskripsi`, `kategori`.
 */
function projektArbitrary() {
  return fc.record({
    id: fc.uuid(),
    nama: fc.string({ minLength: 1, maxLength: 80 }),
    deskripsi: fc.string({ minLength: 1, maxLength: 200 }),
    kategori: fc.constantFrom('Otomasi', 'Produksi', 'Tools', 'API', 'Lainnya'),
    status: fc.constantFrom('selesai', 'dalam pengerjaan', 'belum dimulai'),
  })
}

// Kategori yang dikenali oleh generator
const KATEGORI_LIST = ['Otomasi', 'Produksi', 'Tools', 'API', 'Lainnya']

// ---------------------------------------------------------------------------
// Property 7: Filter kategori menampilkan proyek yang tepat
// Validates: Requirements 4.2
// ---------------------------------------------------------------------------

describe('Property 7: Filter kategori menampilkan proyek yang tepat', () => {
  it('hanya proyek dengan kategori yang sama yang lolos filter non-Semua', () => {
    /**
     * Validates: Requirements 4.2
     *
     * Untuk setiap array proyek dan setiap kategori yang dipilih:
     * - Setiap proyek dalam hasil harus memiliki kategori == kategori yang dipilih
     * - Setiap proyek yang TIDAK ada dalam hasil harus memiliki kategori != yang dipilih
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...KATEGORI_LIST),
        (projects, kategori) => {
          const hasil = filterProjects(projects, kategori, '')

          // Semua hasil harus cocok dengan kategori
          const semuaCocok = hasil.every(p => p.kategori === kategori)

          // Semua yang tidak cocok di projects tidak boleh ada di hasil
          const yangTidakCocok = projects.filter(p => p.kategori !== kategori)
          const adaYangLolos = yangTidakCocok.some(p => hasil.includes(p))

          return semuaCocok && !adaYangLolos
        }
      ),
      { numRuns: 100 }
    )
  })

  it('filter "Semua" mengembalikan seluruh proyek tanpa pengecualian', () => {
    /**
     * Validates: Requirements 4.2
     *
     * Ketika kategori = 'Semua', semua proyek harus lolos (tanpa filter query).
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 0, maxLength: 30 }),
        (projects) => {
          const hasil = filterProjects(projects, 'Semua', '')
          return hasil.length === projects.length
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 8: Search mengembalikan semua yang cocok, tidak lebih
// Validates: Requirements 4.4
// ---------------------------------------------------------------------------

describe('Property 8: Search mengembalikan semua yang cocok, tidak lebih', () => {
  it('hasil search adalah subset exact dari proyek yang cocok substring', () => {
    /**
     * Validates: Requirements 4.4
     *
     * Untuk setiap array proyek dan setiap query (panjang 1-20 karakter):
     * - Setiap proyek dalam hasil HARUS mengandung query di nama atau deskripsi (case-insensitive)
     * - Setiap proyek yang cocok di projects HARUS muncul di hasil
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 0, maxLength: 30 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (projects, query) => {
          const hasil = filterProjects(projects, 'Semua', query)
          const q = query.trim().toLowerCase()

          // Jika query hanya spasi (trim jadi ''), semua harus lolos
          if (q.length === 0) {
            return hasil.length === projects.length
          }

          const cocokManual = projects.filter(p =>
            p.nama.toLowerCase().includes(q) ||
            p.deskripsi.toLowerCase().includes(q)
          )

          // Panjang harus sama (tidak lebih, tidak kurang)
          if (hasil.length !== cocokManual.length) return false

          // Setiap elemen di hasil harus ada di cocokManual
          return hasil.every(p => cocokManual.includes(p))
        }
      ),
      { numRuns: 100 }
    )
  })

  it('query kosong mengembalikan seluruh proyek', () => {
    /**
     * Validates: Requirements 4.4
     *
     * Query kosong (string kosong atau hanya spasi) harus mengembalikan semua proyek.
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 0, maxLength: 30 }),
        fc.constantFrom('', '   ', '  '),
        (projects, query) => {
          const hasil = filterProjects(projects, 'Semua', query)
          return hasil.length === projects.length
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 9: Kombinasi filter+search adalah intersection yang benar
// Validates: Requirements 4.5
// ---------------------------------------------------------------------------

describe('Property 9: Kombinasi filter+search adalah intersection yang benar', () => {
  it('hasil kombinasi = proyek yang lolos filter kategori DAN lolos search', () => {
    /**
     * Validates: Requirements 4.5
     *
     * filterProjects(projects, K, Q) harus ekuivalen dengan:
     *   filterProjects(filterProjects(projects, K, ''), 'Semua', Q)
     * yaitu: intersection antara filter kategori dan filter search.
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...KATEGORI_LIST),
        fc.string({ minLength: 0, maxLength: 20 }),
        (projects, kategori, query) => {
          const hasilKombinasi = filterProjects(projects, kategori, query)

          const q = query.trim().toLowerCase()

          // Hitung manual: cocok kategori DAN cocok search
          const interseksi = projects.filter(p => {
            const cocokKat = p.kategori === kategori
            const cocokSearch = q.length === 0
              || p.nama.toLowerCase().includes(q)
              || p.deskripsi.toLowerCase().includes(q)
            return cocokKat && cocokSearch
          })

          if (hasilKombinasi.length !== interseksi.length) return false
          return hasilKombinasi.every(p => interseksi.includes(p))
        }
      ),
      { numRuns: 100 }
    )
  })

  it('kombinasi filter+search tidak pernah mengembalikan lebih dari filter saja', () => {
    /**
     * Validates: Requirements 4.5
     *
     * Menambahkan search tidak boleh memperluas hasil — hanya mempersempit atau sama.
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...KATEGORI_LIST),
        fc.string({ minLength: 1, maxLength: 20 }),
        (projects, kategori, query) => {
          const hasilFilterSaja = filterProjects(projects, kategori, '')
          const hasilKombinasi = filterProjects(projects, kategori, query)
          return hasilKombinasi.length <= hasilFilterSaja.length
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 10: Reset filter mengembalikan semua proyek
// Validates: Requirements 4.7
// ---------------------------------------------------------------------------

describe('Property 10: Reset filter mengembalikan semua proyek', () => {
  it('kategori "Semua" dan query kosong mengembalikan seluruh array asli', () => {
    /**
     * Validates: Requirements 4.7
     *
     * State "reset" = kategori 'Semua' + query ''.
     * Harus mengembalikan seluruh proyek persis sama (referensi dan urutan).
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 0, maxLength: 50 }),
        (projects) => {
          const hasil = filterProjects(projects, 'Semua', '')

          // Panjang harus identik
          if (hasil.length !== projects.length) return false

          // Urutan dan referensi harus identik
          return hasil.every((p, i) => p === projects[i])
        }
      ),
      { numRuns: 100 }
    )
  })

  it('setelah reset, proyek yang sebelumnya terfilter kembali muncul', () => {
    /**
     * Validates: Requirements 4.7
     *
     * Simulasi siklus: filter → reset.
     * Setelah reset ke ('Semua', ''), hasilnya harus sama dengan state awal.
     */
    fc.assert(
      fc.property(
        fc.array(projektArbitrary(), { minLength: 1, maxLength: 30 }),
        fc.constantFrom(...KATEGORI_LIST),
        fc.string({ minLength: 1, maxLength: 15 }),
        (projects, kategori, query) => {
          // Terapkan filter
          const hasilFiltered = filterProjects(projects, kategori, query)

          // Reset
          const hasilReset = filterProjects(projects, 'Semua', '')

          // Reset harus mengembalikan semua proyek asli
          if (hasilReset.length !== projects.length) return false

          // Setiap proyek yang hilang saat filter harus kembali setelah reset
          const hilangSaatFilter = projects.filter(p => !hasilFiltered.includes(p))
          return hilangSaatFilter.every(p => hasilReset.includes(p))
        }
      ),
      { numRuns: 100 }
    )
  })
})
