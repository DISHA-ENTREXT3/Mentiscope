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
import { Brain, Sparkles, Zap, Shield, ChevronRight, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-[2rem] border border-white/5 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-10 h-10 text-black" />
            </div>
            <span className="text-2xl font-black text-foreground uppercase tracking-tighter">Mentiscope</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="/how-it-works" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
            <Link href="/features" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-6">
                <Link 
                  href="/dashboard"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-white/10 text-foreground text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login"
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors pr-4"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="bg-primary text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(135,255,200,0.3)]"
                >
                  Signup/Login
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
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center lg:text-left lg:items-center lg:flex-row gap-20">
          <div className="flex-1 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Student Growth Platform v1.0</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none drop-shadow-2xl max-w-lg mx-auto lg:mx-0"
            >
              Understanding <br />
              Learning <br />
              <span className="text-gradient">Beyond Grades</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed"
            >
              AI-powered patterns that help you understand your child&apos;s learning habits and well-being - supporting growth before challenges appear.
            </motion.p>

            {/* In-Hero Subscribe Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8 flex flex-col items-center lg:items-start"
            >
              <a
                href="https://entrextlabs.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary text-black text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(135,255,200,0.4)] group"
              >
                Subscribe Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Follow Us:</span>
                <a href="https://www.linkedin.com/company/entrext/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="Connect on LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/entrext.labs" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="Follow on Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://discord.com/invite/ZZx3cBrx2" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="Join Discord">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.396-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.007-.12a10.49 10.49 0 0 0 .372-.294a.07.07 0 0 1 .073-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .074.009c.12.098.246.198.373.295a.072.072 0 0 1-.006.12a12.977 12.977 0 0 1-1.873.892a.07.07 0 0 0-.037.099a14.992 14.992 0 0 0 1.293 2.1a.078.078 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.467.08-8.345-2.127-12.332a.049.049 0 0 0-.031-.027zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156c0-1.193.92-2.157 2.157-2.157c1.237 0 2.177.964 2.157 2.157c0 1.19-.92 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.965-2.157-2.156c0-1.193.92-2.157 2.157-2.157c1.236 0 2.177.964 2.157 2.157c0 1.19-.92 2.155-2.157 2.155z"/></svg>
                </a>
                <a href="https://linktr.ee/entrext.pro" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="View all links on Linktree">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                </a>
              </div>
              
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
                  <span className="text-foreground">12K+ PARENTS</span> GROWING WITH US
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="flex-1 w-full max-w-5xl relative"
          >
            <div className="glass rounded-[4rem] p-12 border border-border/10 aspect-square flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-[4rem] blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
              <Image 
                src="/mentiscope-logo.png" 
                alt="Mentiscope Logo" 
                width={500} 
                height={500}
                className="relative z-10 w-full h-auto dark:drop-shadow-[0_0_50px_rgba(135,255,200,0.4)] drop-shadow-[0_0_50px_rgba(47,93,159,0.2)]"
              />
              
              {/* Floating Data Nodes */}
              <div className="absolute -top-10 -right-10 glass p-6 rounded-3xl border border-white/20 animate-float">
                <Zap className="w-8 h-8 text-primary mb-2" />
                <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Active Tracking</p>
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl border border-white/20 animate-float [animation-delay:2s]">
                <Shield className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Safe Data</p>
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
            <h3 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter">Learning <span className="text-gradient">Insights</span>.</h3>
            <p className="text-muted-foreground font-medium">Explore our library of research-based learning strategies.</p>
          </div>
          <Link 
            href="/blog"
            className="group/btn relative px-12 py-5 bg-foreground text-background font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-3 hover:bg-primary hover:text-primary-foreground transition-all overflow-hidden"
          >
            <span className="relative z-10">Read Blogs</span>
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
              <span className="text-2xl font-black text-foreground uppercase tracking-tighter">Mentiscope</span>
            </div>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Helping children reach their potential through data-driven learning insights.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/company/entrext/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-foreground/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="Connect on LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/entrext.labs" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-foreground/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="Follow us on Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://discord.com/invite/ZZx3cBrx2" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-foreground/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="Join Discord">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.396-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.007-.12a10.49 10.49 0 0 0 .372-.294a.07.07 0 0 1 .073-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .074.009c.12.098.246.198.373.295a.072.072 0 0 1-.006.12a12.977 12.977 0 0 1-1.873.892a.07.07 0 0 0-.037.099a14.992 14.992 0 0 0 1.293 2.1a.078.078 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.467.08-8.345-2.127-12.332a.049.049 0 0 0-.031-.027zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156c0-1.193.92-2.157 2.157-2.157c1.237 0 2.177.964 2.157 2.157c0 1.19-.92 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.965-2.157-2.156c0-1.193.92-2.157 2.157-2.157c1.236 0 2.177.964 2.157 2.157c0 1.19-.92 2.155-2.157 2.155z"/></svg>
              </a>
              <a href="https://linktr.ee/entrext.pro" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-foreground/5 border border-border/30 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all" title="View all links on Linktree">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-foreground font-black uppercase text-xs tracking-widest">How it works</h4>
            <ul className="space-y-4">
              <li><Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Methodology</Link></li>
              <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Features</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-foreground font-black uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Research Blog</Link></li>
              <li><Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Support FAQ</Link></li>
              <li><a href="https://www.entrext.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">About Entrext</a></li>
              <li><a href="mailto:business@entrext.in" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-foreground font-black uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4">
              <li className="text-muted-foreground text-sm font-medium">© 2026 Mentiscope</li>
              <li className="text-muted-foreground text-sm font-medium">All Rights Reserved</li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Cookie Policy</Link></li>
              <li><Link href="/refund" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Support Chatbot */}
      <SupportChatbot />
    </div>
  );
}
