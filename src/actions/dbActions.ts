"use server";

import connectToDatabase from '@/lib/mongodb';
import LostFoundItem from '@/models/LostFoundItem';
import User from '@/models/User';
import Facility from '@/models/Facility';
import ExchangeItem from '@/models/ExchangeItem';
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
      confidenceAvg: "0.0 / 5.0",
      confidenceSubtitle: "0% known (0 reviewed)",
      conceptsMastered: "0 Topics",
      conceptsSubtitle: "Across 0 subjects",
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
       rollNumber: "24UCS082",
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
        streakSubtitle: "",
        placementPercent: "85%",
        placementTrack: "SDE Track",
        confidenceAvg: "4.2 / 5.0",
        confidenceSubtitle: "83% known (142 reviewed)",
        conceptsMastered: "142 Topics",
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
  try {
    if (!process.env.MONGODB_URI) {
      const newItem = {
        _id: "lf_mock_" + Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        contactNumber: formData.contactNumber,
        image: formData.image,
        status: formData.status,
        reporter: formData.reporter || "Yug Pathak",
        time: "Just now",
        createdAt: new Date().toISOString()
      };
      return newItem;
    }
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
    revalidatePath('/connect/lost-found');
    return JSON.parse(JSON.stringify(newItem));
  } catch (err) {
    console.warn("DB connection failed, falling back to mock reportItem:", err);
    return {
      _id: "lf_mock_" + Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      contactNumber: formData.contactNumber,
      image: formData.image,
      status: formData.status,
      reporter: formData.reporter || "Yug Pathak",
      time: "Just now",
      createdAt: new Date().toISOString()
    };
  }
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

// Exchange Actions
export async function getExchangeItems(category?: string, query?: string, isGuest: boolean = false) {
  if (isGuest) {
    const mockExchange = [
      {
        _id: "e1",
        title: "Scientific Calculator (Casio)",
        description: "Casio fx-991EX ClassWiz in perfect condition. Used for 1 semester only.",
        price: 600,
        category: "Academic",
        location: "Block B, Room 402",
        contactNumber: "9876543210",
        image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop",
        sellerName: "Aarav Sharma",
        createdAt: new Date().toISOString(),
        isAvailable: true
      },
      {
        _id: "e2",
        title: "Lab Coat (Medium)",
        description: "White cotton lab coat, size M. No stains, freshly washed.",
        price: 150,
        category: "Academic",
        location: "Block A, Room 102",
        contactNumber: "9876543211",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
        sellerName: "Yug Pathak",
        createdAt: new Date().toISOString(),
        isAvailable: true
      },
      {
        _id: "e3",
        title: "Hero Cycle (21-Speed)",
        description: "Mountain bike, dual disc brakes, front suspension. Perfect for campus commuting.",
        price: 3500,
        category: "Cycles",
        location: "Cycle Stand B",
        contactNumber: "9876543212",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop",
        sellerName: "Rohan Sen",
        createdAt: new Date().toISOString(),
        isAvailable: true
      },
      {
        _id: "e4",
        title: "Electric Kettle (Pigeon 1.5L)",
        description: "Heats water in under 2 minutes. Automatic cut-off. Working perfectly.",
        price: 400,
        category: "Hostel",
        location: "Block C, Room 304",
        contactNumber: "9876543213",
        image: "/artifacts/kettle.png",
        sellerName: "Meera Nair",
        createdAt: new Date().toISOString(),
        isAvailable: true
      }
    ];

    let filtered = mockExchange;
    if (category && category !== "All") {
      filtered = filtered.filter(item => item.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }

  await connectToDatabase();
  const filter: any = {};
  if (category && category !== "All") {
    filter.category = category;
  }
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  const items = await ExchangeItem.find(filter).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function getExchangeItemById(id: string, isGuest: boolean = false) {
  if (isGuest || id.startsWith("e")) {
    const mockExchange = [
      {
        _id: "e1",
        title: "Scientific Calculator (Casio)",
        description: "Casio fx-991EX ClassWiz in perfect condition. Used for 1 semester only.",
        price: 600,
        category: "Academic",
        location: "Block B, Room 402",
        contactNumber: "9876543210",
        image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop",
        sellerName: "Aarav Sharma",
        createdAt: new Date().toISOString(),
        isAvailable: true
      },
      {
        _id: "e2",
        title: "Lab Coat (Medium)",
        description: "White cotton lab coat, size M. No stains, freshly washed.",
        price: 150,
        category: "Academic",
        location: "Block A, Room 102",
        contactNumber: "9876543211",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
        sellerName: "Yug Pathak",
        createdAt: new Date().toISOString(),
        isAvailable: true
      },
      {
        _id: "e3",
        title: "Hero Cycle (21-Speed)",
        description: "Mountain bike, dual disc brakes, front suspension. Perfect for campus commuting.",
        price: 3500,
        category: "Cycles",
        location: "Cycle Stand B",
        contactNumber: "9876543212",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop",
        sellerName: "Rohan Sen",
        createdAt: new Date().toISOString(),
        isAvailable: true
      },
      {
        _id: "e4",
        title: "Electric Kettle (Pigeon 1.5L)",
        description: "Heats water in under 2 minutes. Automatic cut-off. Working perfectly.",
        price: 400,
        category: "Hostel",
        location: "Block C, Room 304",
        contactNumber: "9876543213",
        image: "/artifacts/kettle.png",
        sellerName: "Meera Nair",
        createdAt: new Date().toISOString(),
        isAvailable: true
      }
    ];
    const found = mockExchange.find(item => item._id === id);
    return found || null;
  }

  await connectToDatabase();
  const item = await ExchangeItem.findById(id).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createExchangeItem(formData: any) {
  try {
    if (!process.env.MONGODB_URI) {
      const newItem = {
        _id: "e_mock_" + Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        location: formData.location,
        contactNumber: formData.contactNumber,
        image: formData.image,
        sellerName: formData.sellerName || "Yug Pathak",
        createdAt: new Date().toISOString()
      };
      return newItem;
    }
    await connectToDatabase();
    const newItem = new ExchangeItem({
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      location: formData.location,
      contactNumber: formData.contactNumber,
      image: formData.image,
      sellerName: formData.sellerName || "Yug Pathak",
    });
    await newItem.save();
    revalidatePath('/connect/exchange');
    return JSON.parse(JSON.stringify(newItem));
  } catch (err) {
    console.warn("DB connection failed, falling back to mock createExchangeItem:", err);
    return {
      _id: "e_mock_" + Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      location: formData.location,
      contactNumber: formData.contactNumber,
      image: formData.image,
      sellerName: formData.sellerName || "Yug Pathak",
      createdAt: new Date().toISOString()
    };
  }
}

export async function getLostFoundItemById(id: string, isGuest: boolean = false) {
  if (isGuest || !isNaN(Number(id)) || id.length < 10) {
    const mockItems = [
      { _id: "1", title: "Keys with Red Lanyard", description: "Lost a set of 3 keys on a bright red campus lanyard.", location: "Near CS Block Entry", image: "/artifacts/keys_lost_1780654867355.png", status: "lost", reporter: "Yug Pathak", time: "2 hours ago" },
      { _id: "2", title: "Black Leather Notebook", description: "Contains all my Operating Systems notes! Very urgent.", location: "Library 2nd Floor", image: "/artifacts/notebook_lost_1780654900684.png", status: "lost", reporter: "Aarav Sharma", time: "Yesterday, 4:30 PM" },
      { _id: "3", title: "AirPods Pro Case", description: "Found an open AirPods case on the reading tables.", location: "Central Library", image: "/artifacts/airpods_found_1780654879538.png", status: "found", reporter: "Security Desk", time: "30 mins ago" }
    ];
    return mockItems.find(i => i._id === id) || null;
  }

  await connectToDatabase();
  const item = await LostFoundItem.findById(id).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function resolveLostFoundItem(id: string) {
  try {
    if (!process.env.MONGODB_URI) {
      return { success: true };
    }
    await connectToDatabase();
    await LostFoundItem.findByIdAndDelete(id);
    revalidatePath('/connect/lost-found');
    return { success: true };
  } catch (err) {
    console.warn("DB connection failed, falling back to mock resolveLostFoundItem:", err);
    return { success: true };
  }
}
