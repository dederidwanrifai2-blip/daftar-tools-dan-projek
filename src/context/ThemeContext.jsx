import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('devpaii-tema') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    localStorage.setItem('devpaii-tema', tema)
  }, [tema])

  const toggle = () => setTema(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ tema, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider')
  }
  return context
}
