"use client";

import { motion } from "framer-motion";
import { Check, Activity, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const plans = [
    {
      name: "Standard Protocol",
      price: "$29",
      desc: "Essential growth tracking for proactive parents.",
      features: [
        "Core Neural Mapping",
        "Weekly Biometric Sync",
        "Subject-Wise Heatmaps",
        "Basic AI Insights",
        "Email Growth Reports"
      ],
      cta: "Init Sync",
      accent: "primary",
      popular: false
    },
    {
      name: "Elite Architecture",
      price: "$89",
      desc: "Microscopic predictive intelligence for high-potential students.",
      features: [
        "All Standard Features",
        "Predictive Risk Detection",
        "Sleep & Screen Synergy Map",
        "AI Action Hub (Parent + Student)",
        "Priority Support Uplink",
        "Talent Identification Engine"
      ],
      cta: "Commence Elite",
      accent: "accent",
      popular: true
    },
    {
      name: "Quantum System",
      price: "Custom",
      desc: "Bespoke monitoring for institutions and luxury family offices.",
      features: [
        "Fleet Neural Management",
        "White-Glove Implementation",
        "Bi-Weekly Psychologist Sync",
        "Custom Neural Node Tracking",
        "API Integration Base",
        "Legacy Potential Archiving"
      ],
      cta: "Contact Ops",
      accent: "white",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 py-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        <div className="text-center space-y-8">
           <Badge className="bg-primary/20 text-primary border-primary/20 px-6 py-2 font-black uppercase tracking-[0.4em] text-xs">The Economics of Potential</Badge>
           <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8]">Strategic <br /><span className="text-gradient">Investment</span>.</h1>
           <p className="max-w-2xl mx-auto text-slate-500 font-medium text-xl leading-relaxed">
             Select the calibration level required to unlock your child&apos;s digital developmental blueprint.
           </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
           {plans.map((plan, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`relative glass border-none rounded-[4rem] p-16 space-y-12 flex flex-col transition-all hover:scale-[1.02] ${plan.popular ? 'bg-white/5 border border-primary/20 shadow-2xl shadow-primary/10 ring-1 ring-primary/20' : ''}`}
             >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">
                    Highly Calibrated
                  </div>
                )}
                
                <div className="space-y-6">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                   <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-slate-500 font-black uppercase text-xs tracking-widest">/ Month</span>}
                   </div>
                   <p className="text-slate-500 font-bold leading-relaxed">{plan.desc}</p>
                   {plan.price !== "Custom" && (
                     <p className="text-primary text-[10px] font-black uppercase tracking-widest">Includes 7-Day Precision Trial</p>
                   )}
                </div>

                <div className="space-y-6 flex-1">
                   <div className="h-px bg-white/5 w-full" />
                   <ul className="space-y-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                           <div className={`p-1.5 rounded-lg ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white'}`}>
                              <Check className="w-4 h-4" />
                           </div>
                           {feature}
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="space-y-4">
                  <Button className={`${plan.popular ? 'bg-primary text-black' : 'bg-white/5 text-white'} w-full h-24 rounded-[2.5rem] text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl`}>
                    {plan.cta}
                  </Button>
                  {plan.price !== "Custom" && (
                    <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
                      No free tiers. We focus resources on supporting paying customers.
                    </p>
                  )}
                </div>
             </motion.div>
           ))}
        </div>

        {/* Transparency Section */}
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="glass p-16 rounded-[4rem] border border-white/5 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
            <h4 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">The <span className="text-gradient">Bootstrapped Pledge</span>.</h4>
            <p className="text-slate-400 font-medium text-lg leading-relaxed italic">
              &quot;We are 100% bootstrapped and do not take VC money. Because we answer to our users—not investors—we don&apos;t offer &apos;forever free&apos; tiers. This allows us to focus entirely on building the best possible tools for you. People in the US value transparency, and we&apos;re giving it to you straight: your support keeps us independent.&quot;
            </p>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Independence Protocol // Mentiscope Ops</span>
              <ShieldCheck className="w-6 h-6 text-primary opacity-20" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Strategic FAQ</h4>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest max-w-xl mx-auto">
              No free tiers. No fluff. We offer a 7-day trial so you can see the value yourself, or you can jump straight in.
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center py-20 bg-white/5 rounded-[4rem] border border-white/5 border-dashed space-y-8">
           <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Need a personalized sync?</h4>
           <div className="flex justify-center flex-wrap gap-8">
              <div className="flex items-center gap-4 text-slate-500 font-bold text-sm uppercase">
                 <ShieldCheck className="w-5 h-5 text-accent" /> Secure Data Shield
              </div>
              <div className="flex items-center gap-4 text-slate-500 font-bold text-sm uppercase">
                 <Globe className="w-5 h-5 text-primary" /> Global Protocol Sync
              </div>
           </div>
           <Button variant="link" className="text-primary font-black uppercase tracking-widest text-xs">Speak to a Growth Architect</Button>
        </div>
      </div>
      
      {/* Mini Nav Back */}
      <div className="fixed top-12 left-12">
         <Link href="/">
           <Button variant="ghost" className="bg-white/5 backdrop-blur-3xl rounded-[2rem] h-20 w-20 border border-white/5 hover:bg-white hover:text-black transition-all">
              <Activity className="w-8 h-8" />
           </Button>
         </Link>
      </div>
    </div>
  );
}
