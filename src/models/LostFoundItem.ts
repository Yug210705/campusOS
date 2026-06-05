import mongoose, { Schema, Document } from 'mongoose';

export interface ILostFoundItem extends Document {
  title: string;
  description: string;
  location: string;
  time: string;
  image: string;
  status: 'lost' | 'found';
  reporter: string;
  createdAt: Date;
}

const LostFoundItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true, default: 'Just now' },
  image: { type: String, required: true },
  status: { type: String, enum: ['lost', 'found'], required: true },
  reporter: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.LostFoundItem || mongoose.model<ILostFoundItem>('LostFoundItem', LostFoundItemSchema);
