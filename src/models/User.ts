import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  rollNumber: string;
  major: string;
  classYear: string;
  cgpa: string;
  totalCredits: number;
  maxCredits: number;
  accommodation: {
    hostel: string;
    dietaryPreference: string;
  };
  currentSemester: string;
  wifiDevicesRegistered: number;
  wifiDevicesMax: number;
  profileImage: string;
  learningStats: {
    revisionStreak: string;
    streakSubtitle: string;
    placementPercent: string;
    placementTrack: string;
    confidenceAvg: string;
    confidenceSubtitle: string;
    conceptsMastered: string;
    conceptsSubtitle: string;
    studyTime: string;
    studyTimeSubtitle: string;
  };
}

const UserSchema: Schema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  major: { type: String, required: true, default: "B.Tech Computer Science" },
  classYear: { type: String, required: true, default: "Class of '27" },
  cgpa: { type: String, required: true, default: "N/A" },
  totalCredits: { type: Number, required: true, default: 0 },
  maxCredits: { type: Number, required: true, default: 160 },
  accommodation: {
    hostel: { type: String, required: true, default: "Not Assigned" },
    dietaryPreference: { type: String, required: true, default: "None" },
  },
  currentSemester: { type: String, required: true, default: "1st Semester" },
  wifiDevicesRegistered: { type: Number, required: true, default: 0 },
  wifiDevicesMax: { type: Number, required: true, default: 3 },
  profileImage: { type: String, default: '' },
  learningStats: {
    revisionStreak: { type: String, required: true, default: "0 Days" },
    streakSubtitle: { type: String, required: true, default: "Just getting started" },
    placementPercent: { type: String, required: true, default: "0%" },
    placementTrack: { type: String, required: true, default: "Not Set" },
    confidenceAvg: { type: String, required: true, default: "0.0" },
    confidenceSubtitle: { type: String, required: true, default: "No data yet" },
    conceptsMastered: { type: String, required: true, default: "0" },
    conceptsSubtitle: { type: String, required: true, default: "Start studying!" },
    studyTime: { type: String, required: true, default: "0h" },
    studyTimeSubtitle: { type: String, required: true, default: "Past 7 days" },
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
