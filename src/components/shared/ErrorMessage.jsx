/**
 * ErrorMessage — Req 1.7, 2.6, 2.7, 7.5
 * Menampilkan kotak error yang dapat dibaca user dengan role="alert"
 * agar screen reader langsung mengumumkan pesan saat komponen muncul.
 */

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid #b91c1c',     /* border merah yang konsisten di kedua tema */
    borderRadius: '6px',
    padding: '1rem 1.25rem',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  icon: {
    flexShrink: 0,
    fontSize: '1.25rem',
    lineHeight: 1,
    color: '#ef4444',
    userSelect: 'none',
    ariaHidden: 'true',
  },
  message: {
    flex: 1,
  },
}

/**
 * @param {{ pesan: string }} props
 */
export default function ErrorMessage({ pesan }) {
  if (!pesan) return null

  return (
    <div role="alert" style={styles.container}>
      {/* ikon peringatan — disembunyikan dari screen reader karena role="alert" sudah cukup */}
      <span aria-hidden="true" style={styles.icon}>⚠</span>
      <p style={styles.message}>{pesan}</p>
    </div>
  )
}
