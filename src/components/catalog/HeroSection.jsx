/* HeroSection.jsx
   Bagian pertama yang terlihat saat halaman dibuka.
   Req 3.1: teks "DevPaii Projek" ≥ 48px + satu tagline di bawahnya
   Req 3.2: min-height: 100vh agar konten proyek tidak terlihat sebelum scroll
   Req 7.5: elemen semantik <header>
*/

const TEKS = 'DevPaii Projek'

const HeroSection = () => {
  return (
    <header
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <style>{`
        @keyframes typewriter {
          from { width: 0 }
          to   { width: ${TEKS.length}ch }
        }

        @keyframes blink-cursor {
          0%, 100% { border-right-color: var(--accent) }
          50%       { border-right-color: transparent }
        }

        .hero-title {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid var(--accent);
          width: 0;
          animation:
            typewriter    1.8s steps(${TEKS.length}, end)  0.3s forwards,
            blink-cursor  0.75s step-end                   0.3s 6;
        }
      `}</style>

      <h1
        style={{
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: '700',
          color: 'var(--text-primary)',
          lineHeight: '1.15',
          marginBottom: '1rem',
        }}
      >
        <span className="hero-title">{TEKS}</span>
      </h1>

      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          lineHeight: '1.6',
        }}
      >
        Katalog seluruh proyek — dari otomasi n8n, perintah terminal, hingga
        sistem produksi siap pakai.
      </p>
    </header>
  )
}

export default HeroSection
