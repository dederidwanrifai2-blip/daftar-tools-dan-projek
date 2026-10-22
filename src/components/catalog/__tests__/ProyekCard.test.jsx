/**
 * ProyekCard — Property-Based Tests
 *
 * Property 6: Setiap Proyek_Card menampilkan semua field yang wajib
 * **Validates: Requirements 3.6**
 *
 * Generator menghasilkan proyek acak; render ProyekCard; assert:
 *   1. Teks nama proyek hadir dalam output
 *   2. Teks kategori proyek hadir dalam output
 *   3. Elemen StatusBadge (dengan aria-label yang cocok) hadir dalam output
 */

import { describe, it, expect } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import * as fc from 'fast-check'
import ProyekCard from '../ProyekCard'

// ---------------------------------------------------------------------------
// Arbitraries (generator)
// ---------------------------------------------------------------------------

/** Status valid sesuai schema */
const arbStatus = fc.constantFrom('selesai', 'dalam pengerjaan', 'belum dimulai')

/**
 * Generator nama/kategori: huruf Latin (a-z, A-Z), angka, spasi, tanda umum.
 * Dikecualikan karakter kontrol dan zero-width agar tidak mengganggu matcher teks.
 */
const arbNamaKategori = fc
  .stringMatching(/^[a-zA-Z0-9 !@#%^&*(),.'"\-_]{1,50}$/)
  .filter((s) => s.trim().length > 0)

const arbProyek = fc.record({
  id: fc.stringMatching(/^[a-z][a-z0-9-]{1,39}$/),   // kebab-case id
  nama: arbNamaKategori,
  kategori: arbNamaKategori,
  thumbnail_url: fc.option(fc.webUrl(), { nil: null }),
  status: arbStatus,
})

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Render ProyekCard di dalam MemoryRouter (karena komponen pakai useNavigate).
 * Mengembalikan { container, unmount } dari render().
 * Query dilakukan via `within(container)` untuk menghindari akumulasi DOM global.
 */
function renderProyekCard(proyek) {
  return render(
    <MemoryRouter>
      <ProyekCard proyek={proyek} />
    </MemoryRouter>
  )
}

/**
 * Label StatusBadge yang diharapkan berdasarkan status
 * (harus cocok dengan STATUS_CONFIG di StatusBadge.jsx)
 */
const expectedStatusLabel = {
  selesai: 'Selesai',
  'dalam pengerjaan': 'Dalam Pengerjaan',
  'belum dimulai': 'Belum Dimulai',
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProyekCard — Property 6: semua field wajib tampil', () => {
  /**
   * Property 6: Setiap Proyek_Card menampilkan semua field yang wajib
   * **Validates: Requirements 3.6**
   *
   * Untuk setiap proyek valid yang di-generate secara acak, rendering
   * ProyekCard harus mengandung:
   *   (a) teks nama proyek
   *   (b) teks kategori proyek
   *   (c) elemen StatusBadge dengan aria-label yang sesuai status proyek
   */
  it('menampilkan nama, kategori, dan StatusBadge untuk setiap proyek acak', () => {
    fc.assert(
      fc.property(arbProyek, (proyek) => {
        const { container } = renderProyekCard(proyek)

        // Query dilakukan via DOM selector di container lokal —
        // menghindari ambiguitas karena nama bisa sama dengan kategori,
        // dan ThumbnailImage placeholder juga menampilkan teks nama.

        // (a) nama proyek harus tampil di elemen <p> pertama di body card
        //     (ProyekCard merender nama sebagai <p> pertama di dalam div body)
        const namaEl = container.querySelector('article p:first-of-type')
        expect(namaEl).not.toBeNull()
        expect(namaEl.textContent).toBe(proyek.nama)

        // (b) kategori proyek harus tampil di elemen <p> kedua di body card
        const allP = container.querySelectorAll('article p')
        expect(allP.length).toBeGreaterThanOrEqual(2)
        expect(allP[1].textContent).toBe(proyek.kategori)

        // (c) StatusBadge harus hadir — diidentifikasi via aria-label
        const labelYangDiharapkan = `Status: ${expectedStatusLabel[proyek.status]}`
        const badge = container.querySelector(`[aria-label="${labelYangDiharapkan}"]`)
        expect(badge).not.toBeNull()

        // Bersihkan DOM antar run agar tidak ada sisa render sebelumnya
        cleanup()
      }),
      { numRuns: 100 }
    )
  })
})
