/**
 * ProyekCard — kartu ringkasan untuk satu proyek di halaman Katalog.
 *
 * Menampilkan:
 *   - Thumbnail proyek (atau placeholder jika thumbnail_url null/kosong)
 *   - Nama proyek
 *   - Kategori proyek
 *   - StatusBadge berdasarkan nilai field `status`
 *
 * Klik pada kartu akan menavigasi ke `#/projek/[id]`.
 *
 * Req 3.6, 3.7, 3.8, 6.1
 */

import { useNavigate } from 'react-router-dom'
import StatusBadge from '../shared/StatusBadge'
import ThumbnailImage from '../shared/ThumbnailImage'

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease',
  textDecoration: 'none',
  color: 'inherit',
}

const thumbnailWrapperStyle = {
  width: '100%',
  aspectRatio: '16 / 9',
  flexShrink: 0,
}

const bodyStyle = {
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const namaStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  margin: 0,
  lineHeight: '1.4',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const kategoriStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  margin: 0,
}

/**
 * @param {{ proyek: import('../../types').Project }} props
 *   proyek — objek proyek lengkap; hanya id, nama, kategori, thumbnail_url, status yang dipakai
 */
export default function ProyekCard({ proyek }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/projek/${proyek.id}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/projek/${proyek.id}`)
    }
  }

  return (
    <article
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Lihat detail proyek ${proyek.nama}`}
    >
      {/* Thumbnail */}
      <ThumbnailImage
        src={proyek.thumbnail_url}
        alt={proyek.nama}
        style={thumbnailWrapperStyle}
      />

      {/* Body: nama, kategori, badge */}
      <div style={bodyStyle}>
        <p style={namaStyle}>{proyek.nama}</p>
        <p style={kategoriStyle}>{proyek.kategori}</p>
        <StatusBadge status={proyek.status} />
      </div>
    </article>
  )
}
