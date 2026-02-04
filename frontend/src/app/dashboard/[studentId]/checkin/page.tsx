"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Terminal } from "lucide-react";
import WeeklyCheckinForm from "@/components/weekly-checkin-form";

export default function CheckinPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;

  return (
    <div className="min-h-screen bg-background pb-32 pt-16 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href={`/dashboard/${studentId}`} className="group inline-flex items-center text-slate-500 hover:text-primary transition-all font-black uppercase text-[10px] tracking-[0.3em] mb-4">
             <div className="mr-4 p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
               <ChevronLeft className="w-5 h-5" />
             </div>
             Back to Intelligence Hub
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
             <Terminal className="w-4 h-4" />
             <span>Neural Reflection Sync</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85]">Pulse <br className="hidden md:block" />Calibration.</h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">Sync the week&apos;s behavioral spectrum to recalibrate growth trajectories.</p>
        </motion.div>
        
        <WeeklyCheckinForm studentId={studentId} />
      </div>
    </div>
  );
}
