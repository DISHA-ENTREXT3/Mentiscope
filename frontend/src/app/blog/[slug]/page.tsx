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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-black text-foreground uppercase tracking-tighter">Page Not Found.</h1>
          <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs">The article you are looking for does not exist.</p>
          <Link href="/blog" className="inline-block px-10 py-5 bg-primary text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black pt-32 pb-20 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-[2rem] border border-white/5 backdrop-blur-2xl">
          <Link href="/blog" className="flex items-center gap-3 group text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Blog
          </Link>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-foreground uppercase tracking-tighter">Mentiscope</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link 
                href="/dashboard" 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-foreground transition-colors"
            >
                Dashboard
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <button className="p-3 rounded-xl glass border border-border/10 text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></button>
              <button className="p-3 rounded-xl glass border border-border/10 text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></button>
            </div>
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
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {post.readTime}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-tight"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted border border-border/10 flex items-center justify-center font-black text-primary text-xs">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-foreground font-black uppercase text-[10px] tracking-widest">{post.author}</p>
              <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em]">Learning Team</p>
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
          className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-slate-300 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-300"
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
            <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">Common <span className="text-gradient">Questions</span>.</h2>
            <p className="text-muted-foreground font-bold tracking-widest uppercase text-[10px]">More helpful information</p>
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
                  <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight uppercase tracking-tight">{faq.question}</h3>
                  <div className={`mt-1 p-2 rounded-xl transition-all duration-500 ${
                    activeFaq === index ? "bg-primary text-black rotate-180" : "bg-background border border-border/10 text-muted-foreground"
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
        <div className="pt-12 border-t border-border/10 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[.4em] text-muted-foreground">Tags</p>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-[9px] font-bold text-muted-foreground hover:text-primary cursor-pointer transition-colors">#{tag.replace(/\s+/g, '')}</span>
              ))}
            </div>
          </div>
          <Link href="/blog" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors">
            Back to Blog <Share2 className="w-4 h-4" />
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
