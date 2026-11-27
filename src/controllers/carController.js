import mongoose from "mongoose";
import Car from "../models/Car.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Konversi dan validasi parameter query numerik.
function parseNumberQuery(value, name) {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    const error = new Error(`${name} must be a non-negative number`);
    error.status = 400;
    throw error;
  }
  return parsed;
}

export async function listCars(req, res, next) {
  try {
    // Parameter pencarian dan filter dari query URL.
    const { search, brand, year } = req.query;
    const minPrice = parseNumberQuery(req.query.minPrice, "minPrice");
    const maxPrice = parseNumberQuery(req.query.maxPrice, "maxPrice");
    const parsedYear = year === undefined ? undefined : Number(year);
    if (
      parsedYear !== undefined &&
      (!Number.isInteger(parsedYear) || parsedYear < 1886)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "year must be a valid year (1886 or later)",
        });
    }
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "minPrice cannot be greater than maxPrice",
        });
    }

    // Filter MongoDB berdasarkan parameter yang tersedia.
    const filter = {};
    if (search) {
      const term = new RegExp(escapeRegex(String(search).trim()), "i");
      filter.$or = [{ brand: term }, { model: term }];
    }
    if (brand)
      filter.brand = new RegExp(`^${escapeRegex(String(brand).trim())}$`, "i");
    if (parsedYear !== undefined) filter.year = parsedYear;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // Ambil dokumen mobil yang sesuai dengan filter.
    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    // Teruskan error ke middleware penanganan error.
    next(error);
  }
}

export async function getCar(req, res, next) {
  try {
    // Ambil dokumen berdasarkan ObjectId.
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid car ID" });
    }
    const car = await Car.findById(req.params.id);
    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
}

export async function createCar(req, res, next) {
  try {
    // Simpan dokumen mobil baru dari request body.
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ success: false, message: "Request body must be a car object" });
    }
    const car = await Car.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Car created successfully", data: car });
  } catch (error) {
    next(error);
  }
}

export async function updateCar(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid car ID" });
    }
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ success: false, message: "Request body must be a car object" });
    }
    // Pemeriksaan kelengkapan field untuk operasi PUT.
    const requiredFields = [
      "brand",
      "model",
      "year",
      "price",
      "color",
      "transmission",
      "stock",
    ];
    const missingFields = requiredFields.filter(
      (field) => req.body[field] === undefined,
    );
    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: "PUT requires all car fields",
        details: missingFields.map((field) => `${field} is required`),
      });
    }
    const car = await Car.findById(req.params.id);
    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });
    for (const field of requiredFields) car[field] = req.body[field];
    await car.save();
    res
      .status(200)
      .json({ success: true, message: "Car updated successfully", data: car });
  } catch (error) {
    next(error);
  }
}

export async function deleteCar(req, res, next) {
  try {
    // Hapus dokumen berdasarkan ObjectId.
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid car ID" });
    }
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });
    res
      .status(200)
      .json({ success: true, message: "Car deleted successfully", data: car });
  } catch (error) {
    next(error);
  }
}
