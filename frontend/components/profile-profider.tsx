"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  nom: string;
  setNom: (nom: string) => void;
  prenom: string;
  setPrenom: (prenom: string) => void;
  refreshProfile: () => void;
  profileVersion: number;
  setUserNames: (nom: string, prenom: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [profileVersion, setProfileVersion] = useState(0);

  const refreshProfile = useCallback(() => {
    setProfileVersion((prev) => prev + 1);
  }, []);

  const setUserNames = useCallback((newNom: string, newPrenom: string) => {
    setNom(newNom);
    setPrenom(newPrenom);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profileImage,
        setProfileImage,
        nom,
        setNom,
        prenom,
        setPrenom,
        refreshProfile,
        profileVersion,
        setUserNames,
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
