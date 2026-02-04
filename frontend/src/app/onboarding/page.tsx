"use client";

import OnboardingForm from "@/components/onboarding-form";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-accent/5 rounded-full blur-[180px]" />
      </div>

      <div className="w-full max-w-5xl z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
           <h1 className="text-6xl md:text-8xl font-black text-gradient tracking-tighter uppercase leading-[0.85]">Init Neural <br />Protocol</h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Calibration Step: 01 — Baseline Discovery</p>
        </motion.div>
        
        <OnboardingForm />
      </div>
    </div>
  );
}
