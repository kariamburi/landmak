// models/DisputeReport.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IDisputeReport extends Document {
    parcel: string;
    type: string;
    description: string;
    evidenceUrl?: string;
    contact?: string;
    anonymous: boolean;
    ad?: mongoose.Types.ObjectId;
    status: 'pending' | 'reviewed' | 'dismissed';
    confidence: 'reported' | 'suspected' | 'verified';
    createdAt: Date;
}

const disputeReportSchema = new Schema<IDisputeReport>({
    parcel: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    evidenceUrl: { type: String },
    contact: { type: String },
    anonymous: { type: Boolean, default: false },
    ad: { type: Schema.Types.ObjectId, ref: 'DynamicAd' },
    status: { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending' },
    confidence: { type: String, enum: ['reported', 'suspected', 'verified'], default: 'reported' },
    createdAt: { type: Date, default: Date.now },
});

//delete models.DisputeReport;
const DisputeReport = models.DisputeReport || model('DisputeReport', disputeReportSchema);
export default DisputeReport;
