/**
 * GaleriSection — Req 5.2, 8.1, 8.2, 8.8
 *
 * Mendukung dua format field `galeri`:
 *   - Format lama: string[]  — array URL langsung
 *   - Format baru: { url: string, keterangan: string }[]  — dengan keterangan
 *
 * Klik thumbnail membuka Lightbox via onOpen(index).
 */

const styles = {
  section: { marginBottom: '2rem' },
  heading: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'var(--bg-card)',
  },
  thumbnailWrapper: {
    position: 'relative',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    background: 'var(--bg-secondary)',
    flexShrink: 0,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  keterangan: {
    padding: '8px 10px',
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.45',
  },
}

export default function GaleriSection({ foto, onOpen }) {
  if (!foto || foto.length === 0) return null

  /* Normalisasi: dukung string maupun objek { url, keterangan } */
  const items = foto.map((item) =>
    typeof item === 'string'
      ? { url: item, keterangan: null }
      : item
  )

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(index)
    }
  }

  return (
    <section style={styles.section} aria-label="Galeri foto">
      <h2 style={styles.heading}>Galeri</h2>
      <div style={styles.grid} role="list">
        {items.map((item, index) => (
          <div
            key={index}
            role="listitem"
            style={styles.card}
            onClick={() => onOpen(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            aria-label={item.keterangan || `Foto ${index + 1} dari ${items.length}`}
          >
            <div style={styles.thumbnailWrapper}>
              <img
                src={item.url}
                alt={item.keterangan || `Galeri foto ${index + 1}`}
                style={styles.img}
                loading="lazy"
              />
            </div>
            {item.keterangan && (
              <p style={styles.keterangan}>{item.keterangan}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}