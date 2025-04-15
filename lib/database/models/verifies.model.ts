import { Schema, model, models, Document } from 'mongoose'

export interface IVerifies
  extends Document {
  _id: string;
  fee: string;
}
const VerifiesSchema = new Schema({
  fee: { type: String, required: true, unique: true },
})
const Verifies = models.Verifies || model('Verifies', VerifiesSchema)

export default Verifies
