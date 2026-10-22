/* Navbar.jsx
   Req 1.6  : label dalam bahasa Indonesia
   Req 7.4  : fokusable keyboard, operable Enter/Space
   Req 7.5  : elemen <nav> semantik
   Req 10.2 : Theme_Toggle terlihat di navbar
   Req 10.3 : toggle mengubah tema < 200ms
*/

import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const { tema, toggle } = useTheme()

  const labelToggle = tema === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'
  const ikonToggle  = tema === 'dark' ? '☀️' : '🌙'

  return (
    <nav style={styles.nav} aria-label="Navigasi utama">
      {/* Teks brand — link ke halaman katalog (#/) */}
      <a href="#/" style={styles.brand}>
        DevPaii Projek
      </a>

      {/* Theme_Toggle — Req 10.2, 10.3 */}
      <button
        type="button"
        onClick={toggle}
        aria-label={labelToggle}
        title={labelToggle}
        style={styles.toggleBtn}
      >
        <span aria-hidden="true" style={styles.ikon}>
          {ikonToggle}
        </span>
        <span style={styles.labelTeks}>
          {tema === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
        </span>
      </button>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textDecoration: 'none',
    letterSpacing: '0.01em',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '0.375rem',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    /* transisi warna ikut sistem < 200ms (sudah di body global.css) */
  },
  ikon: {
    fontSize: '1rem',
    lineHeight: 1,
  },
  labelTeks: {
    /* sembunyikan di layar sangat sempit — aria-label tetap tersedia */
    display: 'inline',
  },
}

export default Navbar
