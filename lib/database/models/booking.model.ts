import { Document, Schema, model, models } from "mongoose";

export interface IBooking extends Document {
  _id: string;
  propertyId: string;
  userId: string;
  date: string;
  time: string;
  message: string;
  status: string;
}
const BookingSchema = new Schema({
  propertyId:  { type: Schema.Types.ObjectId, ref: 'DynamicAd', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  message: String,
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
},
  { timestamps: true })
const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;