import "dotenv/config";
import express from "express";
import connectDatabase from "./src/config/database.js";
import carRoutes from "./src/routes/carRoutes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./src/middleware/errorHandler.js";

// Inisialisasi aplikasi Express.
const app = express();

// Konfigurasi port server.
const port = Number(process.env.PORT) || 3000;

// Middleware pembaca request JSON.
app.use(express.json());

// Endpoint pemeriksaan status server.
app.get("/api/health", (_req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Car Showroom API is running" });
});
app.use("/api/cars", carRoutes);

// Handler route tidak ditemukan dan penanganan error.
app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  
  // Koneksi database sebelum server mulai menerima request.
  connectDatabase()
    .then(() =>
      app.listen(port, () => console.log(`Server listening on port ${port}`)),
    )
    .catch((error) => {
      console.error("Unable to start server:", error.message);
      process.exit(1);
    });
}

export default app;
