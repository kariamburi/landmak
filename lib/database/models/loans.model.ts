import mongoose, { Document, Schema, model, models } from "mongoose";

export interface ILoan extends Document {
  _id: string;
  userId: string;
  adId: string;
  loanType: string,
  LoanAmount: number,
  monthlyIncome: number,
  deposit: number,
  loanterm: string,
  employmentStatus: string,
  messageComments: string,
  status: string,
  financerId: string;
}
const LoanSchema = new Schema({
  adId: { type: Schema.Types.ObjectId, ref: 'DynamicAd', default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  loanType: { type: String },
  LoanAmount: { type: Number },
  monthlyIncome: { type: Number },
  deposit: { type: Number },
  loanterm: { type: String },
  employmentStatus: { type: String },
  messageComments: { type: String },
  status: { type: String, required: true },
  financerId: { type: Schema.Types.ObjectId, ref: 'User' },
},
  { timestamps: true })
delete mongoose.models.Loan;
const Loan = models.Loan || model('Loan', LoanSchema);

export default Loan;