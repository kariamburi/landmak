import mongoose, { Document, Schema, model, models, Types } from "mongoose";

// ----------------------
// TypeScript Interfaces
// ----------------------
export interface Verified {
  accountverified: boolean;
  verifieddate: Date;
}

export interface IdynamicAd extends Document {
  data: any;
  organizer: {
    verified: Verified[];
    whatsapp: any;
    photo?: string;
    _id: string;
    firstName: string;
    lastName: string;
  };
  plan: {
    _id: string;
    name: string;
    color: string;
    imageUrl: string;
  };
  subcategory: Types.ObjectId;
  category: Types.ObjectId;
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
  disputeStatus: 'none' | 'reported' | 'suspected' | 'verified';
  disputeReports: Types.ObjectId[];
  mapaVerificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  createdAt: Date;
}

// ----------------------
// Mongoose Schema
// ----------------------
const dynamicAdSchema = new Schema<IdynamicAd>(
  {
    data: Schema.Types.Mixed, // dynamic structure based on selected category

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

    disputeStatus: {
      type: String,
      enum: ['none', 'reported', 'suspected', 'verified'],
      default: 'none',
      index: true,
    },
    disputeReports: [{ type: Schema.Types.ObjectId, ref: 'DisputeReport' }],
    mapaVerificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false } // set to true if you want Mongoose to auto-manage createdAt + updatedAt
);
//delete mongoose.models.DynamicAd;
// Optional compound index
// dynamicAdSchema.index({ "data.category": 1, "data.subcategory": 1, adstatus: 1 });

dynamicAdSchema.index({ "data.propertyarea.location": "2dsphere" });
dynamicAdSchema.index({ "data.propertyarea.shapesGeo": "2dsphere" });
const DynamicAd = models.DynamicAd || model<IdynamicAd>('DynamicAd', dynamicAdSchema);

export default DynamicAd;
