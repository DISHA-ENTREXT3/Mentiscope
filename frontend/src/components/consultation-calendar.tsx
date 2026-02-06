"use client";

import { useState } from "react";
import { Clock, Check, Loader2, Calendar as CalendarIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/firebase";

export function ConsultationScheduler() {
  // Use string for native date input (YYYY-MM-DD)
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email] = useState(auth?.currentUser?.email || "");

  const handleBook = async () => {
    if (!date || !time) return;
    if (!auth) {
      alert("Firebase not initialized");
      return;
    }
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Unauthorized");
      const token = await user.getIdToken();

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentiscope-api.onrender.com";
      const res = await fetch(`${backendUrl}/api/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          date,
          time,
          email,
          reason: "Parent Consultation"
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to book consultation.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="space-y-2">
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Uplink Confirmed.</h3>
            <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Neural session scheduled. A secure confirmation packet has been dispatched to <span className="text-white border-b border-white/20">{email}</span>.
            </p>
        </div>
        <Button onClick={() => setSuccess(false)} variant="outline" className="mt-8 rounded-2xl px-8 uppercase tracking-widest font-bold">Schedule Another</Button>
      </div>
    );
  }

  return (
    <div className="glass border border-white/5 rounded-[3rem] p-10 space-y-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Expert Uplink</h3>
        </div>
        <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl">
            Schedule a synchronized deep-dive session with a Growth Architect to interpret neural patterns and refine action protocols.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4 group">
            <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-primary group-hover:text-white transition-colors">Target Date</Label>
            <div className="relative">
                <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl px-6 text-xl font-bold text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer [color-scheme:dark]"
                />
            </div>
          </div>

          <div className="space-y-4">
             <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-primary">Target Time</Label>
             <Select onValueChange={setTime}>
                <SelectTrigger className="h-20 rounded-3xl bg-white/5 border-white/10 text-white text-xl font-bold uppercase tracking-widest px-6">
                  <SelectValue placeholder="Select Slot" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                  {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => (
                    <SelectItem key={t} value={t} className="text-lg font-medium">{t}</SelectItem>
                  ))}
                </SelectContent>
             </Select>
          </div>
        </div>

        <div className="space-y-8 flex flex-col justify-end">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
             <div className="flex items-center gap-4 text-slate-300">
                <Mail className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">{email}</span>
             </div>
             <div className="flex items-center gap-4 text-primary">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-black uppercase tracking-wider">Auto-Reminder: Enabled (T-24H)</span>
             </div>
          </div>

          <Button 
            onClick={handleBook}
            disabled={!date || !time || loading}
            className="w-full h-24 bg-primary text-black rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(135,255,200,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Secure Session Uplink"}
          </Button>
        </div>
      </div>
    </div>
  );
}
