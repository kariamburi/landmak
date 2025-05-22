import { Document, Schema, model, models } from "mongoose";

export interface IReported extends Document {
  _id: string;
  userId: string;
  adId: string;
  reason: string;
  description: string;
}
const ReportedSchema = new Schema({
  adId: { type: Schema.Types.ObjectId, ref: 'DynamicAd' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  description: { type: String, required: true },
},
  { timestamps: true })
const Reported = models.Reported || model('Reported', ReportedSchema);

export default Reported;