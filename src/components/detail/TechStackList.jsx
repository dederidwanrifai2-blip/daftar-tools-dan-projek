/**
 * TechStackList — Req 5.1, 5.4
 * Menampilkan daftar tech sebagai tag/chip.
 * Background berbeda dari halaman (--bg-secondary), font lebih kecil dari paragraf.
 * Gap horizontal ≥ 4px antar chip.
 */

const styles = {
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',           /* gap horizontal & vertikal ≥ 4px — Req 5.4 */
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  chip: {
    backgroundColor: 'var(--bg-secondary)',   /* berbeda dari --bg-primary halaman — Req 5.4 */
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '0.8125rem',   /* ~13px, lebih kecil dari 1rem paragraf — Req 5.4 */
    lineHeight: '1.5',
    whiteSpace: 'nowrap',
  },
}

/**
 * @param {{ items: string[] }} props
 */
export default function TechStackList({ items }) {
  if (!items || items.length === 0) return null

  return (
    <ul style={styles.list} aria-label="Tech stack">
      {items.map((tech) => (
        <li key={tech} style={styles.chip}>
          {tech}
        </li>
      ))}
    </ul>
  )
}
