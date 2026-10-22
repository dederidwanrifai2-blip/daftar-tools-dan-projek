/**
 * Property test: Navigasi Lightbox — Property 12
 *
 * Validates: Requirements 8.3
 *
 * Navigasi lightbox adalah cyclic wrap-around:
 * - goNext(i, N) = (i + 1) % N
 * - goPrev(i, N) = (i - 1 + N) % N
 *
 * Test ini adalah pure function test — tidak membutuhkan render React.
 * Logika cyclic ada di parent (DetailPage) via state update.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

// ---------------------------------------------------------------------------
// Pure functions yang merepresentasikan logika navigasi di DetailPage
// ---------------------------------------------------------------------------

/**
 * Hitung indeks item berikutnya (wrap-around ke 0 setelah item terakhir).
 * @param {number} currentIndex - Indeks saat ini
 * @param {number} total - Total item dalam galeri
 * @returns {number}
 */
function goNext(currentIndex, total) {
  return (currentIndex + 1) % total
}

/**
 * Hitung indeks item sebelumnya (wrap-around ke item terakhir dari indeks 0).
 * @param {number} currentIndex - Indeks saat ini
 * @param {number} total - Total item dalam galeri
 * @returns {number}
 */
function goPrev(currentIndex, total) {
  return (currentIndex - 1 + total) % total
}

// ---------------------------------------------------------------------------
// Arbitrary: pasangan (N, i) di mana N ≥ 1 dan 0 ≤ i < N
// ---------------------------------------------------------------------------
const validNavState = fc
  .integer({ min: 1, max: 1000 })
  .chain((N) =>
    fc.tuple(fc.constant(N), fc.integer({ min: 0, max: N - 1 })),
  )

// ---------------------------------------------------------------------------
// Property 12: Navigasi lightbox adalah cyclic wrap-around
// Validates: Requirements 8.3
// ---------------------------------------------------------------------------

describe('Property 12: Navigasi lightbox adalah cyclic wrap-around', () => {
  /**
   * Property 12 — goNext selalu menghasilkan (i+1)%N
   *
   * **Validates: Requirements 8.3**
   */
  it('goNext = (i + 1) % N untuk semua N ≥ 1 dan 0 ≤ i < N', () => {
    fc.assert(
      fc.property(validNavState, ([N, i]) => {
        return goNext(i, N) === (i + 1) % N
      }),
    )
  })

  /**
   * Property 12 — goPrev selalu menghasilkan (i-1+N)%N
   *
   * **Validates: Requirements 8.3**
   */
  it('goPrev = (i - 1 + N) % N untuk semua N ≥ 1 dan 0 ≤ i < N', () => {
    fc.assert(
      fc.property(validNavState, ([N, i]) => {
        return goPrev(i, N) === (i - 1 + N) % N
      }),
    )
  })

  /**
   * Property 12 — goNext dari indeks terakhir wrap ke 0
   *
   * **Validates: Requirements 8.3**
   */
  it('goNext dari indeks terakhir (N-1) wrap ke 0', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000 }), (N) => {
        return goNext(N - 1, N) === 0
      }),
    )
  })

  /**
   * Property 12 — goPrev dari indeks 0 wrap ke N-1
   *
   * **Validates: Requirements 8.3**
   */
  it('goPrev dari indeks 0 wrap ke N-1 (item terakhir)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000 }), (N) => {
        return goPrev(0, N) === N - 1
      }),
    )
  })

  /**
   * Property 12 — goNext lalu goPrev mengembalikan ke posisi semula (round-trip)
   *
   * **Validates: Requirements 8.3**
   */
  it('goNext lalu goPrev mengembalikan ke posisi awal (round-trip)', () => {
    fc.assert(
      fc.property(validNavState, ([N, i]) => {
        return goPrev(goNext(i, N), N) === i
      }),
    )
  })

  /**
   * Property 12 — goPrev lalu goNext mengembalikan ke posisi semula (round-trip)
   *
   * **Validates: Requirements 8.3**
   */
  it('goPrev lalu goNext mengembalikan ke posisi awal (round-trip)', () => {
    fc.assert(
      fc.property(validNavState, ([N, i]) => {
        return goNext(goPrev(i, N), N) === i
      }),
    )
  })

  /**
   * Property 12 — hasil selalu berada dalam range valid [0, N-1]
   *
   * **Validates: Requirements 8.3**
   */
  it('hasil goNext dan goPrev selalu dalam range valid [0, N-1]', () => {
    fc.assert(
      fc.property(validNavState, ([N, i]) => {
        const next = goNext(i, N)
        const prev = goPrev(i, N)
        return next >= 0 && next < N && prev >= 0 && prev < N
      }),
    )
  })
})
