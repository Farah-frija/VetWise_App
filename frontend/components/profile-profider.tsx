"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  refreshProfile: () => void;
  profileVersion: number;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileVersion, setProfileVersion] = useState(0);

  const refreshProfile = useCallback(() => {
    setProfileVersion((prev) => prev + 1);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profileImage,
        setProfileImage,
        refreshProfile,
        profileVersion,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
