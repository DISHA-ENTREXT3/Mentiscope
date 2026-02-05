"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Minus, Mail, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Neural Support Uplink Established. How can I assist with your child's growth architecture today?",
        timestamp: new Date()
      }
    ]);
    
    // Auto-fill email if user is logged in
    const user = auth.currentUser;
    if (user?.email) {
      setSupportEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated AI response or Support trigger
    setTimeout(() => {
      const q = input.toLowerCase();
      let response = getResponse(input);
      
      if (q.includes("support") || q.includes("help") || q.includes("issue") || q.includes("problem")) {
        setShowSupportForm(true);
        response = "I've initialized the Support Protocol. Please verify your email and I'll route your transcript to our human growth architects.";
      }

      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const getResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("price") || q.includes("cost")) return "Our neural plans start at protocol-accessible levels. Premium access includes 9-dimensional deep sweeps and priority action items.";
    if (q.includes("data") || q.includes("secure")) return "Data integrity is absolute. All student metrics are stored within a secure quantum-encrypted vault, fully COPPA compliant.";
    if (q.includes("how it works") || q.includes("start")) return "Simply initialize your profile by clicking 'Get Started'. The architecture will guide you through the first stories and neural calibration.";
    return "Protocol acknowledged. Analyzing request... For deeper calibration, I suggest beginning with a 9-dimensional assessment.";
  };

  const submitToSupport = async () => {
    if (!supportEmail || !messages.length) return;
    
    setIsSubmitting(true);
    try {
      const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "Mentiscope",
          category: "General Support",
          message: transcript,
          user_email: supportEmail
        })
      });

      if (res.ok) {
        setMessages(prev => [...prev, {
          id: "success",
          role: "assistant",
          content: "Support Uplink Successful. Our architects will contact you shortly via email.",
          timestamp: new Date()
        }]);
        setShowSupportForm(false);
      } else {
        throw new Error("Failed to sync");
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: "error",
        role: "assistant",
        content: "Uplink Error. Please contact business@entrext.in directly.",
        timestamp: new Date()
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-6 w-[400px] h-[650px] glass rounded-[3rem] border border-primary/20 shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="bg-primary/20 p-8 border-b border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(135,255,200,0.5)]">
                    <Sparkles className="text-black w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0a0f1c]" />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-widest">Neural Support</h4>
                  <p className="text-primary text-[8px] font-black uppercase tracking-[0.2em]">Active Link v2.0</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Minus className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-primary text-black rounded-tr-none" 
                      : "bg-white/5 border border-white/5 text-slate-300 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] rounded-tl-none">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Support Form Overlay */}
            <AnimatePresence>
              {showSupportForm && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-8 mb-4 p-6 glass border border-primary/30 rounded-3xl space-y-4"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Confirm Support Routing</p>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="Your Protocol Email..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={submitToSupport}
                    disabled={isSubmitting || !supportEmail}
                    className="w-full bg-primary text-black font-black uppercase text-[10px] tracking-widest py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Transmit Transcript"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-8 pt-0">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Uplink message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white focus:outline-none focus:ring-2 ring-primary/20 transition-all pr-14"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-black rounded-xl hover:scale-110 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? "bg-white text-black" : "bg-primary text-black"
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </motion.button>
    </div>
  );
}
