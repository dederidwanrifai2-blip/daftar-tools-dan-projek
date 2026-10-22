/**
 * Property tests untuk ThemeContext — Property 14
 *
 * Property 14: Preferensi tema tersimpan dan dapat dipulihkan
 * Validates: Requirements 10.4
 *
 * Dua properti yang diuji:
 *   14a. Setelah toggle, nilai di localStorage sama dengan tema baru
 *   14b. Saat ThemeContext diinisialisasi dengan nilai localStorage yang ada,
 *        tema awal sesuai dengan nilai localStorage tersebut
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import * as fc from 'fast-check'
import { ThemeProvider, useTheme } from './ThemeContext'

// ─── localStorage mock ────────────────────────────────────────────────────────

/**
 * Buat mock localStorage sederhana berbasis objek biasa agar setiap test
 * dimulai dengan state bersih dan tidak bergantung pada implementasi jsdom.
 */
function buatLocalStorageMock() {
  let store = {}
  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    get _store() { return store },
  }
}

// ─── Setup / teardown ─────────────────────────────────────────────────────────

let localStorageMock

beforeEach(() => {
  localStorageMock = buatLocalStorageMock()
  // Ganti window.localStorage dengan mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  })
  // Stub setAttribute agar tidak benar-benar mengubah DOM
  vi.spyOn(document.documentElement, 'setAttribute').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorageMock.clear()
})

// ─── Helper wrapper ───────────────────────────────────────────────────────────

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>

// ─── Property 14a ─────────────────────────────────────────────────────────────

describe('ThemeContext — Property 14', () => {
  /**
   * 14a: Setelah toggle dipanggil sejumlah kali acak (0–20), nilai di
   *      localStorage['devpaii-tema'] selalu sama dengan tema yang sedang aktif.
   *
   * Algoritma:
   *   - Mulai dari tema default ('dark', tanpa localStorage seed)
   *   - Lakukan sejumlah toggle acak
   *   - Setelah setiap toggle, localStorage harus mencerminkan tema saat ini
   */
  it(
    '14a: setelah toggle, nilai di localStorage sama dengan tema aktif',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // jumlah toggle: 0 sampai 20
          fc.integer({ min: 0, max: 20 }),
          async (jumlahToggle) => {
            // Reset mock untuk setiap run
            localStorageMock.clear()
            localStorageMock.getItem.mockClear()
            localStorageMock.setItem.mockClear()

            const { result, unmount } = renderHook(() => useTheme(), { wrapper })

            // Tema awal tanpa seed = 'dark'
            let expectedTema = 'dark'
            expect(result.current.tema).toBe(expectedTema)

            for (let i = 0; i < jumlahToggle; i++) {
              act(() => {
                result.current.toggle()
              })
              expectedTema = expectedTema === 'dark' ? 'light' : 'dark'

              // localStorage harus disimpan dengan tema yang baru
              expect(result.current.tema).toBe(expectedTema)
              expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
                'devpaii-tema',
                expectedTema,
              )
              expect(localStorageMock._store['devpaii-tema']).toBe(expectedTema)
            }

            unmount()
          },
        ),
        { numRuns: 100 },
      )
    },
    15_000, // timeout 15 detik
  )

  /**
   * 14b: Saat ThemeContext diinisialisasi dengan localStorage yang sudah berisi
   *      nilai tema, tema awal harus sesuai dengan nilai localStorage tersebut.
   *
   * Algoritma:
   *   - Seed localStorage dengan salah satu dari dua nilai yang valid ('dark'/'light')
   *   - Render ThemeProvider baru
   *   - Tema awal yang dikembalikan useTheme() harus sama dengan seed
   */
  it(
    '14b: saat inisialisasi, tema awal sesuai dengan nilai localStorage',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // pilih seed acak antara dua tema yang valid
          fc.constantFrom('dark', 'light'),
          async (seedTema) => {
            // Tanam nilai di localStorage SEBELUM render
            localStorageMock.clear()
            localStorageMock.getItem.mockImplementation((key) =>
              key === 'devpaii-tema' ? seedTema : null,
            )
            localStorageMock._store['devpaii-tema'] = seedTema

            const { result, unmount } = renderHook(() => useTheme(), { wrapper })

            // Tema awal harus mencerminkan seed dari localStorage
            expect(result.current.tema).toBe(seedTema)

            unmount()
          },
        ),
        { numRuns: 100 },
      )
    },
    15_000,
  )
})
