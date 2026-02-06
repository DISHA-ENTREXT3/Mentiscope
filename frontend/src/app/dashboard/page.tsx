"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!auth || !db) {
      console.warn("Firebase not initialized");
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const studentsRef = collection(db!, "students");
        const q = query(studentsRef, where("parent_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const firstStudent = querySnapshot.docs[0];
          router.push(`/dashboard/${firstStudent.id}`);
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
