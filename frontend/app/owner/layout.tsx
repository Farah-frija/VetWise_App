"use client";
import type React from "react";
import { useAuth, UserRole } from "@/components/auth-provider"; // Import UserRole
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Cat,
  Home,
  Heart,
  Calendar,
  MessageCircle,
  User,
  LogOut,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiRequest } from "@/components/auth-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import { useState } from "react";
import { useProfile } from "@/components/profile-profider";

const menuItems = [
  {
    title: "Dashboard",
    url: "/owner/dashboard",
    icon: Home,
  },
  {
    title: "My Pets",
    url: "/owner/pets",
    icon: Heart,
  },
  {
    title: "Appointments",
    url: "/owner/appointments",
    icon: Calendar,
  },
  {
    title: "Chat",
    url: "/owner/chat",
    icon: MessageCircle,
  },
  {
    title: "Profile",
    url: "/owner/profile",
    icon: User,
  },
];

function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/owner/dashboard"
          className="flex items-center space-x-2 px-2 py-1"
        >
          <Cat className="h-8 w-8 text-violet-600" />
          <span className="text-2xl font-bold text-violet-600">VetCat</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// Profile Image Component
function ProfileImage({
  src,
  alt,
  loading,
  className = "w-8 h-8 rounded-full object-cover",
}: {
  src: string | null;
  alt: string;
  loading: boolean;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
      >
        <User className="h-4 w-4 text-gray-400" />
      </div>
    );
  }

  if (!src || imageError) {
    return (
      <div
        className={`${className} bg-violet-100 flex items-center justify-center`}
      >
        <User className="h-4 w-4 text-violet-600" />
      </div>
    );
  }

  // Handle different image formats
  const getImageSrc = (imageSrc: string) => {
    // If it's already a complete URL, use it as is
    if (
      imageSrc.startsWith("http://") ||
      imageSrc.startsWith("https://") ||
      imageSrc.startsWith("data:")
    ) {
      return imageSrc;
    }

    // If it's a file path, return as is (the backend should serve it properly)
    return imageSrc;
  };

  return (
    <img
      src={getImageSrc(src)}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isLoading } = useAuth(); // Add token and isLoading
  const router = useRouter();
  const { request } = useApiRequest();
  const {
    profileImage,
    setProfileImage,
    nom,
    prenom,
    setUserNames,
    profileVersion,
  } = useProfile(); // Use context for names
  const [profileLoading, setProfileLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || !token) {
        setProfileLoading(false);
        return;
      }

      try {
        const response: Response = await request(
          `/utilisateurs/profile/${user.id}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const userData = await response.json();

          // Update context with user names
          setUserNames(userData.nom || "", userData.prenom || "");

          if (userData.image) {
            setProfileImage(userData.image);
          } else {
            setProfileImage(null);
          }
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
        setProfileImage(null);
        setUserNames("", ""); // Reset names on error
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [user, token, request, profileVersion, setProfileImage, setUserNames]); // Add setUserNames to dependencies

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // Check if user is authenticated and has correct role
    if (!user || !token || user.role !== UserRole.PET_OWNER) {
      console.log(
        "Redirecting to login - user:",
        user,
        "token:",
        !!token,
        "role:",
        user?.role
      );
      router.push("/login");
    }
  }, [user, token, isLoading, router]); // Add token and isLoading to dependencies

  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!user || !token || user.role !== UserRole.PET_OWNER) {
    return null;
  }

  // Use context values for display, fallback to user object if context not loaded yet
  const displayPrenom = prenom || user.prenom;
  const displayNom = nom || user.nom;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center gap-2 px-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input type="text" placeholder="Search..." className="pl-10" />
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <ProfileImage
                src={profileImage}
                alt={`${displayPrenom} ${displayNom}'s profile`}
                loading={profileLoading}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div>
                Welcome, {displayPrenom} {displayNom}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Suspense>{children}</Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
