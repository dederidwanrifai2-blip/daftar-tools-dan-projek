import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { groupByCategory } from '../groupByCategory.js'

// ---------------------------------------------------------------------------
// Arbitrary helper
// ---------------------------------------------------------------------------

/**
 * Menghasilkan string kategori yang valid (tidak kosong, tidak ada spasi
 * leading/trailing, panjang 1–30 karakter, hanya huruf/spasi).
 */
const kategoriArb = fc
  .stringMatching(/^[A-Za-z ]{1,30}$/)
  .filter(s => s.trim().length > 0)

/**
 * Menghasilkan satu objek proyek minimal dengan field `kategori`.
 */
const proyekArb = kategoriArb.map(kategori => ({ kategori }))

/**
 * Menghasilkan array proyek non-kosong dengan kategori acak.
 */
const proyekArrayArb = fc.array(proyekArb, { minLength: 1, maxLength: 50 })

// ---------------------------------------------------------------------------
// Property 4 — Pengelompokan kategori selalu konsisten
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------

describe('Property 4: Pengelompokan kategori selalu konsisten', () => {
  it('setiap proyek muncul tepat satu kali dalam hasil grouping', () => {
    /**
     * Validates: Requirements 3.3
     *
     * Untuk sembarang array proyek:
     *  - Total proyek di semua kelompok == panjang array input
     *  - Setiap kelompok hanya berisi proyek dengan kategori yang sama
     *  - Tidak ada kategori duplikat di hasil
     */
    fc.assert(
      fc.property(proyekArrayArb, projects => {
        const grouped = groupByCategory(projects)

        // Jumlah proyek di semua kelompok harus sama dengan input
        const totalProyek = grouped.reduce((sum, g) => sum + g.proyek.length, 0)
        expect(totalProyek).toBe(projects.length)

        // Setiap proyek dalam kelompok harus memiliki kategori yang sesuai
        for (const group of grouped) {
          for (const p of group.proyek) {
            expect(p.kategori).toBe(group.kategori)
          }
        }

        // Tidak ada duplikat kategori dalam hasil
        const categories = grouped.map(g => g.kategori)
        const uniqueCategories = new Set(categories)
        expect(categories.length).toBe(uniqueCategories.size)
      }),
      { numRuns: 100 }
    )
  })

  it('setiap kategori unik dari input menghasilkan tepat satu kelompok', () => {
    /**
     * Validates: Requirements 3.3
     *
     * Jumlah kelompok harus sama persis dengan jumlah nilai kategori unik
     * di array input.
     */
    fc.assert(
      fc.property(proyekArrayArb, projects => {
        const grouped = groupByCategory(projects)
        const uniqueKategori = new Set(projects.map(p => p.kategori))
        expect(grouped.length).toBe(uniqueKategori.size)
      }),
      { numRuns: 100 }
    )
  })

  it('hasil grouping bersifat deterministik — input yang sama selalu menghasilkan output yang sama', () => {
    /**
     * Validates: Requirements 3.3
     *
     * Memanggil groupByCategory dua kali dengan input identik harus
     * menghasilkan struktur yang identik.
     */
    fc.assert(
      fc.property(proyekArrayArb, projects => {
        const result1 = groupByCategory(projects)
        const result2 = groupByCategory(projects)
        expect(JSON.stringify(result1)).toBe(JSON.stringify(result2))
      }),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 5 — Kategori "Otomasi" selalu menjadi kelompok pertama
// Validates: Requirements 3.4
// ---------------------------------------------------------------------------

describe('Property 5: Kategori "Otomasi" selalu menjadi kelompok pertama', () => {
  it('jika ada proyek berkategori "Otomasi", kelompok pertama adalah "Otomasi"', () => {
    /**
     * Validates: Requirements 3.4
     *
     * Untuk setiap array proyek yang mengandung minimal satu proyek
     * berkategori "Otomasi", kelompok pertama dalam hasil harus "Otomasi".
     */
    const arrayDenganOtomasiArb = fc
      .tuple(
        fc.array(proyekArb, { minLength: 0, maxLength: 30 }),
        fc.array(proyekArb, { minLength: 0, maxLength: 30 })
      )
      .map(([before, after]) => [
        ...before,
        { kategori: 'Otomasi' },
        ...after,
      ])

    fc.assert(
      fc.property(arrayDenganOtomasiArb, projects => {
        const grouped = groupByCategory(projects)
        expect(grouped[0].kategori).toBe('Otomasi')
      }),
      { numRuns: 100 }
    )
  })

  it('jika tidak ada "Otomasi", kelompok pertama bukan "Otomasi" dan urutan abjad dipakai', () => {
    /**
     * Validates: Requirements 3.4
     *
     * Jika tidak ada kategori "Otomasi", kelompok pertama mengikuti urutan
     * abjad (localeCompare 'id') — dan semua kelompok tidak bernama "Otomasi".
     */
    const arrayTanpaOtomasiArb = fc
      .array(proyekArb, { minLength: 1, maxLength: 50 })
      .filter(arr => arr.every(p => p.kategori !== 'Otomasi'))

    fc.assert(
      fc.property(arrayTanpaOtomasiArb, projects => {
        const grouped = groupByCategory(projects)

        // Tidak ada kelompok bernama "Otomasi"
        expect(grouped.every(g => g.kategori !== 'Otomasi')).toBe(true)

        // Urutan kelompok mengikuti abjad (localeCompare 'id')
        for (let i = 0; i < grouped.length - 1; i++) {
          const a = grouped[i].kategori
          const b = grouped[i + 1].kategori
          expect(a.localeCompare(b, 'id')).toBeLessThanOrEqual(0)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('"Otomasi" tetap pertama meski ada kategori yang secara abjad mendahului "Otomasi"', () => {
    /**
     * Validates: Requirements 3.4
     *
     * Kategori seperti "Alat" atau "Analitik" secara abjad mendahului
     * "Otomasi", tetapi "Otomasi" harus tetap berada di posisi pertama.
     */
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('Alat', 'Analitik', 'Backend', 'Framework', 'Otomasi', 'Produksi', 'Tools'),
          { minLength: 2, maxLength: 10 }
        ),
        kategoriList => {
          // Pastikan "Otomasi" ada di input
          const kategoriDenganOtomasi = [...new Set([...kategoriList, 'Otomasi'])]
          const projects = kategoriDenganOtomasi.map(k => ({ kategori: k }))

          const grouped = groupByCategory(projects)
          expect(grouped[0].kategori).toBe('Otomasi')
        }
      ),
      { numRuns: 100 }
    )
  })
})
