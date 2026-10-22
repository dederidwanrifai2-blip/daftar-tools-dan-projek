// App.jsx — Root component dengan routing setup
// Requirements: 1.2 (hash-based routing), 6.1 (hash URL), 6.3 (direct URL), 7.5 (elemen semantik)

import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CatalogPage from './components/catalog/CatalogPage'
import DetailPage from './components/detail/DetailPage'
import NotFoundPage from './components/shared/NotFoundPage'

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <HashRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/projek/:id" element={<DetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </HashRouter>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App
