"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  profileImage: string | null;
  setProfileImage: (url: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profileImage, setProfileImageState] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem("campusos_profile_image");
    if (savedImage) {
      setProfileImageState(savedImage);
    }
  }, []);

  const setProfileImage = (url: string | null) => {
    setProfileImageState(url);
    if (url) {
      localStorage.setItem("campusos_profile_image", url);
    } else {
      localStorage.removeItem("campusos_profile_image");
    }
  };

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
