'use client';
import { useEffect } from "react";
import { getStoredToken, getStoredUser } from "@/components/auth-provider";

export default function ChatRedirect() {

  useEffect(() => {
    // STEP 1: Get token and user directly from localStorage
    const token = getStoredToken();
    const user = getStoredUser();

    if (!user || !token) {
      console.error("Missing user or token");
      return; // Guard clause
    }

    console.log("User from localStorage:", user);
    console.log("Token from localStorage:", token);

    // STEP 2: Send token in headers (GET request)
    fetch(`http://localhost:3002/api/auth?userId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.ok) {
          // STEP 3: Redirect with user ID
          window.open(
            `http://localhost:3002/app?userId=${user.id}`,
            '_blank',
            'noopener,noreferrer' // Security best practice for new windows
          );
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []); // Empty dependency array = runs once on mount

  return <p>Redirecting to chat...</p>;
}

function useAuth(): { user: any; token: any; } {
  throw new Error("Function not implemented.");
}
