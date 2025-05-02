import mongoose, { Document, Schema, model, models } from "mongoose";
export interface ICategory extends Document {
  adCount: number;
  _id: string;
  category: string;
  subcategory: string;
  imageUrl: string[];
  fields: any;
}
const fieldSchema = new Schema({
  name: String,
  type: { type: String }, // e.g., "text", "number", "select"
  options: [String], // for dropdowns or radio buttons
  required: Boolean,
});

const SubcategorySchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  subcategory: String,
  imageUrl: { type: [String], required: true },
  fields: [fieldSchema], // Fields associated with this category
})
delete mongoose.models.Subcategory;
const Subcategory = models.Subcategory || model('Subcategory', SubcategorySchema);

export default Subcategory;