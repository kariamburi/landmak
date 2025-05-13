import { Document, Schema, model, models } from "mongoose";

export interface ICategory extends Document {
  _id: string;
  userBId: string;
  adId: string;
}
const BookmarkSchema = new Schema({
  adId: { type: Schema.Types.ObjectId, ref: 'DynamicAd' },
  userBId: { type: Schema.Types.ObjectId, ref: 'User' },
})
const Bookmark = models.Bookmark || model('Bookmark', BookmarkSchema);

export default Bookmark;