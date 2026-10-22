/**
 * VideoSection — Req 5.2, 8.6, 8.7, 8.8
 *
 * Menampilkan daftar thumbnail video dengan ikon play overlay.
 * - Klik thumbnail memanggil onOpen(index) untuk membuka Lightbox (lazy load video)
 * - Video TIDAK dimuat sebelum diklik — hanya thumbnail yang dirender (Req 8.7)
 * - Sembunyikan seluruh seksi jika array kosong atau null (Req 8.8)
 * - Keyboard accessible: thumbnail bisa difokus dan diaktifkan Enter/Space (Req 7.4)
 *
 * @typedef {{ thumbnail_url: string, src_url: string }} VideoItem
 * @param {{ video: VideoItem[], onOpen: (index: number) => void }} props
 */

const styles = {
  section: {
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '8px',
  },
  thumbnailWrapper: {
    position: 'relative',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    background: 'var(--bg-secondary)',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  /* Overlay gelap agar ikon play kontras dengan thumbnail */
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.35)',
  },
  /* Ikon play — segitiga SVG inline, tidak butuh library eksternal */
  playIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.90)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
}

/* Komponen ikon play agar mudah diganti jika diperlukan */
function PlayIcon() {
  return (
    <div style={styles.playIcon} aria-hidden="true">
      {/* Segitiga play menggunakan SVG — 100% aksesibel dan scalable */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 2.5L13 8L4 13.5V2.5Z"
          fill="#1e293b"
        />
      </svg>
    </div>
  )
}

export default function VideoSection({ video, onOpen }) {
  /* Sembunyikan jika array kosong atau null — Req 5.2, 8.8 */
  if (!video || video.length === 0) return null

  const handleKeyDown = (e, index) => {
    /* Aktifkan dengan Enter atau Space — Req 7.4 */
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(index)
    }
  }

  return (
    <section style={styles.section} aria-label="Video dokumentasi">
      <h2 style={styles.heading}>Video</h2>
      <div style={styles.grid} role="list">
        {video.map((item, index) => (
          <div
            key={index}
            role="listitem"
            style={styles.thumbnailWrapper}
            onClick={() => onOpen(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            aria-label={`Putar video ${index + 1} dari ${video.length}`}
          >
            {/* Hanya render thumbnail gambar — video belum dimuat (Req 8.7) */}
            <img
              src={item.thumbnail_url}
              alt={`Thumbnail video ${index + 1}`}
              style={styles.img}
              loading="lazy"
            />
            {/* Overlay dengan ikon play — membedakan dari foto biasa (Req 8.6) */}
            <div style={styles.overlay}>
              <PlayIcon />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
