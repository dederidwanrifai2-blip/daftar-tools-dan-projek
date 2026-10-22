import { useState, useEffect, useCallback } from 'react'
import CodeSnippet from './CodeSnippet'

/**
 * RepoExplorer — browser file/folder seperti GitHub
 * Memanggil Vercel API route untuk baca folder dan file
 */

const s = {
  wrapper: {
    border: '1px solid var(--border)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '1.5rem',
    background: 'var(--bg-card)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    flexWrap: 'wrap',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
  },
  breadcrumbBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    padding: '0 2px',
    fontFamily: 'inherit',
  },
  sep: { color: 'var(--text-secondary)', userSelect: 'none' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 14px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
  icon: { fontSize: '1rem', flexShrink: 0, width: '20px', textAlign: 'center' },
  loading: { padding: '24px 14px', color: 'var(--text-secondary)', fontSize: '0.875rem' },
  error: { padding: '12px 14px', color: '#ef4444', fontSize: '0.875rem' },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
}

const ICON = { folder: '📁', py: '🐍', js: '📜', json: '📋', md: '📄', txt: '📝', default: '📄' }

function fileIcon(nama) {
  if (nama.endsWith('.py')) return ICON.py
  if (nama.endsWith('.js') || nama.endsWith('.jsx')) return ICON.js
  if (nama.endsWith('.json')) return ICON.json
  if (nama.endsWith('.md')) return ICON.md
  if (nama.endsWith('.txt')) return ICON.txt
  return ICON.default
}

export default function RepoExplorer({ repoId }) {
  const [currentPath, setCurrentPath] = useState('')
  const [items, setItems] = useState([])
  const [openFile, setOpenFile] = useState(null) // { nama, bahasa, isi }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadTree = useCallback(async (path) => {
    setLoading(true)
    setError(null)
    setOpenFile(null)
    try {
      const res = await fetch(`/api/repo-tree?repoId=${repoId}&path=${encodeURIComponent(path)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal memuat folder')
      setItems(data.items)
      setCurrentPath(path)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [repoId])

  const loadFile = useCallback(async (filePath) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/repo-file?repoId=${repoId}&path=${encodeURIComponent(filePath)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal memuat file')
      setOpenFile(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [repoId])

  useEffect(() => { loadTree('') }, [loadTree])

  const handleItem = (item) => {
    if (item.tipe === 'folder') loadTree(item.path)
    else loadFile(item.path)
  }

  const handleBack = () => {
    if (openFile) { setOpenFile(null); return }
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    loadTree(parts.join('/'))
  }

  // Breadcrumb dari currentPath
  const crumbs = currentPath ? currentPath.split('/').filter(Boolean) : []

  return (
    <div style={s.wrapper}>
      {/* Header breadcrumb */}
      <div style={s.header}>
        <span>📂</span>
        <div style={s.breadcrumb}>
          <button style={s.breadcrumbBtn} onClick={() => loadTree('')}>root</button>
          {crumbs.map((crumb, i) => {
            const path = crumbs.slice(0, i + 1).join('/')
            return (
              <span key={path} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={s.sep}>/</span>
                <button style={s.breadcrumbBtn} onClick={() => loadTree(path)}>{crumb}</button>
              </span>
            )
          })}
          {openFile && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={s.sep}>/</span>
              <span style={{ color: 'var(--text-primary)' }}>{openFile.nama}</span>
            </span>
          )}
        </div>
      </div>

      {/* Tombol back */}
      {(currentPath || openFile) && (
        <button style={s.backBtn} onClick={handleBack}>
          ← Kembali
        </button>
      )}

      {/* Konten */}
      {loading && <div style={s.loading}>Memuat...</div>}
      {error && <div style={s.error}>⚠ {error}</div>}

      {!loading && !error && !openFile && items.map((item) => (
        <button
          key={item.path}
          style={{
            ...s.row,
            borderBottom: '1px solid var(--border)',
          }}
          onClick={() => handleItem(item)}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <span style={s.icon}>
            {item.tipe === 'folder' ? ICON.folder : fileIcon(item.nama)}
          </span>
          <span>{item.nama}</span>
          {item.tipe === 'folder' && (
            <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              folder →
            </span>
          )}
        </button>
      ))}

      {!loading && !error && openFile && (
        <CodeSnippet
          namaFile={openFile.nama}
          bahasa={openFile.bahasa}
          isi={openFile.isi}
        />
      )}
    </div>
  )
}