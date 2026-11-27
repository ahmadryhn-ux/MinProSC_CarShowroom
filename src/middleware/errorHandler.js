// Respons untuk endpoint yang tidak terdaftar.
export function notFoundHandler(req, res) {
  res
    .status(404)
    .json({
      success: false,
      message: `Alamat API tidak ditemukan: ${req.method} ${req.originalUrl}`,
    });
}

// Middleware pemetaan error ke respons HTTP.
export function errorHandler(error, _req, res, _next) {
  if (res.headersSent) return;
  if (error.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({
        success: false,
        message: "Isi request harus menggunakan format JSON yang valid",
      });
  }
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => item.message);
    return res
      .status(400)
      .json({ success: false, message: "Data tidak lolos validasi", details });
  }
  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: `Invalid value for ${error.path}` });
  }
  const status = Number.isInteger(error.status) ? error.status : 500;
  const message = status < 500 ? error.message : "Terjadi kesalahan pada server";
  if (status >= 500) console.error(error);
  return res.status(status).json({ success: false, message });
}

