import mongoose, { Schema, Document } from 'mongoose';

export interface IMapaVerification extends Document {
  fullName: string;
  phone: string;
  idNumber: string;
  kraPin: string;
  parcelNumber: string;
  consentStatus: 'not-applicable' | 'yes' | 'no';
  ad: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  files: {
    titleDeed: string;
    landSearch: string;
    idCopy: string;
    kraPinCopy: string;
    buildingPlans?: string;
    occupationCertificate?: string;
    utilityClearance?: string;
    landRatesClearance?: string;
    shareCertificate?: string;
    siteReport?: string;
  };
  submittedAt: Date;
}

const MapaVerificationSchema = new Schema<IMapaVerification>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  idNumber: { type: String, required: true },
  kraPin: { type: String, required: true },
  parcelNumber: { type: String, required: true },
  ad: { type: Schema.Types.ObjectId, ref: 'DynamicAd' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  consentStatus: {
    type: String,
    enum: ['not-applicable', 'yes', 'no'],
    default: 'not-applicable',
  },
  files: {
    titleDeed: { type: String, required: true },
    landSearch: { type: String, required: true },
    idCopy: { type: String, required: true },
    kraPinCopy: { type: String, required: true },
    buildingPlans: String,
    occupationCertificate: String,
    utilityClearance: String,
    landRatesClearance: String,
    shareCertificate: String,
    siteReport: String,
  },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.MapaVerification ||
  mongoose.model<IMapaVerification>('MapaVerification', MapaVerificationSchema);
