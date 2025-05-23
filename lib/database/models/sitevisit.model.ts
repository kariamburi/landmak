import { Document, Schema, model, models } from "mongoose";

export interface ISitevisit extends Document {
  _id: string;
  propertyId: string;
  ownerId: string;
  date: string;
  timeSlots: string;
}
const SitevisitSchema = new Schema({

  propertyId: { type: Schema.Types.ObjectId, ref: 'DynamicAd', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // e.g., '2025-05-25'
  timeSlots: [String], // e.g., ['10:00', '12:00']
},
  { timestamps: true })
//SitevisitSchema.index({ propertyId: 1 });
const Sitevisit = models.Sitevisit || model('Sitevisit', SitevisitSchema);

export default Sitevisit;