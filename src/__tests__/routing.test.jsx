/**
 * Routing Tests — Property 11
 *
 * Property 11: Navigasi URL hash konsisten dengan id proyek
 * **Validates: Requirements 6.1**
 *
 * Test 1 — Simulasi klik ProyekCard; assert URL berubah ke /projek/[id]
 * Test 2 — URL hash tidak dikenal → redirect ke /  (NotFoundPage redirect ke '/')
 * Test 3 — URL hash proyek valid → render DetailPage yang sesuai
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { DataContext } from '../context/DataContext'
import ProyekCard from '../components/catalog/ProyekCard'
import DetailPage from '../components/detail/DetailPage'
import NotFoundPage from '../components/shared/NotFoundPage'

// ---------------------------------------------------------------------------
// Mock: window.Prism — dipakai oleh CodeSnippet yang di-render oleh DetailPage
// ---------------------------------------------------------------------------
beforeEach(() => {
  window.Prism = {
    highlightElement: vi.fn(),
  }
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Data proyek contoh untuk test
// ---------------------------------------------------------------------------

const proyekA = {
  id: 'proyek-alpha',
  nama: 'Proyek Alpha',
  kategori: 'Otomasi',
  deskripsi: 'Deskripsi proyek alpha untuk test.',
  tech_stack: ['n8n'],
  cara_penggunaan: ['Langkah 1'],
  status: 'selesai',
  path: null,
  thumbnail_url: null,
  masalah_diatasi: null,
  cara_kerja: null,
  galeri: [],
  video: [],
  kode: [],
  info_tambahan: null,
}

const proyekB = {
  id: 'proyek-beta',
  nama: 'Proyek Beta',
  kategori: 'Produksi',
  deskripsi: 'Deskripsi proyek beta untuk test.',
  tech_stack: ['React'],
  cara_penggunaan: ['Langkah 1'],
  status: 'dalam pengerjaan',
  path: null,
  thumbnail_url: null,
  masalah_diatasi: null,
  cara_kerja: null,
  galeri: [],
  video: [],
  kode: [],
  info_tambahan: null,
}

const daftarProyek = [proyekA, proyekB]

// ---------------------------------------------------------------------------
// Helper: buat DataContext value (sudah selesai loading)
// ---------------------------------------------------------------------------

function buatContextValue(projects = daftarProyek) {
  return {
    projects,
    loading: false,
    error: null,
  }
}

// ---------------------------------------------------------------------------
// Helper: komponen kecil untuk membaca location.pathname di dalam Router
// ---------------------------------------------------------------------------

let capturedPathname = ''

function LocationCapture() {
  const location = useLocation()
  capturedPathname = location.pathname
  return null
}

// ---------------------------------------------------------------------------
// Test Suite 1: Klik ProyekCard → URL berubah ke /projek/[id]
// ---------------------------------------------------------------------------

describe('Routing — Test 1: klik ProyekCard mengubah URL ke /projek/[id]', () => {
  /**
   * Simulasi klik ProyekCard untuk proyekA.
   * Assert pathname berubah dari '/' ke '/projek/proyek-alpha'.
   * **Validates: Requirements 6.1**
   */
  it('klik ProyekCard proyekA mengubah pathname ke /projek/proyek-alpha', async () => {
    const user = userEvent.setup()
    capturedPathname = ''

    render(
      <DataContext.Provider value={buatContextValue()}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ProyekCard proyek={proyekA} />
                  <LocationCapture />
                </>
              }
            />
            <Route path="/projek/:id" element={<LocationCapture />} />
          </Routes>
        </MemoryRouter>
      </DataContext.Provider>
    )

    // Sebelum klik: masih di root
    expect(capturedPathname).toBe('/')

    // Klik kartu proyek
    const card = screen.getByRole('button', { name: /lihat detail proyek proyek alpha/i })
    await user.click(card)

    // Setelah klik: pathname harus berubah ke /projek/proyek-alpha
    expect(capturedPathname).toBe('/projek/proyek-alpha')
  })

  /**
   * Simulasi klik ProyekCard untuk proyekB.
   * Assert pathname berubah ke '/projek/proyek-beta'.
   * **Validates: Requirements 6.1**
   */
  it('klik ProyekCard proyekB mengubah pathname ke /projek/proyek-beta', async () => {
    const user = userEvent.setup()
    capturedPathname = ''

    render(
      <DataContext.Provider value={buatContextValue()}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ProyekCard proyek={proyekB} />
                  <LocationCapture />
                </>
              }
            />
            <Route path="/projek/:id" element={<LocationCapture />} />
          </Routes>
        </MemoryRouter>
      </DataContext.Provider>
    )

    const card = screen.getByRole('button', { name: /lihat detail proyek proyek beta/i })
    await user.click(card)

    expect(capturedPathname).toBe('/projek/proyek-beta')
  })

  /**
   * Verifikasi bahwa id di URL cocok dengan id proyek — bukan nama atau field lain.
   * **Validates: Requirements 6.1**
   */
  it('id di URL cocok dengan field id proyek, bukan nama', async () => {
    const user = userEvent.setup()

    // Proyek dengan id berbeda dari nama
    const proyekKhusus = {
      ...proyekA,
      id: 'id-unik-123',
      nama: 'Nama Proyek Berbeda',
    }

    capturedPathname = ''

    render(
      <DataContext.Provider value={buatContextValue([proyekKhusus])}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ProyekCard proyek={proyekKhusus} />
                  <LocationCapture />
                </>
              }
            />
            <Route path="/projek/:id" element={<LocationCapture />} />
          </Routes>
        </MemoryRouter>
      </DataContext.Provider>
    )

    const card = screen.getByRole('button', { name: /lihat detail proyek nama proyek berbeda/i })
    await user.click(card)

    // URL harus pakai id, bukan nama
    expect(capturedPathname).toBe('/projek/id-unik-123')
    expect(capturedPathname).not.toContain('nama-proyek-berbeda')
  })
})

// ---------------------------------------------------------------------------
// Test Suite 2: URL hash tidak dikenal → NotFoundPage redirect ke '/'
// ---------------------------------------------------------------------------

describe('Routing — Test 2: URL tidak dikenal → NotFoundPage redirect ke /', () => {
  /**
   * Saat navigasi ke route yang tidak cocok (*), NotFoundPage dirender.
   * NotFoundPage memanggil navigate('/', { replace: true }) di useEffect.
   * Assert: setelah render, pathname berubah ke '/'.
   * **Validates: Requirements 6.4**
   */
  it('route tidak dikenal → NotFoundPage redirect pathname ke /', async () => {
    capturedPathname = ''

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/halaman-tidak-ada']}>
          <Routes>
            <Route path="/" element={<LocationCapture />} />
            <Route path="*" element={<><NotFoundPage /><LocationCapture /></>} />
          </Routes>
        </MemoryRouter>
      )
    })

    // NotFoundPage harusnya redirect ke '/'
    expect(capturedPathname).toBe('/')
  })

  /**
   * Saat navigasi ke /projek/id-tidak-ada, DataContext tidak menemukan proyek.
   * DetailPage memanggil navigate('/', { replace: true }) di useEffect.
   * Assert: pathname berubah ke '/'.
   * **Validates: Requirements 6.4**
   */
  it('id proyek tidak ditemukan di DataContext → DetailPage redirect ke /', async () => {
    capturedPathname = ''

    await act(async () => {
      render(
        <DataContext.Provider value={buatContextValue(daftarProyek)}>
          <MemoryRouter initialEntries={['/projek/id-tidak-ada-sama-sekali']}>
            <Routes>
              <Route path="/" element={<LocationCapture />} />
              <Route
                path="/projek/:id"
                element={<><DetailPage /><LocationCapture /></>}
              />
            </Routes>
          </MemoryRouter>
        </DataContext.Provider>
      )
    })

    // DetailPage harusnya redirect ke '/' saat proyek tidak ditemukan
    expect(capturedPathname).toBe('/')
  })
})

// ---------------------------------------------------------------------------
// Test Suite 3: URL proyek valid → render DetailPage yang sesuai
// ---------------------------------------------------------------------------

describe('Routing — Test 3: URL proyek valid → render DetailPage yang sesuai', () => {
  /**
   * Saat navigasi ke /projek/proyek-alpha, DetailPage merender nama proyek yang sesuai.
   * **Validates: Requirements 6.1, 6.3**
   */
  it('route /projek/proyek-alpha merender nama "Proyek Alpha"', async () => {
    await act(async () => {
      render(
        <DataContext.Provider value={buatContextValue(daftarProyek)}>
          <MemoryRouter initialEntries={['/projek/proyek-alpha']}>
            <Routes>
              <Route path="/" element={<div>Halaman Katalog</div>} />
              <Route path="/projek/:id" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </DataContext.Provider>
      )
    })

    // Nama proyek harus tampil sebagai heading h1
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Proyek Alpha')
  })

  /**
   * Saat navigasi ke /projek/proyek-beta, DetailPage merender nama proyek yang sesuai.
   * **Validates: Requirements 6.1, 6.3**
   */
  it('route /projek/proyek-beta merender nama "Proyek Beta"', async () => {
    await act(async () => {
      render(
        <DataContext.Provider value={buatContextValue(daftarProyek)}>
          <MemoryRouter initialEntries={['/projek/proyek-beta']}>
            <Routes>
              <Route path="/" element={<div>Halaman Katalog</div>} />
              <Route path="/projek/:id" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </DataContext.Provider>
      )
    })

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Proyek Beta')
  })

  /**
   * DetailPage untuk proyek valid menampilkan deskripsi yang sesuai.
   * **Validates: Requirements 6.1**
   */
  it('route valid merender deskripsi proyek yang tepat', async () => {
    await act(async () => {
      render(
        <DataContext.Provider value={buatContextValue(daftarProyek)}>
          <MemoryRouter initialEntries={['/projek/proyek-alpha']}>
            <Routes>
              <Route path="/" element={<div>Katalog</div>} />
              <Route path="/projek/:id" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </DataContext.Provider>
      )
    })

    // Deskripsi proyekA harus tampil di halaman
    expect(screen.getByText('Deskripsi proyek alpha untuk test.')).toBeTruthy()
  })

  /**
   * DetailPage untuk proyek valid menampilkan tombol kembali ke katalog.
   * **Validates: Requirements 5.6**
   */
  it('route valid merender tombol "Kembali ke Katalog"', async () => {
    await act(async () => {
      render(
        <DataContext.Provider value={buatContextValue(daftarProyek)}>
          <MemoryRouter initialEntries={['/projek/proyek-alpha']}>
            <Routes>
              <Route path="/" element={<div>Katalog</div>} />
              <Route path="/projek/:id" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </DataContext.Provider>
      )
    })

    const backLink = screen.getByRole('link', { name: /kembali ke katalog/i })
    expect(backLink).toBeTruthy()
  })

  /**
   * Setiap id proyek yang berbeda menghasilkan konten DetailPage yang berbeda.
   * Memverifikasi isolasi antar proyek — proyek A tidak menampilkan konten proyek B.
   * **Validates: Requirements 6.1**
   */
  it('route /projek/proyek-alpha tidak merender konten proyek beta', async () => {
    await act(async () => {
      render(
        <DataContext.Provider value={buatContextValue(daftarProyek)}>
          <MemoryRouter initialEntries={['/projek/proyek-alpha']}>
            <Routes>
              <Route path="/" element={<div>Katalog</div>} />
              <Route path="/projek/:id" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </DataContext.Provider>
      )
    })

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Proyek Alpha')
    expect(heading.textContent).not.toBe('Proyek Beta')

    // Deskripsi proyek beta tidak boleh tampil
    expect(screen.queryByText('Deskripsi proyek beta untuk test.')).toBeNull()
  })
})
