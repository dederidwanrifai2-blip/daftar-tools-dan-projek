// src/utils/detectCodeLine.js

/**
 * Mendeteksi apakah sebuah string merupakan baris perintah (command-line).
 * Return true jika string dimulai dengan `$` atau `>`,
 * atau mengandung flag `--[huruf]` atau `-[huruf]`.
 *
 * @param {string} str - String yang akan diperiksa
 * @returns {boolean}
 */
export function isCodeLine(str) {
  if (typeof str !== 'string') return false
  const trimmed = str.trim()
  return (
    trimmed.startsWith('$') ||
    trimmed.startsWith('>') ||
    /--[a-zA-Z]/.test(trimmed) ||
    /-[a-zA-Z]/.test(trimmed)
  )
}
