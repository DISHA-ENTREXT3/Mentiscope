"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, BarChart3, Heart, Beaker, Users } from "lucide-react";

const features = [
  {
    icon: Beaker,
    title: "Full Assessment",
    desc: "Complete analysis of learning, emotions, and habits."
  },
  {
    icon: Sparkles,
    title: "Smart Planning",
    desc: "AI that predicts future learning challenges before they happen."
  },
  {
    icon: BarChart3,
    title: "Learning Styles",
    desc: "See how your child learns best and where they need help."
  },
  {
    icon: Shield,
    title: "Total Privacy",
    desc: "Top-tier security to keep your family's data safe and private."
  },
  {
    icon: Heart,
    title: "Health & Focus",
    desc: "Track sleep, mood, and focus levels for better learning."
  },
  {
    icon: Users,
    title: "Social Skills",
    desc: "See how your child interacts and communicates with others."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-32 px-6 bg-white/2" id="features">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8">
          <div className="max-w-2xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Advanced Capabilities</span>
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.85]">
              App <span className="text-gradient">Features</span>.
            </h2>
          </div>
          <p className="max-w-sm text-slate-500 font-medium text-lg lg:text-right pb-4">
            Powerful tools to help you support your child&apos;s learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-12 glass rounded-[4rem] border border-white/5 hover:border-primary/20 transition-all duration-700 hover:bg-white/5 group"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
