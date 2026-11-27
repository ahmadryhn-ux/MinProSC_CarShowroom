import mongoose from "mongoose";

// Skema field dan validasi dokumen mobil.
const carSchema = new mongoose.Schema(
  {
    // Field teks wajib; trim menghapus spasi di tepi nilai.
    brand: { type: String, required: true, trim: true, maxlength: 60 },
    model: { type: String, required: true, trim: true, maxlength: 80 },
    year: {
      type: Number,
      required: true,
      min: 1886,
      max: new Date().getFullYear() + 1,
    },
    // Validasi harga, jenis transmisi, dan jumlah stok.
    price: { type: Number, required: true, min: 0 },
    color: { type: String, required: true, trim: true, maxlength: 40 },
    transmission: {
      type: String,
      required: true,
      enum: ["Manual", "Automatic"],
    },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
  },
  // Timestamp otomatis untuk waktu pembuatan dan perubahan dokumen.
  { timestamps: true, versionKey: false },
);

// Model Mongoose untuk koleksi cars.
export default mongoose.model("Car", carSchema);
