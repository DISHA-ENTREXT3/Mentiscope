"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Fingerprint, LineChart, Target } from "lucide-react";

const steps = [
  {
    icon: Fingerprint,
    title: "Initial Sync",
    desc: "Complete the initial 9-dimensional neural baseline assessment.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: BrainCircuit,
    title: "Deep sweep",
    desc: "Our AI analyzes learning signals, emotional state, and habits.",
    color: "from-purple-500 to-indigo-400"
  },
  {
    icon: LineChart,
    title: "Predictive Map",
    desc: "Receive a 90-day trajectory of your child's growth potential.",
    color: "from-emerald-500 to-teal-400"
  },
  {
    icon: Target,
    title: "Precision Action",
    desc: "Personalized action plans tailored to your specific findings.",
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
            className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none"
          >
            The <span className="text-gradient">Protocol</span>.
          </motion.h2>
          <p className="text-slate-500 font-medium text-lg">
            A systematic architecture designed to decode potential and catalyze growth.
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
              <div className="absolute top-8 right-8 text-[80px] font-black text-white/5 leading-none pointer-events-none group-hover:text-primary/5 transition-colors">
                {index + 1}
              </div>
              
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} p-4 mb-8 shadow-xl shadow-black/20 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-full h-full text-white" />
              </div>

              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{step.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white text-black font-black uppercase text-sm tracking-[0.3em] rounded-3xl shadow-2xl hover:bg-primary transition-colors"
          >
            Begin Calibration
          </motion.button>
        </div>
      </div>
    </section>
  );
}
