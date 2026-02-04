"use client";

import { useState } from "react";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import { Brain, Search, Clock, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BlogListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#030712] selection:bg-primary selection:text-black pt-32 pb-20">
      {/* Navigation (Simplified for Blog) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-[2rem] border border-white/5 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">Mentiscope</span>
          </Link>
          <Link 
            href="/" 
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors"
          >
            Back to Architecture
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Header */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Archive</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8]"
          >
            Neural <span className="text-gradient">Insights</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium leading-relaxed"
          >
            Exploring the intersection of neuroscience, educational psychology, and parenting protocol.
          </motion.p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between glass p-8 rounded-[3rem] border border-white/5">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search intelligence cache..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {["All", ...blogCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(135,255,200,0.3)]" 
                    : "bg-white/5 text-slate-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 3) * 0.1 }}
              viewport={{ once: true }}
              className="group glass rounded-[4rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-700 hover:bg-white/5"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-72 overflow-hidden">
                  <Image 
                    src={post.image1} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#030712] via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8">
                    <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-12 space-y-6">
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-4 transition-all">
                    Initialize Full Cache <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-40 glass rounded-[4rem] border border-white/5">
            <h3 className="text-2xl font-black text-slate-600 uppercase tracking-[0.2em]">Cache Empty. Refine Search.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
