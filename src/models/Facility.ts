import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  type: 'gym' | 'library' | 'mess' | 'bus';
  status: string; // e.g. "Optimal", "Packed", "Departing soon"
  capacityPercent?: number;
  currentCount?: number;
  maxCount?: number;
  trend?: 'up' | 'down' | 'steady';
  details?: any; // To hold specific arrays like bus schedules or menus
}

const FacilitySchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['gym', 'library', 'mess', 'bus'], required: true },
  status: { type: String, required: true },
  capacityPercent: { type: Number },
  currentCount: { type: Number },
  maxCount: { type: Number },
  trend: { type: String, enum: ['up', 'down', 'steady'] },
  details: { type: Schema.Types.Mixed },
});

export default mongoose.models.Facility || mongoose.model<IFacility>('Facility', FacilitySchema);
