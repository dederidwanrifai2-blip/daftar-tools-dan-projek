/**
 * StatusBadge — chip berwarna berdasarkan nilai status proyek.
 *
 * Status yang didukung:
 *   'selesai'          → latar --badge-selesai (hijau)
 *   'dalam pengerjaan' → latar --badge-proses  (kuning)
 *   'belum dimulai'    → latar --badge-belum   (biru)
 *
 * Req 3.6, 7.2
 */

const STATUS_CONFIG = {
  selesai: {
    label: 'Selesai',
    style: {
      backgroundColor: 'var(--badge-selesai)',
      color: 'var(--text-primary)',
    },
  },
  'dalam pengerjaan': {
    label: 'Dalam Pengerjaan',
    style: {
      backgroundColor: 'var(--badge-proses)',
      color: 'var(--text-primary)',
    },
  },
  'belum dimulai': {
    label: 'Belum Dimulai',
    style: {
      backgroundColor: 'var(--badge-belum)',
      color: 'var(--text-primary)',
    },
  },
};

const badgeBaseStyle = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '9999px',
  fontSize: '0.75rem',   /* 12px — lebih kecil dari teks paragraf */
  fontWeight: '600',
  lineHeight: '1.5',
  whiteSpace: 'nowrap',
  userSelect: 'none',
};

/**
 * @param {{ status: string }} props
 *   status — salah satu dari 'selesai' | 'dalam pengerjaan' | 'belum dimulai'
 */
export default function StatusBadge({ status }) {
  const normalised = typeof status === 'string' ? status.trim().toLowerCase() : '';
  const config = STATUS_CONFIG[normalised];

  if (!config) {
    /* Status tidak dikenal — tampilkan apa adanya tanpa warna khusus */
    return (
      <span
        style={{
          ...badgeBaseStyle,
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
        }}
        aria-label={`Status: ${status}`}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      style={{ ...badgeBaseStyle, ...config.style }}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
