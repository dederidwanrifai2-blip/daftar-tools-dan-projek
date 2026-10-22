/**
 * SearchInput.jsx
 * Input pencarian proyek dengan label aksesibel.
 *
 * Props:
 *   value     {string}               — nilai query saat ini
 *   onChange  {(q: string) => void}  — callback saat nilai berubah
 *
 * Requirements: 4.3, 7.4
 */

const INPUT_ID = 'search-proyek';

export default function SearchInput({ value = '', onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {/* Label visibel — memenuhi aksesibilitas tanpa mengandalkan placeholder saja */}
      <label
        htmlFor={INPUT_ID}
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          fontWeight: '500',
        }}
      >
        Cari Proyek
      </label>

      <input
        id={INPUT_ID}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari proyek..."
        maxLength={100}
        aria-label="Cari proyek berdasarkan nama atau deskripsi"
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          width: '100%',
          maxWidth: '360px',
          outline: 'none',
          transition: 'border-color 150ms ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      />
    </div>
  );
}
