import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true, maxlength: 60 },
    model: { type: String, required: true, trim: true, maxlength: 80 },
    year: { type: Number, required: true, min: 1886, max: new Date().getFullYear() + 1 },
    price: { type: Number, required: true, min: 0 },
    color: { type: String, required: true, trim: true, maxlength: 40 },
    transmission: { type: String, required: true, enum: ['Manual', 'Automatic'] },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('Car', carSchema);
