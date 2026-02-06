"use client";

import { use, useState } from "react";
import { getBlogBySlug } from "@/data/blog-posts";
import { Brain, Clock, ChevronLeft, ChevronDown, Twitter, Linkedin, ArrowLeft, Share2, Copy, Facebook, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SubscribeSection } from "@/components/subscribe-section";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const post = getBlogBySlug(resolvedParams.slug);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const blogUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : '';
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out: ${post.title}\n\n${post.excerpt}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(blogUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this article: ${post.title}`);
    const body = encodeURIComponent(`${post.title}\n\n${post.excerpt}\n\nRead more: ${blogUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

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
            <span className="text-xl font-black text-foreground uppercase tracking-tighter hidden sm:inline">Mentiscope</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link 
                href="/dashboard" 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-foreground transition-colors"
            >
                Dashboard
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass border border-border/10 text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass border border-border/10 text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Blog</span>
        </motion.button>
        
        {/* Header */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <span className="px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold text-primary uppercase tracking-widest">
              {post.category}
            </span>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight uppercase leading-tight"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-semibold text-slate-400 bg-white/5 rounded-full border border-white/10">
                #{tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 rounded-2xl glass border border-white/5 sticky top-40 z-40"
        >
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Share This Article</p>
            <p className="text-sm font-medium text-slate-400">Help others discover this knowledge</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              onClick={shareToTwitter}
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-black uppercase tracking-wider"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            
            <Button 
              onClick={shareToFacebook}
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-black uppercase tracking-wider"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            
            <Button 
              onClick={shareToLinkedIn}
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-black uppercase tracking-wider"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
            
            <Button 
              onClick={shareViaEmail}
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-black uppercase tracking-wider"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>

            <div className="relative">
              <Button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                variant="outline"
                size="sm"
                className="gap-2 text-xs font-black uppercase tracking-wider"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 p-4 rounded-xl glass border border-white/10 whitespace-nowrap"
                >
                  <p className="text-xs text-slate-400 mb-3">Blog URL copied to clipboard!</p>
                  <p className="text-xs font-mono text-primary break-all max-w-[300px]">{blogUrl}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Featured Images */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 rounded-3xl overflow-hidden"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden group">
            <img 
              src={post.image1} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden group">
            <img 
              src={post.image2} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert max-w-none space-y-8"
        >
          <div className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
            {post.content}
          </div>

          <div className="space-y-6 pt-12 border-t border-white/5">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Author</h3>
              <div className="flex items-center gap-4 p-6 rounded-2xl glass border border-white/5">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-black text-foreground text-lg">{post.author}</p>
                  <p className="text-sm text-slate-400">Child Development Expert</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-3xl font-black text-foreground uppercase tracking-tight mb-2">Frequently Asked Questions</h3>
            <p className="text-slate-400 font-medium">Everything you need to know about this topic</p>
          </div>

          <div className="space-y-4">
            {post.faqs.map((faq, idx) => (
              <motion.button
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-6 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                    {faq.question}
                  </h4>
                  <ChevronDown 
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}
                  />
                </div>
                
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-white/5"
                    >
                      <p className="text-slate-300 leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Subscribe Section */}
      <SubscribeSection />
    </div>
  );
}
