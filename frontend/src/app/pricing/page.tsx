"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (plan: string, price: number, productId: string) => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/signup?redirect=/pricing");
      return;
    }

    setLoading(plan);

    try {
      const token = await user.getIdToken();
      // Call standard standard synthesis backend or Next.js proxy
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentiscope-api.onrender.com";
      
      // We'll use the Next.js proxy if we created one, or direct if CORS allows.
      // Based on previous edits, we seem to prefer a proxy in /api but let's try direct first 
      // or actually, let's create a proxy for this too to correspond with the support chat pattern.
      // For now, I'll assume we use the direct backend node endpoint from `backend-node/src/index.js`
      // which is `/api/payments/checkout`.
      
      const response = await fetch(`${backendUrl}/api/payments/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          planName: plan,
          price
        })
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initiate secure payment channel. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Neural Basic",
      description: "Essential growth tracking for one child.",
      price: 0,
      productId: "free_tier",
      features: [
        "Basic Growth Synthesis",
        "Monthly Trend Analysis",
        "Standard Support",
        "1 Student Profile"
      ],
      highlight: false,
      cta: "Current Plan"
    },
    {
      name: "Cognitive Pro",
      description: "Deep insights & predictive action plans.",
      price: billingCycle === "monthly" ? 29 : 290,
      productId: billingCycle === "monthly" ? "p_monthly_pro_123" : "p_yearly_pro_123", // Dodo Product IDs
      features: [
        "Advanced AI Synthesis",
        "Predictive Behavioral Modeling",
        "Priority Expert Support",
        "Up to 3 Student Profiles",
        "Deep Perception Mapping",
        "Personalized Action Protocols"
      ],
      highlight: true,
      cta: "Upgrade Neural Link"
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black py-32 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
          >
             <Sparkles className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Tiers</span>
          </motion.div>
          
          <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-none"
          >
             Invest in their <br />
             <span className="text-gradient">Potential</span>.
          </motion.h1>
          
          <motion.p 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl text-muted-foreground font-medium"
          >
             Choose the level of insight that fits your family&apos;s growth journey.
          </motion.p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 bg-white/10 rounded-full relative p-1 transition-colors hover:bg-white/20"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                className="w-6 h-6 bg-primary rounded-full shadow-lg shadow-primary/50"
              />
            </button>
            <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Yearly <span className="text-primary">(Save 20%)</span></span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className={`relative p-10 rounded-[3rem] border flex flex-col gap-8 group transition-all duration-500 hover:scale-[1.02] ${
                plan.highlight 
                  ? "bg-white/5 border-primary/50 shadow-[0_0_50px_rgba(135,255,200,0.1)]" 
                  : "glass border-white/5 hover:border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 py-2 px-6 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-bl-3xl rounded-tr-[2.5rem]">
                  Recommended
                </div>
              )}

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                   {plan.highlight ? <Zap className="w-6 h-6 text-primary" /> : <Shield className="w-6 h-6 text-slate-400" />}
                </div>
                <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter">{plan.name}</h3>
                <p className="text-muted-foreground font-medium text-sm">{plan.description}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground tracking-tighter">${plan.price}</span>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {plan.features.map(feat => (
                  <div key={feat} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-500'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-bold text-slate-300">{feat}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handleSubscribe(plan.name, plan.price, plan.productId)}
                disabled={!!loading || plan.price === 0}
                className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                  plan.highlight 
                    ? "bg-primary text-black hover:scale-105 active:scale-95 shadow-xl shadow-primary/20" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {loading === plan.name ? "Processing..." : plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center pt-20 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Secured by Dodo Payments Architecture</p>
             <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Add payment icons here if available, using text for now */}
                <span className="text-xl font-bold text-slate-400">VISA</span>
                <span className="text-xl font-bold text-slate-400">Mastercard</span>
                <span className="text-xl font-bold text-slate-400">Amex</span>
             </div>
        </div>

      </div>
    </div>
  );
}
