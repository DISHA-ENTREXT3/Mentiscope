"use client";

import { useState } from "react";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import { Brain, Search, Clock, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BlogListing() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black pt-32 pb-20 transition-colors duration-300">
      {/* Navigation (Simplified for Blog) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-[2rem] border border-border/10 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-foreground uppercase tracking-tighter">Mentiscope</span>
          </Link>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-8 border-l border-border/20 pl-6">
              <Link 
                  href="/dashboard" 
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-foreground transition-colors"
              >
                  Dashboard
              </Link>
              <Link 
                  href="/" 
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
              >
                  Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </motion.button>

        {/* Header */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Insights & Stories</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-[1.1]"
          >
            Insights & Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Explore the latest trends, strategies, and stories from the world of child learning and development.
          </motion.p>
        </div>

        {/* Category Filter - Horizontal scroll like reference */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {["All", ...blogCategories].map((cat, idx) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-primary text-black" 
                    : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background/40 border border-border/30 rounded-lg px-12 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Blog List - More refined layout like reference */}
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="border-b border-border/30 pb-6 hover:border-primary/20 transition-colors">
                  {/* Category and Date Row */}
                  <div className="flex flex-wrap items-center gap-4 mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                    <span className="font-bold text-primary">{post.category}</span>
                    <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    <span className="text-muted-foreground">{post.date}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-muted-foreground font-regular leading-relaxed mb-4 max-w-2xl line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                    Read Article <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-wide">No articles found. Try another search.</h3>
          </motion.div>
        )}
      </div>
    </div>
  );
}
