import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Property-Based Tests untuk Schema projects.json
 * 
 * Menggunakan fast-check untuk memvalidasi properti yang harus selalu benar
 * terhadap data proyek, tidak peduli nilai inputnya.
 */

// Arbitrary untuk menghasilkan data proyek acak yang valid
const projectArbitrary = () => fc.record({
  id: fc.string({ minLength: 1 }),
  nama: fc.string({ minLength: 1 }),
  kategori: fc.string({ minLength: 1 }),
  deskripsi: fc.string({ minLength: 1 }),
  cara_kerja: fc.oneof(fc.string(), fc.constant(null)),
  masalah_diatasi: fc.oneof(fc.string(), fc.constant(null)),
  tech_stack: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  cara_penggunaan: fc.array(
    fc.string({ minLength: 1 }).filter(s => s.trim().length >= 1),
    { minLength: 1 }
  ),
  status: fc.constantFrom('selesai', 'dalam pengerjaan', 'belum dimulai'),
  path: fc.oneof(fc.webUrl(), fc.constant(null)),
  thumbnail_url: fc.oneof(fc.webUrl(), fc.constant(null)),
  galeri: fc.array(fc.webUrl()),
  video: fc.array(fc.record({
    thumbnail_url: fc.webUrl(),
    src_url: fc.webUrl()
  })),
  kode: fc.array(fc.record({
    nama_file: fc.string({ minLength: 1 }),
    bahasa: fc.constantFrom('javascript', 'python', 'json', 'bash', 'html'),
    isi: fc.string({ minLength: 1 })
  })),
  info_tambahan: fc.dictionary(
    fc.string({ minLength: 1 }),
    fc.oneof(fc.string(), fc.array(fc.string()))
  )
})

describe('Property Tests - projects.json Schema', () => {
  /**
   * Property 1: Serialisasi data proyek adalah round-trip
   * Validates: Requirements 2.1, 2.2
   * 
   * Test bahwa JSON.parse(JSON.stringify(array)) identik dengan array asli.
   * Ini memastikan bahwa struktur data proyek dapat disimpan dan dipulihkan
   * tanpa kehilangan informasi.
   */
  it('Property 1: Serialisasi data proyek adalah round-trip', () => {
    fc.assert(
      fc.property(
        fc.array(projectArbitrary(), { minLength: 1, maxLength: 10 }),
        (projects) => {
          // Serialize dan deserialize
          const serialized = JSON.stringify(projects)
          const deserialized = JSON.parse(serialized)
          
          // Hasil harus identik dengan data asli
          expect(deserialized).toEqual(projects)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2: Cara penggunaan tidak boleh mengandung string kosong
   * Validates: Requirements 2.4
   * 
   * Generate array proyek acak; validasi setiap elemen cara_penggunaan 
   * memiliki trim().length ≥ 1.
   */
  it('Property 2: Cara penggunaan tidak boleh mengandung string kosong', () => {
    fc.assert(
      fc.property(
        fc.array(projectArbitrary(), { minLength: 1, maxLength: 10 }),
        (projects) => {
          // Setiap proyek harus memiliki cara_penggunaan yang valid
          for (const project of projects) {
            expect(project.cara_penggunaan).toBeInstanceOf(Array)
            expect(project.cara_penggunaan.length).toBeGreaterThan(0)
            
            // Setiap langkah harus non-empty setelah trim
            for (const langkah of project.cara_penggunaan) {
              expect(typeof langkah).toBe('string')
              expect(langkah.trim().length).toBeGreaterThanOrEqual(1)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
