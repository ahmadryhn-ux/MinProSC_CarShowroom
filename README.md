# Car Showroom Management System

REST API sederhana untuk mengelola inventaris mobil showroom. Data disimpan di MongoDB.

## Informasi Project

- **Nama:** Ahmad Rayhaan
- **NIM:** 2510511074
- **Judul:** Car Showroom Management System
- **Repository GitHub:** https://github.com/ahmadryhn-ux/MinProSC_CarShowroom.git

## Teknologi dan Arsitektur

- Node.js, Express.js, MongoDB, dan Mongoose.
- Struktur modular: `src/config` untuk koneksi database, `src/models` untuk skema, `src/controllers` untuk logika API, `src/routes` untuk endpoint, dan `src/middleware` untuk error handling.

## Instalasi dan Menjalankan

1. Pastikan Node.js/npm dan MongoDB lokal atau MongoDB Atlas tersedia.
2. Pasang dependency:

   ```bash
   npm install
   ```

3. Salin `.env.example` menjadi `.env`, lalu sesuaikan `MONGODB_URI` dengan koneksi MongoDB milikmu.
4. Jalankan mode pengembangan atau mode biasa:

   ```bash
   npm run dev
   # atau
   npm start
   ```

Server berjalan di `http://localhost:3000` secara default. Port dapat diubah lewat `PORT`.

## Environment Variable

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `PORT` | Tidak | Port server; default `3000`. |
| `MONGODB_URI` | Ya | URI koneksi MongoDB. |

Jangan commit `.env` atau kredensial MongoDB. File tersebut sudah masuk `.gitignore`.

## Data Mobil

Setiap dokumen mobil menggunakan `brand`, `model`, `year`, `price`, `color`, `transmission` (`Manual` atau `Automatic`), dan `stock`. `createdAt` dan `updatedAt` dibuat otomatis.

Contoh request body:

```json
{
  "brand": "Mazda",
  "model": "CX-5",
  "year": 2025,
  "price": 650000000,
  "color": "Black",
  "transmission": "Automatic",
  "stock": 3
}
```

## Endpoint API

Semua endpoint memakai prefix `/api` dan mengembalikan JSON dengan format `{ "success": true|false, ... }`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/api/health` | Memeriksa status server. |
| GET | `/api/cars` | Daftar mobil; mendukung query pencarian/filter. |
| GET | `/api/cars/:id` | Detail mobil berdasarkan MongoDB ObjectId. |
| POST | `/api/cars` | Menambahkan mobil. |
| PUT | `/api/cars/:id` | Mengganti data mobil. Kirim seluruh field mobil. |
| PATCH | `/api/cars/:id` | Mengubah hanya field yang dikirim. |
| DELETE | `/api/cars/:id` | Menghapus mobil. |

Filter daftar: `search` mencocokkan merek/model tanpa membedakan huruf besar-kecil; `brand` memfilter merek; `year`, `minPrice`, dan `maxPrice` memfilter tahun/harga.

Contoh: `GET /api/cars?search=Mazda&minPrice=500000000&maxPrice=800000000`

ID dengan format salah menghasilkan `400`, data yang tidak ada menghasilkan `404`, data tidak valid menghasilkan `400`, dan error server menghasilkan `500` dengan pesan umum.

## Pengujian API

Import `postman/CarShowroom.postman_collection.json` ke Postman, jalankan server dan MongoDB, lalu gunakan collection variable `baseUrl` (default `http://localhost:3000`). Request `POST` menyimpan ObjectId hasilnya ke variable `carId`.

## Presentasi

PDF presentasi final tersedia di `output/pdf/CarShowroom-Presentasi.pdf`. Isi NIM dan tautan repository sebelum mengumpulkan. Presentasi mencakup judul aplikasi, arsitektur, metode HTTP, dan kesimpulan.
