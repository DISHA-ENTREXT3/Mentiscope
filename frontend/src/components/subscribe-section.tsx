"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { socialLinks } from "@/data/social-links";

export function SubscribeSection({ variant = "default" }: { variant?: "default" | "hero" }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Simulate API call
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 5000);
  };

  if (variant === "hero") {
    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-xl mx-auto lg:mx-0">
          <div className="relative flex-1 group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Neural frequency (email)..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 ring-primary/20 transition-all group-hover:border-primary/40 placeholder:text-slate-600"
            />
          </div>
          <button 
            type="submit"
            className="bg-primary text-black font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(135,255,200,0.3)] flex items-center justify-center gap-3"
          >
            {isSubscribed ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {isSubscribed ? "Synced" : "Initialize Link"}
          </button>
        </form>
        
        <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
          {socialLinks.map((link) => (
            <a 
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors ${link.color} flex items-center gap-2`}
            >
              <link.icon className="w-3 h-3" />
              {link.name}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative glass rounded-[4rem] p-12 md:p-24 overflow-hidden border border-white/5 group">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-1000" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="max-w-xl text-center lg:text-left space-y-6">
          <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Weekly <span className="text-gradient">Intelligence</span>.
          </h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Join 12,000+ parents receiving high-frequency insights from Entrext Labs on child development and neural growth.
          </p>
        </div>

        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address..."
                required
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-sm font-bold text-white focus:outline-none focus:ring-4 ring-primary/20 transition-all group-hover:border-primary/40"
              />
            </div>
            <button 
              type="submit"
              disabled={isSubscribed}
              className={`w-full font-black uppercase text-xs tracking-[0.3em] py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 ${
                isSubscribed ? "bg-green-500 text-white" : "bg-white text-black hover:bg-primary"
              }`}
            >
              {isSubscribed ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {isSubscribed ? "Subscribed Successfully" : "Sync With Architecture"}
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-8 border-t border-white/5 pt-8">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 transition-colors ${link.color} flex items-center gap-2`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.name}
              </a>
            ))}
          </div>

          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Protocol compliant • One-click opt-out
          </p>
        </div>
      </div>
    </div>
  );
}
