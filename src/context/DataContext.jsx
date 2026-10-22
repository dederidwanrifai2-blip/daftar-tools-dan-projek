import { createContext, useContext, useState, useEffect } from 'react'

export const DataContext = createContext()

export function DataProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetch('./data/projects.json')
      .then(res => {
        if (!res.ok) throw new Error('File data tidak ditemukan')
        return res.json()
      })
      .then(data => { setProjects(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  return (
    <DataContext.Provider value={{ projects, loading, error }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData harus digunakan di dalam DataProvider')
  }
  return context
}
