"use client";

import { motion } from "framer-motion";
import { Brain, ChevronLeft, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#030712] selection:bg-primary selection:text-black pt-32 pb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-[2rem] border border-white/5 backdrop-blur-2xl">
          <button onClick={() => router.back()} className="flex items-center gap-3 group text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return
          </button>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">Mentiscope</span>
          </Link>
          <div className="w-20 hidden md:block" />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </motion.button>

        <div className="space-y-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-primary/20"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Legal Protocol</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
          >
            {title}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 md:p-20 rounded-[4rem] border border-white/5 prose prose-invert prose-2xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-slate-400 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-400"
        >
          {children}
        </motion.div>

        <div className="text-center pt-8">
          <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">
            Mentiscope Architecture &copy; 2026 • Encrypted Legal Baseline
          </p>
        </div>
      </div>
    </div>
  );
}
