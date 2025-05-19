import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IdynamicAd extends Document {
  data: any;
  organizer: {
    verified: Verified[];
    whatsapp: any;
    photo: string | undefined; _id: string, firstName: string, lastName: string
  }
  plan: {

    _id: string, name: string, color: string, imageUrl: string
  };
  subcategory: any;
  category: any;
  views: string;
  priority: number;
  expirely: Date;
  adstatus: string;
  inquiries: string;
  whatsapp: string;
  calls: string;
  shared: string;
  bookmarked: string;
  abused: string;
}
export interface Verified {
  accountverified: boolean
  verifieddate: Date
}
const dynamicAdSchema = new Schema({
  data: Schema.Types.Mixed, // Dynamic data based on selected category
  views: { type: String },
  priority: { type: Number },
  expirely: { type: Date },
  adstatus: { type: String, index: true },
  inquiries: { type: String },
  whatsapp: { type: String },
  calls: { type: String },
  shared: { type: String },
  bookmarked: { type: String },
  abused: { type: String },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  plan: { type: Schema.Types.ObjectId, ref: 'Packages' },
},
  { timestamps: true });
//delete mongoose.models.DynamicAd;
// ✅ Add compound index for performance
//dynamicAdSchema.index({ "data.category": 1, "data.subcategory": 1, adstatus: 1 });
const DynamicAd = models.DynamicAd || model('DynamicAd', dynamicAdSchema);

export default DynamicAd;