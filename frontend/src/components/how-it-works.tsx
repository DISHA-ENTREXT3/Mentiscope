"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Fingerprint, LineChart, Target } from "lucide-react";

const steps = [
  {
    icon: Fingerprint,
    title: "First Step",
    desc: "Complete our simple 9-part learning assessment.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: BrainCircuit,
    title: "Smart Analysis",
    desc: "Our AI looks at your child's learning habits and emotions.",
    color: "from-purple-500 to-indigo-400"
  },
  {
    icon: LineChart,
    title: "Growth Plan",
    desc: "Get a clear 90-day plan for your child's learning journey.",
    color: "from-emerald-500 to-teal-400"
  },
  {
    icon: Target,
    title: "Action Steps",
    desc: "Daily steps designed just for your child's specific needs.",
    color: "from-amber-500 to-orange-400"
  }
];

export function HowItWorks() {
  return (
    <section className="py-32 px-6" id="how-it-works">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-none"
          >
            How it <span className="text-gradient">Works</span>.
          </motion.h2>
          <p className="text-slate-500 font-medium text-lg">
            A simple way to understand and help your child grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-10 glass rounded-[3rem] border border-white/5 group hover:border-primary/20 transition-all duration-500"
            >
              <div className="absolute top-8 right-8 text-[80px] font-black text-foreground/5 leading-none pointer-events-none group-hover:text-primary/5 transition-colors">
                {index + 1}
              </div>
              
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} p-4 mb-8 shadow-xl shadow-black/20 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-full h-full text-white" />
              </div>

              <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">{step.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-foreground text-background font-black uppercase text-sm tracking-[0.3em] rounded-3xl shadow-2xl hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </section>
  );
}
