/**
 * CaraPenggunaan — Req 5.1, 5.3
 * Menampilkan langkah-langkah cara penggunaan sebagai ordered list.
 */

const styles = {
  ol: {
    paddingLeft: '1.5rem',   /* indentasi untuk nomor bawaan <ol> */
    margin: 0,
  },
  li: {
    paddingLeft: '0.25rem',
    marginBottom: '0.5rem',
    lineHeight: '1.6',
  },
}

/**
 * @param {{ langkah: string[] }} props
 */
export default function CaraPenggunaan({ langkah }) {
  if (!langkah || langkah.length === 0) return null

  return (
    <ol style={styles.ol}>
      {langkah.map((step, index) => (
        <li key={index} style={styles.li}>
          {step}
        </li>
      ))}
    </ol>
  )
}
