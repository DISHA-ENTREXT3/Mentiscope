"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Brain, Loader2, Heart, Zap, Terminal } from "lucide-react";
import { submitAssessment } from "@/lib/api";

export default function WeeklyCheckinForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mood: 5,
    focus: 5,
    sleep: 7,
    challenging_subject: "",
    win_of_the_week: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitAssessment(studentId, "weekly_checkin", formData);
      router.push(`/dashboard/${studentId}`);
    } catch (error) {
      console.error("Check-in failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="glass border-none rounded-[4rem] overflow-hidden">
        <CardContent className="p-10 md:p-20 space-y-16">
          {/* Mood Section */}
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Biometric 01</p>
                <Label className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <Heart className="w-6 h-6 text-accent" />
                   Emotional Resonance
                </Label>
              </div>
              <span className="text-5xl font-black text-primary tracking-tighter">{formData.mood}<span className="text-lg text-slate-600">/10</span></span>
            </div>
            <div className="relative pt-4">
              <input 
                type="range"
                value={formData.mood} 
                min={1} 
                max={10} 
                step={1} 
                onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})}
                className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-2xl [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(135,255,200,0.5)]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-6">
                <span>Low Frequency</span>
                <span>Peak State</span>
              </div>
            </div>
          </div>

          {/* Focus Section */}
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Biometric 02</p>
                <Label className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <Zap className="w-6 h-6 text-primary" />
                   Neural Concentration
                </Label>
              </div>
              <span className="text-5xl font-black text-accent tracking-tighter">{formData.focus}<span className="text-lg text-slate-600">/10</span></span>
            </div>
            <div className="relative pt-4">
              <input 
                type="range"
                value={formData.focus} 
                min={1} 
                max={10} 
                step={1} 
                onChange={(e) => setFormData({...formData, focus: parseInt(e.target.value)})}
                className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent transition-all [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-2xl [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,100,200,0.4)]"
              />
            </div>
          </div>

          {/* Qualitative Data */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Brain className="w-4 h-4 text-primary" />
                 Friction Points
              </Label>
              <Textarea 
                placeholder="Micro-failures or barriers encountered..."
                value={formData.challenging_subject}
                onChange={(e) => setFormData({...formData, challenging_subject: e.target.value})}
                className="min-h-[160px] rounded-[2.5rem] bg-white/5 border-white/5 px-8 py-6 focus:ring-primary font-medium text-lg text-white placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Star className="w-4 h-4 text-accent" />
                 Breakthrough Moments
              </Label>
              <Textarea 
                placeholder="Small wins or neural clicks..."
                value={formData.win_of_the_week}
                onChange={(e) => setFormData({...formData, win_of_the_week: e.target.value})}
                className="min-h-[160px] rounded-[2.5rem] bg-white/5 border-white/5 px-8 py-6 focus:ring-accent font-medium text-lg text-white placeholder:text-slate-700"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-white/5 border-t border-white/5 p-12 mt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full bg-primary hover:bg-white text-primary-foreground hover:text-black h-24 text-2xl font-black rounded-3xl shadow-[0_20px_50px_rgba(135,255,200,0.2)] transition-all active:scale-[0.98] group"
          >
            {loading ? <Loader2 className="w-8 h-8 animate-spin mr-3" /> : (
              <span className="flex items-center gap-3">
                <Terminal className="w-6 h-6" /> COMMENCE SYNC
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.6em]">
         Encrypted Stream — Neural Protocol Active
      </p>
    </motion.div>
  );
}
