// src/utils/constants.js

/**
 * Nilai yang diperbolehkan untuk field `status` pada setiap proyek.
 * Sesuai dengan Requirements 2.2.
 */
export const STATUS = {
  SELESAI: 'selesai',
  DALAM_PENGERJAAN: 'dalam pengerjaan',
  BELUM_DIMULAI: 'belum dimulai',
}

/** Label opsi filter default yang menampilkan semua proyek (Requirements 4.1) */
export const KATEGORI_DEFAULT = 'Semua'

/** Label kategori otomasi — selalu ditampilkan pertama (Requirements 3.4) */
export const KATEGORI_OTOMASI = 'Otomasi'
