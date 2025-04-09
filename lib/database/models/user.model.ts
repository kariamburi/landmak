import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  status: string;
  businessname?: string;
  aboutbusiness?: string;
  businessaddress?: string;
  latitude?: string;
  longitude?: string;
  businesshours?: Businesshours[];
  businessworkingdays?: string[];
  phone?: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  verified: Verified[];
  imageUrl?: string;
  token?: string;
  notifications?: {
    email: boolean;
    fcm: boolean;
  };
}

export interface Businesshours {
  openHour: string;
  openMinute: string;
  closeHour: string;
  closeMinute: string;
}

export interface Verified {
  accountverified: boolean;
  verifieddate: Date;
}

const BusinesshoursSchema = new Schema<Businesshours>({
  openHour: { type: String, required: true },
  openMinute: { type: String, required: true },
  closeHour: { type: String, required: true },
  closeMinute: { type: String, required: true },
});

const VerifiedSchema = new Schema<Verified>({
  accountverified: { type: Boolean, required: true },
  verifieddate: { type: Date, required: true },
});

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },
  status: { type: String, required: true },
  businessname: { type: String }, // Optional
  aboutbusiness: { type: String }, // Optional
  businessaddress: { type: String }, // Optional
  latitude: { type: String }, // Optional
  longitude: { type: String }, // Optional
  businesshours: { type: [BusinesshoursSchema], default: [] }, // Optional
  businessworkingdays: { type: [String], default: [] }, // Optional
  phone: { type: String }, // Optional
  whatsapp: { type: String }, // Optional
  website: { type: String }, // Optional
  facebook: { type: String }, // Optional
  twitter: { type: String }, // Optional
  instagram: { type: String }, // Optional
  tiktok: { type: String }, // Optional
  verified: { type: [VerifiedSchema], required: true }, // Optional
  imageUrl: { type: String }, // Optional
  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: null },
  token: { type: String },
  notifications: {
    email: { type: Boolean, default: true },
    fcm: { type: Boolean, default: true },
  },
});
delete mongoose.models.User;
const User = models.User || model('User', UserSchema);

export default User;
