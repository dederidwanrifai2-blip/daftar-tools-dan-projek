import { isCodeLine } from '../../utils/detectCodeLine'

/**
 * InfoTambahan — menampilkan field `info_tambahan` dari data proyek.
 *
 * Setiap value di-iterasi:
 * - Jika value adalah string dan cocok `isCodeLine` → tampilkan sebagai <code> block
 * - Jika value adalah string biasa → tampilkan sebagai teks paragraf
 * - Jika value adalah array → tampilkan sebagai <ul> di mana setiap elemen
 *   juga diperiksa `isCodeLine`
 *
 * @param {{ data: Record<string, string | string[]> }} props
 */
function InfoTambahan({ data }) {
  // Jangan render apapun jika data kosong atau tidak ada
  if (!data || Object.keys(data).length === 0) return null

  return (
    <section className="info-tambahan" aria-label="Informasi tambahan">
      <h2 className="info-tambahan__judul">Informasi Tambahan</h2>

      <dl className="info-tambahan__list">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="info-tambahan__item">
            {/* Kunci (key) */}
            <dt className="info-tambahan__key">{key.replace(/_/g, ' ')}</dt>

            {/* Nilai (value) */}
            <dd className="info-tambahan__value">
              {Array.isArray(value) ? (
                // Value berupa array → tampilkan sebagai list
                <ul className="info-tambahan__array">
                  {value.map((item, index) => (
                    <li key={index}>
                      {isCodeLine(item) ? (
                        <code className="info-tambahan__code">{item}</code>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              ) : isCodeLine(value) ? (
                // Value string yang cocok pola command-line → code block
                <code className="info-tambahan__code">{value}</code>
              ) : (
                // Value string biasa → teks
                <span>{value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <style>{`
        .info-tambahan {
          margin-block: 1.5rem;
        }

        .info-tambahan__judul {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
        }

        .info-tambahan__list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-tambahan__item {
          display: grid;
          grid-template-columns: minmax(8rem, auto) 1fr;
          gap: 0.5rem 1rem;
          align-items: start;
        }

        .info-tambahan__key {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: capitalize;
          padding-top: 0.125rem;
        }

        .info-tambahan__value {
          color: var(--text-primary);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        /* Code block — font monospace + background berbeda (Req 5.5) */
        .info-tambahan__code {
          display: inline-block;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
          font-size: 0.875rem;
          background-color: var(--code-bg);
          color: var(--text-primary);
          padding: 0.2em 0.5em;
          border-radius: 4px;
          border: 1px solid var(--border);
          word-break: break-all;
        }

        /* Array list */
        .info-tambahan__array {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          list-style: disc;
          padding-left: 1.25rem;
        }

        .info-tambahan__array li {
          list-style: disc;
        }

        /* Responsif: pada layar kecil, key dan value ditumpuk */
        @media (max-width: 480px) {
          .info-tambahan__item {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }
        }
      `}</style>
    </section>
  )
}

export default InfoTambahan
