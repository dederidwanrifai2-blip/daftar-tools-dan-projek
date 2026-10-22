import { useRef, useState, useEffect } from 'react'

/**
 * CodeSnippet — menampilkan blok kode dengan syntax highlighting via Prism.js (CDN),
 * nomor baris, label bahasa, dan tombol salin ke clipboard.
 *
 * Props:
 *   namaFile  {string}  — judul file yang ditampilkan di header
 *   bahasa    {string}  — bahasa Prism (js, python, json, bash, html, ...)
 *   isi       {string}  — isi kode yang akan ditampilkan
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 9.8
 */
function CodeSnippet({ namaFile, bahasa, isi }) {
  const codeRef = useRef(null)
  const [copied, setCopied] = useState(false)

  // Re-highlight setiap kali isi berubah (Req 9.2, 9.5, 9.8)
  useEffect(() => {
    if (window.Prism && codeRef.current) {
      window.Prism.highlightElement(codeRef.current)
    }
  }, [isi])

  // Salin ke clipboard; ubah teks tombol selama 2 detik (Req 9.3)
  const handleCopy = () => {
    navigator.clipboard.writeText(isi).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Clipboard API tidak tersedia — biarkan tombol tetap tampil
      console.warn('Clipboard API tidak tersedia')
    })
  }

  return (
    <div className="code-snippet" style={styles.wrapper}>
      {/* Header: namaFile (kiri) · bahasa (kanan) · tombol salin (kanan) — Req 9.1, 9.4 */}
      <div className="code-snippet__header" style={styles.header}>
        <span className="code-snippet__filename" style={styles.filename}>
          {namaFile}
        </span>
        <div style={styles.headerRight}>
          <span className="code-snippet__lang" style={styles.langBadge}>
            {bahasa}
          </span>
          <button
            className="code-snippet__copy"
            style={styles.copyBtn}
            onClick={handleCopy}
            aria-label={copied ? 'Kode sudah disalin' : 'Salin kode'}
          >
            {copied ? 'Tersalin!' : 'Salin'}
          </button>
        </div>
      </div>

      {/* Blok kode: class line-numbers agar Prism plugin aktif — Req 9.5, 9.7 */}
      <pre className="line-numbers" style={styles.pre}>
        <code
          ref={codeRef}
          className={`language-${bahasa}`}
          style={styles.code}
        >
          {isi}
        </code>
      </pre>
    </div>
  )
}

/* Inline styles menggunakan CSS variables dari global.css agar ikut tema */
const styles = {
  wrapper: {
    backgroundColor: 'var(--code-bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    gap: '0.75rem',
  },

  filename: {
    color: 'var(--text-primary)',
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '0.875rem',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
  },

  /* Label bahasa di pojok kanan atas (Req 9.4) */
  langBadge: {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    textTransform: 'lowercase',
  },

  copyBtn: {
    padding: '0.25rem 0.625rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'color 100ms ease, background-color 100ms ease',
    fontFamily: 'inherit',
    lineHeight: 1.4,
  },

  /* Font monospace ≥ 13px (Req 9.7); global.css code/pre sudah 0.875rem = 14px */
  pre: {
    margin: 0,
    borderRadius: 0,
  },

  code: {
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '0.875rem', /* 14px ≥ 13px — Req 9.7 */
  },
}

export default CodeSnippet
