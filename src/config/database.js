import mongoose from "mongoose";

// Koneksi MongoDB menggunakan environment variable MONGODB_URI.
export default async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  
  // Pemeriksaan konfigurasi URI database.
  if (!uri) throw new Error("MONGODB_URI is required");
  
  // Menunggu koneksi database selesai.
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
