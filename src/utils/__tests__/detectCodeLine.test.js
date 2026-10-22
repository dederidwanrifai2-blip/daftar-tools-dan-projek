// src/utils/__tests__/detectCodeLine.test.js
// Property 15: Deteksi command-line konsisten
// Validates: Requirements 5.5

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { isCodeLine } from '../detectCodeLine.js'

// ---------------------------------------------------------------------------
// Arbitrary helpers
// ---------------------------------------------------------------------------

/**
 * Generator: string yang diawali `$` diikuti karakter apa saja (termasuk kosong)
 */
const startsWithDollar = fc
  .string()
  .map((rest) => '$' + rest)

/**
 * Generator: string yang diawali `>` diikuti karakter apa saja (termasuk kosong)
 */
const startsWithArrow = fc
  .string()
  .map((rest) => '>' + rest)

/**
 * Generator: string yang diawali spasi/tab kemudian `$` atau `>`,
 * untuk menguji bahwa fungsi melakukan trim() sebelum cek awalan.
 */
const startsWithDollarOrArrowWithLeadingSpace = fc
  .record({
    spaces: fc
      .array(fc.constantFrom(' ', '\t'), { minLength: 1, maxLength: 5 })
      .map((arr) => arr.join('')),
    prefix: fc.constantFrom('$', '>'),
    rest: fc.string(),
  })
  .map(({ spaces, prefix, rest }) => spaces + prefix + rest)

/**
 * Generator: string yang TIDAK mengandung pola command-line apapun.
 * Strategi: bangun string dari karakter yang aman, tanpa `$`, `>`, dan `-`.
 * Alfanumerik + beberapa tanda baca umum, tapi awali dengan huruf/angka.
 */
const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 _.,!?@#%^&*()+=[]{}|;:"\'' .split('')
const alphanumChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

const noPatternString = fc
  .record({
    firstChar: fc.constantFrom(...alphanumChars),
    rest: fc
      .array(fc.constantFrom(...safeChars), { minLength: 0, maxLength: 30 })
      .map((arr) => arr.join('')),
  })
  .map(({ firstChar, rest }) => firstChar + rest)

// ---------------------------------------------------------------------------
// Property 15 — Deteksi command-line konsisten
// ---------------------------------------------------------------------------

describe('Property 15: Deteksi command-line konsisten', () => {
  it('string yang diawali "$" harus selalu return true', () => {
    fc.assert(
      fc.property(startsWithDollar, (str) => {
        expect(isCodeLine(str)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  it('string yang diawali ">" harus selalu return true', () => {
    fc.assert(
      fc.property(startsWithArrow, (str) => {
        expect(isCodeLine(str)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  it('string yang diawali spasi/tab lalu "$" atau ">" harus return true (trim-safe)', () => {
    fc.assert(
      fc.property(startsWithDollarOrArrowWithLeadingSpace, (str) => {
        expect(isCodeLine(str)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  it('string tanpa pola command-line harus selalu return false', () => {
    fc.assert(
      fc.property(noPatternString, (str) => {
        expect(isCodeLine(str)).toBe(false)
      }),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Unit tests — contoh konkret untuk dokumentasi dan regresi
// ---------------------------------------------------------------------------

describe('isCodeLine — contoh konkret', () => {
  it('mendeteksi perintah yang diawali $', () => {
    expect(isCodeLine('$ npm install')).toBe(true)
    expect(isCodeLine('$anything')).toBe(true)
  })

  it('mendeteksi perintah yang diawali >', () => {
    expect(isCodeLine('> git status')).toBe(true)
    expect(isCodeLine('>')).toBe(true)
  })

  it('mendeteksi flag --word', () => {
    expect(isCodeLine('git commit --message "fix"')).toBe(true)
    expect(isCodeLine('--verbose')).toBe(true)
  })

  it('mendeteksi flag -huruf', () => {
    expect(isCodeLine('python -m venv env')).toBe(true)
    expect(isCodeLine('-v')).toBe(true)
  })

  it('string tanpa pola apapun return false', () => {
    expect(isCodeLine('Ini hanya kalimat biasa')).toBe(false)
    expect(isCodeLine('Tidak ada tanda khusus')).toBe(false)
    expect(isCodeLine('')).toBe(false)
    expect(isCodeLine('   ')).toBe(false)
  })

  it('input non-string return false', () => {
    expect(isCodeLine(null)).toBe(false)
    expect(isCodeLine(undefined)).toBe(false)
    expect(isCodeLine(42)).toBe(false)
  })
})
