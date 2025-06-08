import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ProfileProvider } from "@/components/profile-profider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VetCat - 24/7 Online Veterinary Care",
  description:
    "Connect with licensed veterinarians for your pet's health needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
