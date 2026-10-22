import { useEffect } from 'react'

/**
 * Lightbox — Req 8.2, 8.3, 8.4, 8.5, 8.7
 *
 * Modal overlay untuk menampilkan foto atau video secara penuh.
 * - Lock scroll saat terbuka (Req 8.4)
 * - Tutup dengan Escape atau klik backdrop (Req 8.5, 7.4)
 * - Navigasi prev/next yang cyclic wrap-around (Req 8.3)
 * - Video baru diload saat Lightbox dibuka (lazy loading — Req 8.7)
 *
 * @typedef {{ type: 'foto' | 'video', thumbnail_url: string, src_url: string }} LightboxItem
 * @param {{
 *   items: LightboxItem[],
 *   currentIndex: number,
 *   onClose: () => void,
 *   onPrev: () => void,
 *   onNext: () => void
 * }} props
 */
export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }) {
  /* Lock scroll pada body saat lightbox terbuka — Req 8.4 */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  /* Tutup dengan Escape — Req 8.5, 7.4 */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  if (!items || items.length === 0) return null

  const item = items[currentIndex]
  const hasMultiple = items.length > 1

  return (
    <div
      style={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Lightbox media"
      onClick={onClose}
    >
      <div
        style={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media */}
        <div style={styles.mediaWrapper}>
          {item.type === 'foto' ? (
            <img
              src={item.src_url}
              alt="Foto galeri ukuran penuh"
              style={styles.media}
            />
          ) : (
            /* Video baru diload saat Lightbox dibuka — Req 8.7 */
            <video
              src={item.src_url}
              controls
              autoPlay
              style={styles.media}
              aria-label="Video dokumentasi"
            />
          )}
        </div>

        {/* Counter */}
        {hasMultiple && (
          <div style={styles.counter} aria-live="polite">
            {currentIndex + 1} / {items.length}
          </div>
        )}

        {/* Tombol navigasi — hanya tampil jika lebih dari 1 item */}
        {hasMultiple && (
          <button
            style={{ ...styles.navButton, ...styles.navButtonPrev }}
            onClick={onPrev}
            aria-label="Media sebelumnya"
          >
            &#8249;
          </button>
        )}

        {hasMultiple && (
          <button
            style={{ ...styles.navButton, ...styles.navButtonNext }}
            onClick={onNext}
            aria-label="Media selanjutnya"
          >
            &#8250;
          </button>
        )}

        {/* Tombol tutup */}
        <button
          style={styles.closeButton}
          onClick={onClose}
          aria-label="Tutup lightbox"
        >
          &#215;
        </button>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0, 0, 0, 0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  content: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    maxWidth: '90vw',
    maxHeight: '85vh',
    objectFit: 'contain',
    borderRadius: '4px',
    display: 'block',
  },
  counter: {
    position: 'absolute',
    bottom: '-2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    fontSize: '2rem',
    lineHeight: 1,
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  navButtonPrev: {
    left: '-3.5rem',
  },
  navButtonNext: {
    right: '-3.5rem',
  },
  closeButton: {
    position: 'absolute',
    top: '-2.5rem',
    right: '-0.5rem',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '1.75rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
}
