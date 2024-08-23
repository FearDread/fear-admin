import mongoose, { Document, Schema } from 'mongoose';
import reviewSchema from './review';

interface Image {
  product_id: string;
  url: string;
}

interface Product extends Document {
  name: string;
  description: string;
  price: number;
  info: string;
  ratings: number;
  department?: string;
  images: Image[];
  category: string;
  Stock: number;
  numOfReviews: number;
  reviews: typeof reviewSchema[];
  user?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const productSchema: Schema<Product> = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, maxLength: 8 },
  info: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  department: { type: String },
  images: [{
    product_id: { type: String, required: true },
    url: { type: String, required: true },
  }],
  category: { type: String, required: true },
  Stock: { type: Number, required: true, maxLength: 4, default: 1 },
  numOfReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

const ProductModel = mongoose.model<Product>('product', productSchema);
export default ProductModel;