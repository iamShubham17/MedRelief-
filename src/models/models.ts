import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  firebaseUID: { type: String, required: true, unique: true },
  role: { type: String, enum: ['donor', 'pharmacist', 'ngo', 'patient', 'admin', 'rider'], default: 'donor' },
  phone: { type: String },
  city: { type: String },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  mediPoints: { type: Number, default: 0 },
  licenseNumber: { type: String },
  licenseUrl: { type: String },
  stateCouncil: { type: String },
  pharmacyAddress: { type: String },
  orgName: { type: String },
  regNumber: { type: String },
  address: { type: String },
  certUrl: { type: String },
  vehicleNumber: { type: String },
}, { timestamps: true });

const donationSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  donorId: { type: String, required: true }, // firebaseUID
  donorName: { type: String },
  expiryDate: { type: String },
  quantity: { type: String },
  status: { type: String, enum: ['pending_verification', 'verified', 'rejected'], default: 'pending_verification' },
}, { timestamps: true });

const requestSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // firebaseUID
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Donation = mongoose.model('Donation', donationSchema);
export const Request = mongoose.model('Request', requestSchema);
