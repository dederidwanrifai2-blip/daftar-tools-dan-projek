// Halaman 404 — ditampilkan saat hash URL tidak cocok dengan route manapun
// Requirement 6.4: Tampilkan "Proyek tidak ditemukan" + update hash ke #/ + link ke katalog

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  // Req 6.4: Perbarui hash URL menjadi #/ saat halaman ini tampil
  useEffect(() => {
    navigate('/', { replace: true })
  }, [navigate])

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-primary)',
      }}
      role="main"
      aria-label="Proyek tidak ditemukan"
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
        Proyek tidak ditemukan
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
        Halaman yang kamu cari tidak tersedia atau tidak dikenali.
      </p>
      <a
        href="#/"
        style={{
          color: 'var(--accent)',
          textDecoration: 'underline',
          fontSize: '1rem',
          fontWeight: 500,
        }}
        aria-label="Kembali ke katalog proyek"
      >
        ← Kembali ke Katalog
      </a>
    </section>
  )
}

export default NotFoundPage
