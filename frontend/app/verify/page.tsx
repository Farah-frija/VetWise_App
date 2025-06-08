'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/components/auth-provider";

export default function ChatRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handlePaymentVerification = async () => {
      // Parse URL query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const success = searchParams.get('success');
      const paymentId = searchParams.get('payment_id');

      if (!paymentId) {
        router.push('/owner/appointments?error=missing_payment_id');
        return;
      }

      try {
        const token = getStoredToken();
        if (!token) throw new Error('No authentication token found');

        const endpoint = success === 'true' 
          ? `payments/${paymentId}/success` 
          : `payments/${paymentId}/fail`;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Payment status update failed');

        // Redirect with success status and payment ID
        router.push(`/owner/appointments?success=${success}&paymentId=${paymentId}`);
        
      } catch (error) {
        console.error('Payment verification error:', error);
        router.push(`/owner/appointments?error=payment_verification_failed`);
      }
    };

    handlePaymentVerification();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Processing payment verification...</p>
    </div>
  );
}

