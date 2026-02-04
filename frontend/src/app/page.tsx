"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { SubscribeSection } from "@/components/subscribe-section";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturesSection } from "@/components/features-section";
import { FAQSection } from "@/components/faq-section";
import { SupportChatbot } from "@/components/support-chatbot";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-[2rem] border border-white/5 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">Mentiscope</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="#how-it-works" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Protocol</Link>
            <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Systems</Link>
            <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Intelligence</Link>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-6">
                <Link 
                  href="/dashboard"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline"
                >
                  Neural Deck
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all"
                >
                  Log Off
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login"
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-primary transition-colors pr-4"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="bg-primary text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(135,255,200,0.3)]"
                >
                  Join Sync
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center lg:text-left lg:items-start lg:flex-row gap-20">
          <div className="flex-1 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural Intelligence Platform v1.0</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl"
            >
              Understand <br />
              Learning <br />
              <span className="text-gradient">Beyond Grades</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed"
            >
              AI-powered architecture that decodes your child&apos;s learning patterns, habits, and well-being—catalyzing growth before obstacles appear.
            </motion.p>

            {/* In-Hero Subscribe Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <SubscribeSection variant="hero" />
              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-[#030712] overflow-hidden bg-white/5 relative">
                      <Image 
                        src={`https://images.pexels.com/photos/${6393340 + i}/pexels-photo-${6393340 + i}.jpeg`}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="text-white">12K+ PARENTS</span> SYNCED IN ARCHITECTURE
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="flex-1 w-full max-w-2xl relative"
          >
            <div className="glass rounded-[4rem] p-12 border border-white/10 aspect-square flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-[4rem] blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
              <Image 
                src="/mentiscope-logo.png" 
                alt="Mentiscope Neural Engine" 
                width={500} 
                height={500}
                className="relative z-10 w-full h-auto drop-shadow-[0_0_50px_rgba(135,255,200,0.4)]"
              />
              
              {/* Floating Data Nodes */}
              <div className="absolute -top-10 -right-10 glass p-6 rounded-3xl border border-white/20 animate-float">
                <Zap className="w-8 h-8 text-primary mb-2" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Active Scan</p>
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl border border-white/20 animate-float [animation-delay:2s]">
                <Shield className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Safe Protocols</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Sections */}
      <HowItWorks />
      <FeaturesSection />
      
      {/* Blog Teaser / CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto glass p-16 rounded-[4rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Growth <span className="text-gradient">Intelligence</span>.</h3>
            <p className="text-slate-500 font-medium">Explore 40+ educational research blogs and neural growth strategies.</p>
          </div>
          <Link 
            href="/blog"
            className="group/btn relative px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-3 hover:bg-primary transition-all overflow-hidden"
          >
            <span className="relative z-10">Access Archive</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform relative z-10" />
          </Link>
        </div>
      </section>

      <FAQSection />

      {/* Footer Subscribe */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SubscribeSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-2xl font-black text-white uppercase tracking-tighter">Mentiscope</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              Decoding human potential through neural intelligence and educational precision.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-xs tracking-widest">Protocol</h4>
            <ul className="space-y-4">
              <li><Link href="#how-it-works" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Architecture</Link></li>
              <li><Link href="#features" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Systems</Link></li>
              <li><Link href="/pricing" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Neural Plans</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-xs tracking-widest">Intelligence</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Research Blog</Link></li>
              <li><Link href="#faq" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Support FAQ</Link></li>
              <li><a href="https://www.entrext.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">About Entrext</a></li>
              <li><a href="mailto:business@entrext.in" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Contact Uplink</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-xs tracking-widest">Entity</h4>
            <ul className="space-y-4">
              <li className="text-slate-500 text-sm font-medium">© 2026 Mentiscope Architecture</li>
              <li className="text-slate-500 text-sm font-medium">All Protocols Reserved</li>
              <li><Link href="/privacy" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Cookie Protocol</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Support Chatbot */}
      <SupportChatbot />
    </div>
  );
}
