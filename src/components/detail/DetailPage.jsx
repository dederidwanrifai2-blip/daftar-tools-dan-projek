import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import TechStackList from './TechStackList'
import CaraPenggunaan from './CaraPenggunaan'
import InfoTambahan from './InfoTambahan'
import GaleriSection from './GaleriSection'
import VideoSection from './VideoSection'
import SourceCodeSection from './SourceCodeSection'
import Lightbox from '../shared/Lightbox'
import ErrorMessage from '../shared/ErrorMessage'
import RepoExplorer from '../shared/RepoExplorer'

/**
 * DetailPage — Req 5.1, 5.2, 5.6, 5.7, 6.2
 *
 * Menampilkan informasi lengkap satu proyek.
 * - Baca `id` dari hash URL via useParams; cari proyek di DataContext
 * - Render 404 inline jika proyek tidak ditemukan
 * - Set document.title ke "[nama proyek] — DevPaii Projek"
 * - Sembunyikan seksi yang fieldnya null/kosong (tanpa placeholder)
 * - Kelola state lightbox: { isOpen, items, currentIndex }
 */
export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, loading, error } = useData()

  /* State lightbox lokal — Req 8.2, 8.3, 8.4, 8.5 */
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    items: [],
    currentIndex: 0,
  })

  /* Cari proyek berdasarkan id */
  const proyek = projects.find((p) => p.id === id)

  /* Set document.title — Req 5.7 */
  useEffect(() => {
    if (proyek) {
      document.title = `${proyek.nama} — DevPaii Projek`
    } else if (!loading) {
      document.title = 'Proyek Tidak Ditemukan — DevPaii Projek'
    }
    /* Reset title saat unmount */
    return () => {
      document.title = 'DevPaii Projek'
    }
  }, [proyek, loading])

  /* Req 6.4: Perbarui hash URL ke #/ saat proyek tidak ditemukan */
  useEffect(() => {
    if (!loading && !error && !proyek) {
      navigate('/', { replace: true })
    }
  }, [loading, error, proyek, navigate])

  /* ── Lightbox helpers ── */

  /**
   * Buka lightbox dengan array item dan index awal
   * @param {{ type: 'foto'|'video', thumbnail_url: string, src_url: string }[]} items
   * @param {number} index
   */
  const openLightbox = (items, index) =>
    setLightbox({ isOpen: true, items, currentIndex: index })

  const closeLightbox = () =>
    setLightbox((prev) => ({ ...prev, isOpen: false }))

  /* Wrap-around cyclic — Req 8.3 */
  const goPrev = () =>
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.items.length) % prev.items.length,
    }))

  const goNext = () =>
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.items.length,
    }))

  /* Handler untuk GaleriSection: foto sebagai LightboxItem */
  const handleOpenGaleri = (index) => {
    if (!proyek?.galeri) return
    const items = proyek.galeri.map((item) => {
      const url = typeof item === 'string' ? item : item.url
      return { type: 'foto', thumbnail_url: url, src_url: url }
    })
    openLightbox(items, index)
  }

  /* Handler untuk VideoSection: video sebagai LightboxItem */
  const handleOpenVideo = (index) => {
    if (!proyek?.video) return
    const items = proyek.video.map((v) => ({
      type: 'video',
      thumbnail_url: v.thumbnail_url,
      src_url: v.src_url,
    }))
    openLightbox(items, index)
  }

  /* ── Render states ── */

  if (loading) {
    return (
      <div style={styles.statusWrapper} aria-live="polite">
        Memuat data proyek...
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.statusWrapper}>
        <ErrorMessage pesan={error} />
      </div>
    )
  }

  /* Proyek tidak ditemukan — 404 inline — Req 6.4 */
  if (!proyek) {
    return (
      <div style={styles.notFound} role="main" aria-label="Proyek tidak ditemukan">
        <h1 style={styles.notFoundTitle}>Proyek Tidak Ditemukan</h1>
        <p style={styles.notFoundDesc}>
          Tidak ada proyek dengan id <code style={styles.inlineCode}>{id}</code> di katalog ini.
        </p>
        <a href="#/" style={styles.backLink} aria-label="Kembali ke katalog">
          ← Kembali ke Katalog
        </a>
      </div>
    )
  }

  /* ── Render normal ── */

  /* Periksa apakah field opsional punya konten — Req 5.2 */
  const punyaMasalahDiatasi = proyek.masalah_diatasi && proyek.masalah_diatasi.trim() !== ''
  const punyaCaraKerja = proyek.cara_kerja && proyek.cara_kerja.trim() !== ''
  const punyaTechStack = proyek.tech_stack && proyek.tech_stack.length > 0
  const punyaCaraPenggunaan = proyek.cara_penggunaan && proyek.cara_penggunaan.length > 0
  const punyaInfoTambahan =
    proyek.info_tambahan && Object.keys(proyek.info_tambahan).length > 0

  return (
    <article style={styles.page} aria-label={`Detail proyek ${proyek.nama}`}>

      {/* Tombol navigasi kembali — Req 5.6 */}
      <nav style={styles.nav} aria-label="Navigasi halaman">
        <a href="#/" style={styles.backLink} aria-label="Kembali ke katalog">
          ← Kembali ke Katalog
        </a>
      </nav>

      {/* Nama proyek */}
      <header style={styles.header}>
        <h1 style={styles.nama}>{proyek.nama}</h1>
        <span style={styles.kategori}>{proyek.kategori}</span>
      </header>

      {/* Deskripsi */}
      <section style={styles.section} aria-label="Deskripsi proyek">
        <p style={styles.deskripsi}>{proyek.deskripsi}</p>
      </section>

      {/* Masalah yang Diatasi — sembunyikan jika null/kosong — Req 5.2 */}
      {punyaMasalahDiatasi && (
        <section style={styles.section} aria-label="Masalah yang diatasi">
          <h2 style={styles.sectionHeading}>Masalah yang Diatasi</h2>
          <p style={styles.bodyText}>{proyek.masalah_diatasi}</p>
        </section>
      )}

      {/* Cara Kerja — sembunyikan jika null/kosong — Req 5.2 */}
      {punyaCaraKerja && (
        <section style={styles.section} aria-label="Cara kerja">
          <h2 style={styles.sectionHeading}>Cara Kerja</h2>
          <p style={styles.bodyText}>{proyek.cara_kerja}</p>
        </section>
      )}

      {/* Tech Stack — sembunyikan jika kosong — Req 5.2, 5.4 */}
      {punyaTechStack && (
        <section style={styles.section} aria-label="Tech stack">
          <h2 style={styles.sectionHeading}>Tech Stack</h2>
          <TechStackList items={proyek.tech_stack} />
        </section>
      )}

      {/* Cara Penggunaan — sembunyikan jika kosong — Req 5.2, 5.3 */}
      {punyaCaraPenggunaan && (
        <section style={styles.section} aria-label="Cara penggunaan">
          <h2 style={styles.sectionHeading}>Cara Penggunaan</h2>
          <CaraPenggunaan langkah={proyek.cara_penggunaan} />
        </section>
      )}

      {/* Galeri Foto — GaleriSection menangani null/kosong secara internal — Req 5.2, 8.1, 8.8 */}
      <GaleriSection foto={proyek.galeri} onOpen={handleOpenGaleri} />

      {/* Video — VideoSection menangani null/kosong secara internal — Req 5.2, 8.6, 8.8 */}
      <VideoSection video={proyek.video} onOpen={handleOpenVideo} />

      {/* Informasi Tambahan — InfoTambahan menangani data kosong secara internal — Req 5.5 */}
      {punyaInfoTambahan && (
        <InfoTambahan data={proyek.info_tambahan} />
      )}

      {/* Source Code — SourceCodeSection menangani null/kosong secara internal — Req 9.1, 9.6 */}
      <SourceCodeSection kode={proyek.kode} />

      {/* Repository Explorer — tampil jika proyek punya repoId */}
      {proyek.repoId && (
        <section style={styles.section} aria-label="Source Code Repository">
          <h2 style={styles.sectionHeading}>Jelajahi Source Code</h2>
          <RepoExplorer repoId={proyek.repoId} />
        </section>
      )}

      {/* Lightbox — hanya dirender saat isOpen true — Req 8.2, 8.3, 8.4, 8.5 */}
      {lightbox.isOpen && (
        <Lightbox
          items={lightbox.items}
          currentIndex={lightbox.currentIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </article>
  )
}

/* ── Styles ── */
const styles = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    color: 'var(--text-primary)',
  },
  nav: {
    marginBottom: '1.5rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: 'var(--accent)',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  header: {
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem',
  },
  nama: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '0 0 0.5rem',
    lineHeight: 1.25,
  },
  kategori: {
    display: 'inline-block',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  section: {
    marginBottom: '1.75rem',
  },
  sectionHeading: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '0.625rem',
    marginTop: 0,
  },
  deskripsi: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: 'var(--text-primary)',
    margin: 0,
  },
  bodyText: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: 'var(--text-primary)',
    margin: 0,
  },
  inlineCode: {
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '0.875em',
    background: 'var(--code-bg)',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    padding: '0.1em 0.4em',
  },

  /* Loading dan error wrapper */
  statusWrapper: {
    maxWidth: '800px',
    margin: '3rem auto',
    padding: '0 1.5rem',
    color: 'var(--text-primary)',
  },

  /* 404 inline */
  notFound: {
    maxWidth: '800px',
    margin: '4rem auto',
    padding: '0 1.5rem',
    textAlign: 'center',
  },
  notFoundTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  notFoundDesc: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
}
