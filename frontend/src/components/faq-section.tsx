"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mainFAQs } from "@/data/main-faqs";

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 relative overflow-hidden" id="faq">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-primary/20"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Protocol FAQ</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
          >
            Common <span className="text-gradient">Questions</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-500 font-medium text-lg"
          >
            Everything you need to know about navigating the architecture.
          </motion.p>
        </div>

        <div className="space-y-4">
          {mainFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass rounded-3xl border transition-all duration-500 ${
                activeIndex === index ? "border-primary/40 bg-white/5" : "border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full text-left p-8 md:p-10 flex items-start justify-between gap-6"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">{faq.category}</span>
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight">
                    {faq.question}
                  </h3>
                </div>
                <div className={`mt-2 p-2 rounded-full border transition-all duration-500 ${
                  activeIndex === index ? "bg-primary border-primary rotate-180" : "bg-white/5 border-white/10"
                }`}>
                  <ChevronDown className={`w-5 h-5 ${activeIndex === index ? "text-black" : "text-white/40"}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 md:px-10 pb-10">
                      <div className="h-px bg-white/5 mb-8" />
                      <p className="text-slate-400 font-medium leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="pt-12 text-center">
          <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">
            Still have queries? <a href="#support" className="text-primary hover:underline">Connect with Neural Support</a>
          </p>
        </div>
      </div>
    </section>
  );
}
