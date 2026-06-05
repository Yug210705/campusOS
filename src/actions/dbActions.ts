"use server";

import connectToDatabase from '@/lib/mongodb';
import LostFoundItem from '@/models/LostFoundItem';
import User from '@/models/User';
import Facility from '@/models/Facility';
import { revalidatePath } from 'next/cache';

// User Actions
export async function registerUser(firebaseUid: string, email: string, name: string, rollNumber: string) {
  await connectToDatabase();
  const newUser = new User({
    firebaseUid,
    email,
    name,
    rollNumber,
    major: "B.Tech Computer Science",
    classYear: "Class of '27",
    cgpa: "N/A",
    totalCredits: 0,
    maxCredits: 160,
    currentSemester: "1st Semester",
    wifiDevicesRegistered: 0,
    wifiDevicesMax: 3,
    accommodation: {
      hostel: "Not Assigned",
      dietaryPreference: "None",
    },
    learningStats: {
      revisionStreak: "0 Days",
      streakSubtitle: "Just getting started",
      placementPercent: "0%",
      placementTrack: "Not Set",
      confidenceAvg: "0.0",
      confidenceSubtitle: "No data yet",
      conceptsMastered: "0",
      conceptsSubtitle: "Start studying!",
      studyTime: "0h",
      studyTimeSubtitle: "Past 7 days",
    }
  });
  await newUser.save();
  return JSON.parse(JSON.stringify(newUser));
}

export async function getUserProfile(firebaseUid: string, isGuest: boolean = false) {
  if (isGuest) {
    return {
      name: "Guest User",
      rollNumber: "GST-2026",
      major: "B.Tech Computer Science",
      classYear: "Class of '27",
      cgpa: "9.24",
      totalCredits: 112,
      maxCredits: 160,
      currentSemester: "6th Semester",
      wifiDevicesRegistered: 2,
      wifiDevicesMax: 3,
      accommodation: {
        hostel: "Block B, Room 402",
        dietaryPreference: "Vegetarian",
      },
      learningStats: {
        revisionStreak: "12 Days",
        streakSubtitle: "Top 5% of class",
        placementPercent: "85%",
        placementTrack: "SDE Track",
        confidenceAvg: "4.2",
        confidenceSubtitle: "Very High",
        conceptsMastered: "142",
        conceptsSubtitle: "Across 6 subjects",
        studyTime: "24h",
        studyTimeSubtitle: "Past 7 days",
      }
    };
  }

  await connectToDatabase();
  let user = await User.findOne({ firebaseUid }).lean();
  
  // Auto-repair missing profiles
  if (!user) {
    console.log("Profile missing. Auto-repairing for:", firebaseUid);
    user = await registerUser(
      firebaseUid, 
      "recovered@campus.app", 
      "Campus Student", 
      "REC-" + Math.floor(Math.random() * 10000)
    );
  }
  
  return JSON.parse(JSON.stringify(user));
}

// Lost & Found Actions
export async function getLostFoundItems(status: 'lost' | 'found', isGuest: boolean = false) {
  if (isGuest) {
    const mockItems = [
      { _id: "1", title: "Apple AirPods Pro", description: "Found near the library cafe.", location: "Library Cafe", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=200&auto=format&fit=crop", status: "found", reporter: "Admin", time: "2 hours ago" },
      { _id: "2", title: "Blue Water Bottle", description: "Lost my Milton bottle during PE.", location: "Sports Complex", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=200&auto=format&fit=crop", status: "lost", reporter: "Student", time: "5 hours ago" },
      { _id: "3", title: "MacBook Charger", description: "Left it in the study room.", location: "Study Room B", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200&auto=format&fit=crop", status: "lost", reporter: "Student", time: "1 day ago" },
    ];
    return mockItems.filter(i => i.status === status);
  }

  await connectToDatabase();
  const items = await LostFoundItem.find({ status }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function reportItem(formData: any) {
  await connectToDatabase();
  const newItem = new LostFoundItem({
    title: formData.title,
    description: formData.description,
    location: formData.location,
    image: formData.image,
    status: formData.status,
    reporter: formData.reporter,
    time: "Just now",
  });
  await newItem.save();
  revalidatePath('/lost-and-found');
  return JSON.parse(JSON.stringify(newItem));
}

// Facility Actions
export async function getCampusFacilities(isGuest: boolean = false) {
  if (isGuest) {
    return [
      { _id: "1", name: "Central Library", status: "Open", time: "until 11:00 PM", icon: "book" },
      { _id: "2", name: "Sports Complex", status: "Busy", time: "Closes at 9:00 PM", icon: "activity" },
      { _id: "3", name: "Main Cafeteria", status: "Open", time: "until 10:00 PM", icon: "coffee" }
    ];
  }

  await connectToDatabase();
  const facilities = await Facility.find({}).lean();
  return JSON.parse(JSON.stringify(facilities));
}
