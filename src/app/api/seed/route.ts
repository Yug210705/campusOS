import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import LostFoundItem from '@/models/LostFoundItem';
import Facility from '@/models/Facility';
import ExchangeItem from '@/models/ExchangeItem';

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data
    await User.deleteMany({});
    await LostFoundItem.deleteMany({});
    await Facility.deleteMany({});
    await ExchangeItem.deleteMany({});

    // Seed User
    await User.create({
      name: "Yug Pathak",
      rollNumber: "2023CS0142",
      major: "B.Tech Computer Science",
      classYear: "Class of '27",
      cgpa: "9.24",
      totalCredits: 124,
      maxCredits: 160,
      accommodation: {
        hostel: "Block B, Room 402",
        dietaryPreference: "Pure Vegetarian"
      },
      currentSemester: "6th Semester",
      wifiDevicesRegistered: 2,
      wifiDevicesMax: 3,
      profileImage: "",
      learningStats: {
        revisionStreak: "12 Days",
        streakSubtitle: "",
        placementPercent: "68%",
        placementTrack: "Software Eng.",
        confidenceAvg: "8.4",
        confidenceSubtitle: "Avg across 5 subjects",
        conceptsMastered: "142",
        conceptsSubtitle: "Mastered this week",
        studyTime: "14h",
        studyTimeSubtitle: "Past 7 days"
      }
    });

    // Seed Lost & Found
    await LostFoundItem.insertMany([
      {
        title: "Keys with Red Lanyard",
        description: "Lost a set of 3 keys on a bright red campus lanyard.",
        location: "Near CS Block Entry",
        time: "2 hours ago",
        image: "/artifacts/keys_lost_1780654867355.png",
        status: "lost",
        reporter: "Yug Pathak",
      },
      {
        title: "Black Leather Notebook",
        description: "Contains all my Operating Systems notes! Very urgent.",
        location: "Library 2nd Floor",
        time: "Yesterday, 4:30 PM",
        image: "/artifacts/notebook_lost_1780654900684.png",
        status: "lost",
        reporter: "Aarav Sharma",
      },
      {
        title: "AirPods Pro Case",
        description: "Found an open AirPods case on the reading tables.",
        location: "Central Library",
        time: "30 mins ago",
        image: "/artifacts/airpods_found_1780654879538.png",
        status: "found",
        reporter: "Security Desk",
      }
    ]);

    // Seed Exchange Items
    await ExchangeItem.insertMany([
      {
        title: "Scientific Calculator (Casio)",
        description: "Casio fx-991EX ClassWiz in perfect condition. Used for 1 semester only.",
        price: 600,
        category: "Academic",
        location: "Block B, Room 402",
        contactNumber: "9876543210",
        image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop",
        sellerName: "Aarav Sharma",
      },
      {
        title: "Lab Coat (Medium)",
        description: "White cotton lab coat, size M. No stains, freshly washed.",
        price: 150,
        category: "Academic",
        location: "Block A, Room 102",
        contactNumber: "9876543211",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
        sellerName: "Yug Pathak",
      },
      {
        title: "Hero Cycle (21-Speed)",
        description: "Mountain bike, dual disc brakes, front suspension. Perfect for campus commuting.",
        price: 3500,
        category: "Cycles",
        location: "Cycle Stand B",
        contactNumber: "9876543212",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop",
        sellerName: "Rohan Sen",
      },
      {
        title: "Electric Kettle (Pigeon 1.5L)",
        description: "Heats water in under 2 minutes. Automatic cut-off. Working perfectly.",
        price: 400,
        category: "Hostel Essentials",
        location: "Block C, Room 304",
        contactNumber: "9876543213",
        image: "/artifacts/kettle.png",
        sellerName: "Meera Nair",
        isAvailable: true
      }
    ]);

    // Seed Facilities
    await Facility.insertMany([
      {
        name: "Main Gym",
        type: "gym",
        status: "Packed",
        capacityPercent: 92,
        currentCount: 138,
        maxCount: 150,
        trend: "up"
      },
      {
        name: "Central Library",
        type: "library",
        status: "Optimal",
        capacityPercent: 45,
        currentCount: 450,
        maxCount: 1000,
        trend: "steady"
      },
      {
        name: "Dining Hall B",
        type: "mess",
        status: "Serving Dinner",
        capacityPercent: 60,
        details: {
          menu: [
            { id: 1, name: "Paneer Butter Masala", isVeg: true, isSpicy: false },
            { id: 2, name: "Dal Makhani", isVeg: true, isSpicy: false },
            { id: 3, name: "Chicken Tikka", isVeg: false, isSpicy: true },
            { id: 4, name: "Gulab Jamun", isVeg: true, isSpicy: false },
          ]
        }
      },
      {
        name: "Campus Shuttle",
        type: "bus",
        status: "Next in 5m",
        details: {
          schedule: [
            { id: 1, route: "Hostel -> Academic Block", time: "10:15 AM", status: "On Time" },
            { id: 2, route: "Academic Block -> Library", time: "10:30 AM", status: "Delayed 5m" },
            { id: 3, route: "Library -> Main Gate", time: "10:45 AM", status: "On Time" },
          ]
        }
      }
    ]);

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
