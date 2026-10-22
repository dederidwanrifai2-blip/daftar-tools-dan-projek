/**
 * CodeSnippet — Unit / Example Tests
 *
 * Property 13: Syntax highlighting diterapkan berdasarkan bahasa
 * **Validates: Requirements 9.2**
 *
 * Test 1 — Elemen <code> punya class `language-[bahasa]` sesuai prop yang diberikan
 * Test 2 — Setelah klik tombol Salin, teks tombol berubah ke "Tersalin!"
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CodeSnippet from '../CodeSnippet'

// ---------------------------------------------------------------------------
// Mock: window.Prism.highlightElement — tidak tersedia di jsdom
// ---------------------------------------------------------------------------

// Clipboard stub statis — didefinisikan sekali di sini agar vi.spyOn bisa bekerja
const clipboardStub = {
  writeText: () => Promise.resolve(),
}

beforeEach(() => {
  window.Prism = {
    highlightElement: vi.fn(),
  }

  // Pasang stub clipboard ke navigator (jsdom tidak menyediakan Clipboard API)
  Object.defineProperty(navigator, 'clipboard', {
    value: clipboardStub,
    configurable: true,
    writable: true,
  })

  // Spy pada stub agar dapat diverifikasi dengan toHaveBeenCalledWith
  vi.spyOn(clipboardStub, 'writeText').mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function renderCodeSnippet(props = {}) {
  const defaults = {
    namaFile: 'contoh.js',
    bahasa: 'javascript',
    isi: 'const x = 1;',
  }
  return render(<CodeSnippet {...defaults} {...props} />)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CodeSnippet — Property 13: syntax highlighting berdasarkan bahasa', () => {
  /**
   * Test 1a: Elemen <code> mengandung class `language-javascript`
   * **Validates: Requirements 9.2**
   */
  it('elemen <code> punya class language-javascript untuk bahasa "javascript"', () => {
    const { container } = renderCodeSnippet({ bahasa: 'javascript' })
    const codeEl = container.querySelector('code')
    expect(codeEl).not.toBeNull()
    expect(codeEl.className).toContain('language-javascript')
  })

  /**
   * Test 1b: Elemen <code> mengandung class `language-python`
   * **Validates: Requirements 9.2**
   */
  it('elemen <code> punya class language-python untuk bahasa "python"', () => {
    const { container } = renderCodeSnippet({ bahasa: 'python' })
    const codeEl = container.querySelector('code')
    expect(codeEl).not.toBeNull()
    expect(codeEl.className).toContain('language-python')
  })

  /**
   * Test 1c: Elemen <code> mengandung class `language-json`
   * **Validates: Requirements 9.2**
   */
  it('elemen <code> punya class language-json untuk bahasa "json"', () => {
    const { container } = renderCodeSnippet({ bahasa: 'json' })
    const codeEl = container.querySelector('code')
    expect(codeEl).not.toBeNull()
    expect(codeEl.className).toContain('language-json')
  })

  /**
   * Test 1d: Elemen <code> mengandung class `language-bash`
   * **Validates: Requirements 9.2**
   */
  it('elemen <code> punya class language-bash untuk bahasa "bash"', () => {
    const { container } = renderCodeSnippet({ bahasa: 'bash' })
    const codeEl = container.querySelector('code')
    expect(codeEl).not.toBeNull()
    expect(codeEl.className).toContain('language-bash')
  })

  /**
   * Test 1e: Elemen <code> mengandung class `language-html`
   * **Validates: Requirements 9.2**
   */
  it('elemen <code> punya class language-html untuk bahasa "html"', () => {
    const { container } = renderCodeSnippet({ bahasa: 'html' })
    const codeEl = container.querySelector('code')
    expect(codeEl).not.toBeNull()
    expect(codeEl.className).toContain('language-html')
  })

  /**
   * Test 1f: Class `language-[bahasa]` mengikuti nilai prop secara dinamis
   * **Validates: Requirements 9.2**
   */
  it('class language-[bahasa] mengikuti nilai prop bahasa secara dinamis', () => {
    const bahasaList = ['javascript', 'python', 'json', 'bash', 'html']

    for (const bahasa of bahasaList) {
      const { container } = renderCodeSnippet({ bahasa })
      const codeEl = container.querySelector('code')
      expect(codeEl.className).toContain(`language-${bahasa}`)
      cleanup()
    }
  })

  /**
   * Test 2: Setelah klik tombol "Salin", teks berubah ke "Tersalin!"
   * **Validates: Requirements 9.3**
   */
  it('teks tombol berubah ke "Tersalin!" setelah diklik', async () => {
    const user = userEvent.setup()
    renderCodeSnippet()

    // Tombol awalnya menampilkan "Salin"
    const tombol = screen.getByRole('button', { name: /salin/i })
    expect(tombol).toHaveTextContent('Salin')

    // Klik tombol
    await user.click(tombol)

    // Teks berubah ke "Tersalin!"
    expect(tombol).toHaveTextContent('Tersalin!')
  })

  /**
   * Test 4: Prism.highlightElement dipanggil pada elemen <code> saat render
   * **Validates: Requirements 9.2, 9.8**
   */
  it('Prism.highlightElement dipanggil pada elemen <code> saat render', () => {
    const { container } = renderCodeSnippet({ bahasa: 'javascript' })
    const codeEl = container.querySelector('code')
    expect(window.Prism.highlightElement).toHaveBeenCalledWith(codeEl)
  })
})
