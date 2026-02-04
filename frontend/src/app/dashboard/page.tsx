"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // In a real app, you would fetch students from your backend
      // For now, we'll try to find any student associated with this user
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) {
          console.error("API URL not configured");
          router.push("/onboarding");
          return;
        }
        
        const response = await fetch(`${baseUrl}/students?parent_id=${user.uid}`);
        const students = await response.json();
        
        if (students && students.length > 0) {
          router.push(`/dashboard/${students[0].id}`);
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        router.push("/onboarding");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Protocol...</p>
    </div>
  );
}
