"use client";

import { use } from "react";
import { getBlogBySlug } from "@/data/blog-posts";
import { Brain, Clock, ChevronLeft, ChevronDown, Share2, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SubscribeSection } from "@/components/subscribe-section";

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const post = getBlogBySlug(resolvedParams.slug);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter">Protocol Terminated.</h1>
          <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Intelligence Cache Not Found</p>
          <Link href="/blog" className="inline-block px-10 py-5 bg-primary text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl">
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] selection:bg-primary selection:text-black pt-32 pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-[2rem] border border-white/5 backdrop-blur-2xl">
          <Link href="/blog" className="flex items-center gap-3 group text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Archive
          </Link>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">Mentiscope</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <button className="p-3 rounded-xl glass border border-white/5 text-slate-500 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
            <button className="p-3 rounded-xl glass border border-white/5 text-slate-500 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 space-y-20">
        {/* Header */}
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <span className="px-6 py-2 rounded-full glass border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {post.readTime}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary text-xs">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-white font-black uppercase text-[10px] tracking-widest">{post.author}</p>
              <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em]">Neural Intelligence Division</p>
            </div>
          </motion.div>
        </div>

        {/* Feature Image 1 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative h-[500px] md:h-[700px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl"
        >
          <Image src={post.image1} alt={post.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#030712] via-transparent to-transparent opacity-40" />
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-2xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-slate-400 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-400"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />').replace(/## (.*)/g, '<h2 class="text-4xl md:text-5xl mt-20 mb-10 text-white uppercase tracking-tighter leading-none">$1</h2>') }}
        />

        {/* Feature Image 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[400px] md:h-[600px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl"
        >
          <Image src={post.image2} alt={post.title} fill className="object-cover" />
        </motion.div>

        {/* Blog Specific FAQs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12 py-20"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Post <span className="text-gradient">Logic</span>.</h2>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Contextual Intelligence Clearance</p>
          </div>

          <div className="space-y-4">
            {post.faqs.map((faq, index) => (
              <div 
                key={index}
                className={`glass p-8 md:p-12 rounded-[3rem] border transition-all duration-500 ${
                  activeFaq === index ? "border-primary/40 bg-white/5" : "border-white/5 hover:border-white/10"
                }`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left flex items-start justify-between gap-6"
                >
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight">{faq.question}</h3>
                  <div className={`mt-1 p-2 rounded-xl transition-all duration-500 ${
                    activeFaq === index ? "bg-primary text-black rotate-180" : "bg-white/5 text-slate-500"
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 text-slate-400 font-medium leading-relaxed text-lg">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Posts Link */}
        <div className="pt-12 border-t border-white/5 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[.4em] text-slate-500">Subject Metadata</p>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-[9px] font-bold text-slate-400 hover:text-primary cursor-pointer transition-colors">#{tag.replace(/\s+/g, '')}</span>
              ))}
            </div>
          </div>
          <Link href="/blog" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-primary transition-colors">
            Return to Cache <Share2 className="w-4 h-4" />
          </Link>
        </div>

        {/* Post Subscribe CTA */}
        <div className="pt-20">
          <SubscribeSection />
        </div>
      </div>
    </div>
  );
}
