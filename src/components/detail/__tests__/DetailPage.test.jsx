/**
 * DetailPage — Property-Based Tests
 *
 * Property 3: Proyek dengan field opsional kosong tetap bisa dirender
 * **Validates: Requirements 2.8, 5.2**
 *
 * Generator menghasilkan kombinasi acak field opsional yang bernilai null atau
 * array kosong; render DetailPage; assert:
 *   1. Render tidak throw error
 *   2. Seksi yang fieldnya kosong/null tidak tampil dalam output
 */

import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import * as fc from 'fast-check'
import { DataContext } from '../../../context/DataContext'
import DetailPage from '../DetailPage'

// ---------------------------------------------------------------------------
// Helper: buat proyek minimal yang valid dengan field opsional bisa dikontrol
// ---------------------------------------------------------------------------

/**
 * Buat objek proyek lengkap yang valid.
 * Field opsional diisi berdasarkan argumen overrides.
 *
 * @param {object} overrides - field opsional yang ingin di-override
 * @returns {object} proyek valid
 */
function buatProyek(overrides = {}) {
  return {
    id: 'test-proyek',
    nama: 'Proyek Test',
    kategori: 'Tools',
    deskripsi: 'Deskripsi proyek test.',
    tech_stack: ['React'],
    cara_penggunaan: ['Langkah satu'],
    status: 'selesai',
    path: null,
    thumbnail_url: null,
    // Field opsional — default diisi dengan nilai yang valid (ada konten)
    masalah_diatasi: 'Ada masalah yang diatasi.',
    cara_kerja: 'Cara kerja proyek ini.',
    galeri: [],
    video: [],
    kode: [],
    info_tambahan: {},
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Arbitraries (generator)
// ---------------------------------------------------------------------------

/**
 * Generator untuk setiap field opsional:
 * Masing-masing bisa bernilai null, string kosong, atau array kosong sesuai tipenya.
 */

// masalah_diatasi dan cara_kerja: null atau string kosong
const arbStringOpsional = fc.oneof(
  fc.constant(null),
  fc.constant(''),
)

// galeri, video, kode: null atau array kosong
const arbArrayOpsional = fc.oneof(
  fc.constant(null),
  fc.constant([]),
)

/**
 * Generator kombinasi: setiap field opsional secara independen bisa kosong/null.
 * `fc.record` dengan semua field akan menghasilkan semua 6 field sekaligus acak.
 *
 * Setiap run menghasilkan kombinasi unik dari field-field yang kosong —
 * ini mensimulasikan berbagai kondisi proyek yang hanya punya sebagian field.
 */
const arbFieldOpsionalKosong = fc.record({
  masalah_diatasi: arbStringOpsional,
  cara_kerja: arbStringOpsional,
  galeri: arbArrayOpsional,
  video: arbArrayOpsional,
  kode: arbArrayOpsional,
  // info_tambahan: object kosong atau null
  info_tambahan: fc.oneof(
    fc.constant(null),
    fc.constant({}),
  ),
})

// ---------------------------------------------------------------------------
// Helper render
// ---------------------------------------------------------------------------

/**
 * Mock value untuk DataContext.
 * Suplai proyek langsung, tanpa fetch — simulasi DataProvider yang sudah selesai load.
 */
function buatContextValue(proyek) {
  return {
    projects: [proyek],
    loading: false,
    error: null,
  }
}

/**
 * Render DetailPage di dalam MemoryRouter dengan route yang cocok (:id = 'test-proyek')
 * dan DataContext yang sudah di-mock dengan proyek yang diberikan.
 *
 * @param {object} proyek - proyek yang akan disuplai ke DataContext
 * @returns hasil dari render()
 */
function renderDetailPage(proyek) {
  const contextValue = buatContextValue(proyek)

  return render(
    <DataContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/projek/test-proyek']}>
        <Routes>
          <Route path="/projek/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    </DataContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Mock console.error untuk menangkap React rendering errors tanpa noise di output
// ---------------------------------------------------------------------------

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DetailPage — Property 3: field opsional kosong tetap bisa dirender', () => {
  /**
   * Property 3a: Render tidak throw error untuk semua kombinasi field opsional kosong/null
   * **Validates: Requirements 2.8, 5.2**
   *
   * Untuk setiap kombinasi field opsional yang bernilai null atau kosong,
   * rendering DetailPage tidak boleh melempar exception.
   */
  it('render tidak throw error untuk semua kombinasi field opsional kosong/null', () => {
    fc.assert(
      fc.property(arbFieldOpsionalKosong, (overrides) => {
        const proyek = buatProyek(overrides)

        // Render harus berhasil tanpa exception
        expect(() => {
          renderDetailPage(proyek)
        }).not.toThrow()

        cleanup()
      }),
      { numRuns: 200 },
    )
  })

  /**
   * Property 3b: Seksi masalah_diatasi tidak tampil jika field null atau string kosong
   * **Validates: Requirements 5.2**
   *
   * Saat `masalah_diatasi` bernilai null atau '',
   * heading "Masalah yang Diatasi" tidak boleh ada di dalam DOM.
   */
  it('seksi masalah_diatasi tidak tampil jika field null atau string kosong', () => {
    fc.assert(
      fc.property(arbStringOpsional, (masalah_diatasi) => {
        const proyek = buatProyek({ masalah_diatasi })
        const { container } = renderDetailPage(proyek)

        const headings = Array.from(container.querySelectorAll('h2'))
        const adaMasalah = headings.some((h) =>
          h.textContent.includes('Masalah yang Diatasi'),
        )
        expect(adaMasalah).toBe(false)

        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 3c: Seksi cara_kerja tidak tampil jika field null atau string kosong
   * **Validates: Requirements 5.2**
   */
  it('seksi cara_kerja tidak tampil jika field null atau string kosong', () => {
    fc.assert(
      fc.property(arbStringOpsional, (cara_kerja) => {
        const proyek = buatProyek({ cara_kerja })
        const { container } = renderDetailPage(proyek)

        const headings = Array.from(container.querySelectorAll('h2'))
        const adaCaraKerja = headings.some((h) =>
          h.textContent.includes('Cara Kerja'),
        )
        expect(adaCaraKerja).toBe(false)

        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 3d: Seksi Galeri tidak tampil jika `galeri` null atau array kosong
   * **Validates: Requirements 2.8, 5.2**
   */
  it('seksi Galeri tidak tampil jika `galeri` null atau array kosong', () => {
    fc.assert(
      fc.property(arbArrayOpsional, (galeri) => {
        const proyek = buatProyek({ galeri })
        const { container } = renderDetailPage(proyek)

        // GaleriSection render section dengan aria-label="Galeri foto"
        const galeriSection = container.querySelector('[aria-label="Galeri foto"]')
        expect(galeriSection).toBeNull()

        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 3e: Seksi Video tidak tampil jika `video` null atau array kosong
   * **Validates: Requirements 2.8, 5.2**
   */
  it('seksi Video tidak tampil jika `video` null atau array kosong', () => {
    fc.assert(
      fc.property(arbArrayOpsional, (video) => {
        const proyek = buatProyek({ video })
        const { container } = renderDetailPage(proyek)

        // VideoSection render section dengan aria-label="Video dokumentasi"
        const videoSection = container.querySelector('[aria-label="Video dokumentasi"]')
        expect(videoSection).toBeNull()

        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 3f: Seksi Source Code tidak tampil jika `kode` null atau array kosong
   * **Validates: Requirements 2.8, 5.2**
   */
  it('seksi Source Code tidak tampil jika `kode` null atau array kosong', () => {
    fc.assert(
      fc.property(arbArrayOpsional, (kode) => {
        const proyek = buatProyek({ kode })
        const { container } = renderDetailPage(proyek)

        // SourceCodeSection render section dengan aria-label="Source code"
        const kodeSection = container.querySelector('[aria-label="Source code"]')
        expect(kodeSection).toBeNull()

        cleanup()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 3g: Saat semua field opsional kosong sekaligus, halaman tetap render
   *              elemen wajib (nama, deskripsi, tombol kembali)
   * **Validates: Requirements 2.8, 5.1, 5.2**
   *
   * Ini memverifikasi bahwa konten wajib tidak ikut hilang saat semua
   * field opsional kosong.
   */
  it('elemen wajib tetap tampil saat semua field opsional kosong', () => {
    fc.assert(
      fc.property(arbFieldOpsionalKosong, (overrides) => {
        const proyek = buatProyek(overrides)
        const { container } = renderDetailPage(proyek)

        // Nama proyek harus tampil sebagai heading h1
        const h1 = container.querySelector('h1')
        expect(h1).not.toBeNull()
        expect(h1.textContent).toBe(proyek.nama)

        // Deskripsi harus tampil
        const article = container.querySelector('article')
        expect(article).not.toBeNull()
        expect(article.textContent).toContain(proyek.deskripsi)

        // Tombol kembali harus tampil
        const backLink = container.querySelector('a[aria-label="Kembali ke katalog"]')
        expect(backLink).not.toBeNull()

        cleanup()
      }),
      { numRuns: 200 },
    )
  })
})
