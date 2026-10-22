/* Footer.jsx — Req 7.5: elemen <footer> semantik */

const Footer = () => {
  const tahun = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <p style={styles.teks}>
        &copy; {tahun} DevPaii Projek. Semua hak dilindungi.
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
    padding: '1rem 1.5rem',
    textAlign: 'center',
  },
  teks: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
};

export default Footer;
