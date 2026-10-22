/**
 * FilterBar.jsx
 * Tombol filter kategori — "Semua" + satu tombol per kategori unik.
 * Tombol aktif mendapat visual berbeda menggunakan CSS variables.
 *
 * Props:
 *   kategoris  {string[]}              — array kategori unik dari data proyek
 *   active     {string}                — kategori yang sedang aktif ('Semua' atau nama kategori)
 *   onSelect   {(k: string) => void}   — callback saat kategori dipilih
 *
 * Requirements: 4.1, 7.4
 */

const ALL_LABEL = 'Semua';

export default function FilterBar({ kategoris = [], active = ALL_LABEL, onSelect }) {
  const tombolList = [ALL_LABEL, ...kategoris];

  return (
    <nav
      aria-label="Filter kategori proyek"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px 0',
      }}
    >
      {tombolList.map((k) => {
        const isActive = k === active;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onSelect(k)}
            aria-pressed={isActive}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: isActive ? '600' : '400',
              border: isActive
                ? '2px solid var(--accent)'
                : '2px solid var(--border)',
              backgroundColor: isActive
                ? 'var(--accent)'
                : 'var(--bg-secondary)',
              color: isActive ? '#ffffff' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
            }}
            // Hover dikelola via onMouseEnter/onMouseLeave untuk menghindari CSS kelas tambahan
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--accent-hover)';
                e.currentTarget.style.color = 'var(--accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
          >
            {k}
          </button>
        );
      })}
    </nav>
  );
}
