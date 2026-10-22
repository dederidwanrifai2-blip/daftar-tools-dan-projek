import CodeSnippet from '../shared/CodeSnippet'

/**
 * SourceCodeSection — Req 5.1, 5.2, 9.1, 9.6
 *
 * Menampilkan semua Code_Snippet dari field `kode`.
 * - Setiap snippet dirender sebagai blok CodeSnippet tersendiri (Req 9.1)
 * - Sembunyikan seluruh seksi jika `kode` null atau array kosong (Req 9.6, 5.2)
 *
 * @typedef {{ nama_file: string, bahasa: string, isi: string }} CodeSnippetData
 * @param {{ kode: CodeSnippetData[] }} props
 */
export default function SourceCodeSection({ kode }) {
  /* Sembunyikan seksi jika tidak ada kode — Req 5.2, 9.6 */
  if (!kode || kode.length === 0) return null

  return (
    <section style={styles.section} aria-label="Source code">
      <h2 style={styles.heading}>Source Code</h2>
      {kode.map((snippet, index) => (
        <CodeSnippet
          key={index}
          namaFile={snippet.nama_file}
          bahasa={snippet.bahasa}
          isi={snippet.isi}
        />
      ))}
    </section>
  )
}

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
}
