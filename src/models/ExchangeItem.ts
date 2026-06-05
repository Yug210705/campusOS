import mongoose, { Schema, Document } from 'mongoose';

export interface IExchangeItem extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  contactNumber: string;
  image: string;
  sellerName: string;
  isAvailable: boolean;
  createdAt: Date;
}

const ExchangeItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  image: { type: String, required: true },
  sellerName: { type: String, required: true, default: 'Yug Pathak' },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ExchangeItem || mongoose.model<IExchangeItem>('ExchangeItem', ExchangeItemSchema);
