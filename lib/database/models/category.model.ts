import mongoose, { Document, Schema, model, models } from "mongoose";

export interface ICategory extends Document {
  adCount: number;
  _id: string;
  name: string;
  imageUrl: string[];
  status: string;
}
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: [String], required: true },
  status: { type: String, required: true },
})
delete mongoose.models.Category;
const Category = models.Category || model('Category', CategorySchema);

export default Category;