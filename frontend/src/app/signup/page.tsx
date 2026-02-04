"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Chrome, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed up:", result.user);
      router.push("/onboarding");
    } catch (error: unknown) {
      console.error("Error signing up:", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_30%,rgba(135,255,200,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_70%,rgba(255,100,200,0.05)_0%,transparent_50%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="glass border-none rounded-[4rem] p-12 md:p-20 space-y-12 relative overflow-hidden">
           <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
           
           <div className="text-center space-y-8">
              <Link href="/" className="inline-flex items-center gap-3 font-black text-3xl tracking-tighter group">
                 <div className="relative w-10 h-10 group-hover:rotate-12 transition-all">
                   <Image 
                     src="/mentiscope-logo.png" 
                     alt="Mentiscope Logo" 
                     width={40} 
                     height={40} 
                     className="object-contain" 
                   />
                 </div>
                 <span className="text-gradient">MENTI<span className="text-primary">SCOPE</span></span>
              </Link>
              <div className="space-y-3">
                 <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Initialize Profile</h1>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Become an architect of your child&apos;s development.</p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                 <Button 
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="w-full h-20 bg-white text-black hover:bg-slate-100 rounded-3xl text-lg font-black transition-all flex items-center justify-center gap-4 group shadow-2xl"
                 >
                    <Chrome className="w-6 h-6" />
                    {loading ? "Registering..." : "Register with Google"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pb-4">
                 <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <ShieldCheck className="w-5 h-5 text-primary" /> End-to-End Encryption
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <Zap className="w-5 h-5 text-accent" /> High-Velocity Sync
                 </div>
              </div>
           </div>

           <div className="pt-8 text-center space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                Already part of the protocol? <Link href="/login" className="text-primary hover:underline">Establish Uplink</Link>
              </p>
              <div className="flex items-center justify-center gap-2 text-slate-700">
                 <Sparkles className="w-3 h-3" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Growth Intelligence Architecture v2.0</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
