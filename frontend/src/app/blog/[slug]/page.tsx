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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 pt-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-xs text-primary">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-foreground font-bold text-xs uppercase tracking-widest">{post.author}</p>
              <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide">Learning Team</p>
            </div>
          </motion.div>

          {/* Share Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 pt-8 flex-wrap"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share:</span>
            <button 
              onClick={shareToTwitter}
              className="p-3 rounded-lg bg-background border border-border/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
              title="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
              <span className="text-[9px] font-semibold uppercase tracking-wider hidden sm:inline">Twitter</span>
            </button>
            <button 
              onClick={shareToFacebook}
              className="p-3 rounded-lg bg-background border border-border/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
              title="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
              <span className="text-[9px] font-semibold uppercase tracking-wider hidden sm:inline">Facebook</span>
            </button>
            <button 
              onClick={shareToLinkedIn}
              className="p-3 rounded-lg bg-background border border-border/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              <span className="text-[9px] font-semibold uppercase tracking-wider hidden sm:inline">LinkedIn</span>
            </button>
            <button 
              onClick={shareViaEmail}
              className="p-3 rounded-lg bg-background border border-border/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
              title="Share via Email"
            >
              <Mail className="w-4 h-4" />
              <span className="text-[9px] font-semibold uppercase tracking-wider hidden sm:inline">Email</span>
            </button>
            <button 
              onClick={handleCopyLink}
              className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${
                copied 
                  ? 'bg-primary/20 border-primary text-primary' 
                  : 'bg-background border-border/30 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
              }`}
              title="Copy link to clipboard"
            >
              <Copy className="w-4 h-4" />
              <span className="text-[9px] font-semibold uppercase tracking-wider hidden sm:inline">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Feature Image 1 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden border border-border/30"
        >
          <Image src={post.image1} alt={post.title} fill className="object-cover" />
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8 text-foreground"
        >
          <article 
            className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-white prose-headings:mt-12 prose-headings:mb-6
            prose-h2:text-3xl prose-h2:capitalize prose-h2:tracking-normal prose-h2:font-bold
            prose-h3:text-xl prose-h3:text-primary prose-h3:capitalize prose-h3:font-semibold
            prose-p:text-slate-300 prose-p:leading-8 prose-p:font-normal prose-p:text-base
            prose-strong:text-white prose-strong:font-semibold
            prose-li:text-slate-300 prose-li:font-normal prose-li:text-base prose-li:my-2
            prose-ol:my-6 prose-ul:my-6
            prose-code:text-primary/80 prose-code:bg-black/20 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-300
            dark"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .split('\n\n')
                .map((paragraph, i) => {
                  if (paragraph.match(/^#{1,3}\s/)) {
                    // Handle headings
                    const match = paragraph.match(/^(#{1,3})\s(.*)/);
                    if (!match) return paragraph;
                    const level = match[1].length;
                    const text = match[2];
                    const tag = `h${level + 1}`;
                    return `<${tag} class="${level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl'} font-bold capitalize mt-8 mb-4">${text}</${tag}>`;
                  } else if (paragraph.match(/^-\s/) || paragraph.match(/^\d+\.\s/)) {
                    // Handle lists
                    const isOrdered = paragraph.match(/^\d+\.\s/);
                    const items = paragraph.split('\n').filter(l => l.trim());
                    const listItems = items.map(item => {
                      const text = item.replace(/^[-*]\s|^\d+\.\s/, '').trim();
                      return `<li class="my-2">${text}</li>`;
                    }).join('');
                    return isOrdered ? `<ol class="list-decimal list-inside my-6">${listItems}</ol>` : `<ul class="list-disc list-inside my-6">${listItems}</ul>`;
                  } else if (paragraph.trim()) {
                    // Regular paragraphs
                    const formatted = paragraph
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
                      .replace(/__(.*?)__/g, '<em class="italic">$1</em>')
                      .replace(/`(.*?)`/g, '<code class="text-primary/80 bg-black/20 px-2 py-1 rounded">$1</code>');
                    return `<p class="text-slate-300 leading-8 font-normal text-base my-4">${formatted}</p>`;
                  }
                  return '';
                })
                .filter(Boolean)
                .join('')
            }}
          />
        </motion.div>

        {/* Feature Image 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden border border-border/30"
        >
          <Image src={post.image2} alt={post.title} fill className="object-cover" />
        </motion.div>

        {/* Blog Specific FAQs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8 py-12"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">Common Questions</h2>
            <p className="text-muted-foreground font-semibold tracking-widest uppercase text-xs">About this article</p>
          </div>

          <div className="space-y-3">
            {post.faqs.map((faq, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-6 md:p-8 transition-all duration-300 ${
                  activeFaq === index ? "border-primary/40 bg-primary/5" : "border-border/30 hover:border-border/50"
                }`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left flex items-start justify-between gap-4"
                >
                  <h3 className="text-base md:text-lg font-bold text-foreground leading-relaxed uppercase tracking-tight">{faq.question}</h3>
                  <div className={`mt-0.5 p-1.5 rounded transition-all duration-300 flex-shrink-0 ${
                    activeFaq === index ? "bg-primary text-black" : "bg-background border border-border/20 text-muted-foreground"
                  }`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
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
                      <div className="pt-6 text-muted-foreground font-normal leading-relaxed">
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
        <div className="pt-8 border-t border-border/30 flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tags</p>
            <div className="flex gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-[9px] font-semibold text-muted-foreground hover:text-primary cursor-pointer transition-colors">#{tag.replace(/\s+/g, '')}</span>
              ))}
            </div>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
            Back to Blog <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Post Subscribe CTA */}
        <div className="pt-12">
          <SubscribeSection />
        </div>
      </div>
    </div>
  );
}
