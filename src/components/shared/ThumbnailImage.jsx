/**
 * ThumbnailImage — menampilkan gambar thumbnail sebuah proyek.
 *
 * Perilaku:
 *   - Jika `src` berisi URL yang valid (non-null, non-empty string),
 *     render elemen <img> dengan atribut alt bermakna.
 *   - Jika `src` bernilai null, undefined, atau string kosong,
 *     render div placeholder yang menampilkan teks `alt` sebagai gantinya.
 *
 * Req 3.6, 3.7, 7.2
 */

const placeholderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-secondary)',
  fontSize: '0.875rem',
  fontWeight: '500',
  textAlign: 'center',
  padding: '8px',
  borderRadius: 'inherit',  /* ikuti border-radius parent jika ada */
  overflow: 'hidden',
  wordBreak: 'break-word',
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  borderRadius: 'inherit',
};

/**
 * @param {{
 *   src:       string | null | undefined,
 *   alt:       string,
 *   className?: string,
 *   style?:    React.CSSProperties,
 * }} props
 *
 *   src       — URL gambar; null/undefined/string kosong memicu fallback
 *   alt       — teks alternatif bermakna (nama proyek, dsb.)
 *   className — class CSS tambahan pada elemen pembungkus
 *   style     — inline style tambahan pada elemen pembungkus
 */
export default function ThumbnailImage({ src, alt, className, style }) {
  const hasSrc = typeof src === 'string' && src.trim() !== '';

  const wrapperStyle = {
    overflow: 'hidden',
    ...style,
  };

  if (hasSrc) {
    return (
      <div className={className} style={wrapperStyle}>
        <img
          src={src}
          alt={alt}            /* alt bermakna — wajib, Req 7.2 */
          style={imgStyle}
          loading="lazy"       /* lazy load untuk performa */
        />
      </div>
    );
  }

  /* Fallback: placeholder dengan teks nama proyek */
  return (
    <div
      className={className}
      style={wrapperStyle}
      role="img"
      aria-label={alt}     /* aksesibilitas pada fallback div */
    >
      <div style={placeholderStyle}>
        {alt || 'Gambar tidak tersedia'}
      </div>
    </div>
  );
}
