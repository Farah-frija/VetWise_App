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

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isLoading } = useAuth(); // Add token and isLoading
  const router = useRouter();

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
            {/* Fix: Use prenom instead of name */}
            <div className="text-sm text-gray-600">
              Welcome, {user.prenom} {user.nom}
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
