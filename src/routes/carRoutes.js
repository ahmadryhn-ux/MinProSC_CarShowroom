import { Router } from "express";
import {
  createCar,
  deleteCar,
  getCar,
  listCars,
  updateCar,
} from "../controllers/carController.js";

const router = Router();

// Route koleksi mobil: daftar dan tambah.
router.route("/").get(listCars).post(createCar);
// Route detail mobil berdasarkan ID: baca, ubah, dan hapus.
router.route("/:id").get(getCar).put(updateCar).delete(deleteCar);

export default router;
