"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Chrome, Github, Terminal, Sparkles, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      console.error("Firebase not initialized");
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User logged in:", result.user);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error logging in:", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
      </motion.button>

      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(135,255,200,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(255,100,200,0.05)_0%,transparent_50%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="glass border-none rounded-[4rem] p-12 md:p-20 space-y-12 relative overflow-hidden">
           {/* Animated Glow Border Placeholder */}
           <div className="absolute inset-0 border-2 border-primary/20 rounded-[4rem] pointer-events-none animate-pulse" />
           
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
                 <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Neural Uplink</h1>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Establish secure connection to growth mainframe.</p>
              </div>
           </div>

           <div className="space-y-6">
              <Button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-20 bg-white text-black hover:bg-slate-100 rounded-3xl text-lg font-black transition-all flex items-center justify-center gap-4 group"
              >
                 <Chrome className="w-6 h-6" />
                 {loading ? "Syncing..." : "Sync with Google"}
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex items-center gap-4 py-4">
                 <div className="h-px bg-white/5 flex-1" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Protocol Selection</span>
                 <div className="h-px bg-white/5 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Button variant="ghost" className="h-16 px-4 bg-white/5 border border-white/5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:text-white transition-all">
                    <Terminal className="w-4 h-4 mr-2" /> Neural ID
                 </Button>
                 <Button variant="ghost" className="h-16 px-4 bg-white/5 border border-white/5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:text-white transition-all">
                    <Github className="w-4 h-4 mr-2" /> Github Ops
                 </Button>
              </div>
           </div>

           <div className="pt-8 text-center space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                New to the architecture? <Link href="/signup" className="text-primary hover:underline">Init Profile</Link>
              </p>
              <div className="flex items-center justify-center gap-2 text-slate-700">
                 <Sparkles className="w-3 h-3" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Secure Quantum Encryption Active</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
