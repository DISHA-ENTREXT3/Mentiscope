"use client";

import { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip,
  Area, AreaChart, XAxis, YAxis
} from "recharts";
import { 
  TrendingUp, TrendingDown, Minus, AlertTriangle, 
  Brain, Zap, Activity, Sparkles, Loader2,
  CheckCircle2, AlertCircle, MessageSquare, HelpCircle, Calendar,
  Shield, Target, Globe, ArrowRight, MousePointer2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStudentDashboard, createCheckoutSession, triggerAnalysis } from "@/lib/api";
import { Student } from "@/types";

interface Dimension {
  name: string;
  status: 'Strong' | 'Developing' | 'Needs Support';
  trend: 'up' | 'down' | 'stable';
  score: number;
  scientific_backing?: string;
}

interface Action {
  task: string;
  type: 'Immediate' | 'Habit';
}

interface ActionPlanData {
  student_actions?: Action[];
  parent_actions?: Action[];
  environment_adjustments?: string[];
}

interface PerceptionGap {
  gap_score: number;
  misalignment: string;
  synergy_tip: string;
}

interface TrajectoryData {
  current: number;
  projected_30d: number;
  projected_90d: number;
  growth_driver: string;
}


interface Strength {
  title: string;
  explanation: string;
}

interface SupportArea {
  title: string;
  explanation: string;
}

interface Risk {
  name: string;
  observations: string;
  why_it_matters: string;
  urgency: 'Low' | 'Watch' | 'Focus';
}

interface CommGuidance {
  recommended_tone?: string;
  to_encourage?: string[];
  to_avoid?: string[];
  frequency?: string;
}

interface ExplainabilityData {
  insight: string;
  inputs_matter: string[];
  observation: string;
  why_it_matters: string;
  expected_impact: string;
}

interface ScientificCitation {
  title: string;
  authors: string;
  year: number;
  relevance_to_child: string;
}

interface AnalysisResults {
  dashboard_summary?: string;
  overall_growth_summary?: string;
  confidence_level?: number;
  perception_gap?: PerceptionGap;
  trajectory?: TrajectoryData;
  dimensions?: Dimension[];
  strengths?: Strength[];
  support_areas?: SupportArea[];
  risks?: Risk[];
  action_plan?: ActionPlanData;
  communication_guidance?: CommGuidance;
  explainability?: ExplainabilityData[];
  scientific_references?: ScientificCitation[];
}

export default function DashboardPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setSyncing(true);
      const data = await getStudentDashboard(studentId);
      setStudent(data);
    } catch (err) {
      console.error("Dashboard failed:", err);
      setError("Luminous data sync failed.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [studentId]);

  const handleTriggerAnalysis = async () => {
    try {
      setAnalyzing(true);
      await triggerAnalysis(studentId);
      await fetchData();
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpgrade = async () => {
    if (!student) return;
    try {
      const { url } = await createCheckoutSession(student.parent_id);
      window.location.href = url;
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Neural sync protocol failed to initialize.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-6">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-t-4 border-primary rounded-full glow"
      />
      <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Growth Intelligence...</p>
    </div>
  );

  if (error || !student) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center space-y-8">
      <div className="p-8 rounded-[3rem] glass max-w-md">
        <AlertTriangle className="w-16 h-16 text-accent mx-auto mb-6" />
        <h2 className="text-3xl font-black text-gradient mb-2">Sync Refracted</h2>
        <p className="text-slate-400 mb-8 font-medium">Your data stream was interrupted. This usually happens after a mainframe recalibration.</p>
        <Link href="/onboarding">
          <Button className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black">Return to Uplink</Button>
        </Link>
      </div>
    </div>
  );

  const latestAssessment = student.assessments?.[0];
  let analysis = (latestAssessment?.analysis_results || {}) as AnalysisResults | string;
  
  if (typeof analysis === 'string') {
    try {
      analysis = JSON.parse(analysis) as AnalysisResults;
    } catch (e) {
      console.error("Failed to parse neural synthesis results:", e);
      analysis = {} as AnalysisResults;
    }
  }
  
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-rose-400" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Strong') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'Developing') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const dashboardSummary: string = analysis.dashboard_summary || "Analyzing your child's unique learning journey...";
  const growthSummary: string = analysis.overall_growth_summary || "";
  const confidenceLevel: number = analysis.confidence_level || 0;
  const synergy: PerceptionGap = analysis.perception_gap || { gap_score: 0, misalignment: "Awaiting data...", synergy_tip: "Complete all assessments for insights." };
  const trajectory: TrajectoryData = analysis.trajectory || { current: 0, projected_30d: 0, projected_90d: 0, growth_driver: "Consistency" };
  const dimensions: Dimension[] = analysis.dimensions || [];
  const strengths: Strength[] = analysis.strengths || [];
  const supportAreas: SupportArea[] = analysis.support_areas || [];
  const risks: Risk[] = analysis.risks || [];
  const actionPlan: ActionPlanData = analysis.action_plan || {};
  const comms: CommGuidance = analysis.communication_guidance || {};
  const explainability: ExplainabilityData[] = analysis.explainability || [];
  const scientificCitations: ScientificCitation[] = analysis.scientific_references || [];

  const trajectoryChartData = [
    { name: 'Current', score: trajectory.current },
    { name: 'Day 30', score: trajectory.projected_30d },
    { name: 'Day 90', score: trajectory.projected_90d },
  ];

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-12 space-y-16 animate-in fade-in duration-1000">
      
      {/* Header Architecture */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 font-black text-[10px] tracking-[0.4em] uppercase">Standard Protocol Active</Badge>
             <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                <span className={`w-2 h-2 rounded-full ${(syncing || analyzing) ? 'bg-amber-400 animate-ping' : 'bg-primary animate-pulse'}`} />
                {(syncing || analyzing) ? 'Synthesizing Telemetry...' : 'Standard Mapping Enabled'}
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mix-blend-lighten">Growth <br />Architecture.</h1>
            <p className="text-slate-400 font-medium text-2xl uppercase tracking-tighter">Holistic Mapping: <span className="text-white font-black">{student.name}</span></p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={fetchData}
            disabled={syncing || analyzing}
            className="bg-white/5 text-white border border-white/10 rounded-2xl px-10 h-20 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
          >
            {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />}
            Resync Baseline
          </Button>
          <Button 
            onClick={handleTriggerAnalysis}
            disabled={analyzing || syncing}
            className="bg-primary text-black rounded-2xl px-12 h-20 text-lg font-black shadow-[0_0_50px_rgba(135,255,200,0.3)] transition-all hover:scale-105 active:scale-95 group relative"
          >
            <Sparkles className="mr-3 w-6 h-6 group-hover:rotate-180 transition-all duration-700" />
            Standard Synthesis
            <div className="absolute -top-3 -right-3 bg-white text-[8px] px-2 py-1 rounded-full text-black font-bold tracking-tighter">FREE</div>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">

        {/* Predictive Trajectory Card (Innovative) */}
        <Card className="lg:col-span-8 glass border-none rounded-[4rem] p-12 bg-linear-to-br from-primary/5 to-background border border-white/5 relative overflow-hidden group">
           <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <Badge className="bg-primary/20 text-primary px-3 uppercase text-[9px] tracking-widest font-black">Predictive Neural Trajectory</Badge>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Readiness <br />Projection.</h3>
                 </div>
                 <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Growth Driver</p>
                    <p className="text-xl font-black text-primary uppercase">{trajectory.growth_driver}</p>
                 </div>
              </div>

              <div className="h-[300px] mt-8 min-h-[300px]">
                 <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                    <AreaChart data={trajectoryChartData}>
                       <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Area 
                         type="monotone" 
                         dataKey="score" 
                         stroke="var(--primary)" 
                         strokeWidth={4} 
                         fillOpacity={1} 
                         fill="url(#colorScore)" 
                         animationDuration={2000}
                       />
                       <XAxis dataKey="name" hide />
                       <YAxis hide domain={[0, 100]} />
                       <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '1rem', fontWeight: 'bold' }}
                        itemStyle={{ color: 'var(--primary)' }}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Status</p>
                    <p className="text-2xl font-black text-white">{trajectory.current}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">30 Day Forecast</p>
                    <p className="text-2xl font-black text-primary">+{trajectory.projected_30d - trajectory.current}pts</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">90 Day Vision</p>
                    <p className="text-2xl font-black text-accent">+{trajectory.projected_90d - trajectory.current}pts</p>
                 </div>
              </div>
           </div>
        </Card>

        {/* Synergy Meter (Innovative Perception Gap) */}
        <Card className="lg:col-span-4 glass border-none rounded-[4rem] p-12 bg-linear-to-b from-accent/5 to-background border border-white/5 flex flex-col justify-between">
           <div className="space-y-8">
              <div className="space-y-2">
                 <Badge className="bg-accent/20 text-accent px-3 uppercase text-[9px] tracking-widest font-black">Parent-Student Synergy</Badge>
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Perception <br />Gap.</h3>
              </div>
              
              <div className="relative h-48 flex items-center justify-center">
                 <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${synergy.gap_score}%` }}
                      className="h-full bg-accent"
                    />
                 </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] text-center">
                    <p className="text-6xl font-black text-white leading-none">{synergy.gap_score}%</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Divergence Score</p>
                 </div>
                 <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest">
                    <span>Synchronized</span>
                    <span>Misaligned</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Target className="w-3 h-3" /> Core Misalignment
                    </p>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed italic">&quot;{synergy.misalignment}&quot;</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Shield className="w-3 h-3" /> Synergy Action
                    </p>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed">{synergy.synergy_tip}</p>
                 </div>
              </div>
           </div>
        </Card>

        {/* Deep Analysis Banner (Attractive Integration) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-12 glass border-none rounded-[4rem] p-12 md:p-20 bg-linear-to-br from-primary/10 via-background to-accent/5 overflow-hidden group border border-white/5 relative"
        >
          <div className="relative z-10 grid md:grid-cols-4 gap-12 items-center">
             <div className="md:col-span-3 space-y-10">
                <div className="flex items-center gap-4">
                  <Badge className="bg-white/5 text-slate-300 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase border border-white/10">Strategic Narrative</Badge>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="space-y-6">
                   <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 glow">
                         <Brain className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-widest italic decoration-primary/20 underline underline-offset-10">
                         &quot;{dashboardSummary}&quot;
                      </h2>
                   </div>
                   {growthSummary && (
                      <p className="text-2xl font-medium text-slate-400 leading-relaxed max-w-5xl">
                         {growthSummary}
                      </p>
                   )}
                </div>
             </div>
             <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 text-center space-y-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-primary/5 blur-3xl" />
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Neural Confidence</p>
                   <p className="text-7xl font-black text-primary leading-none">{confidenceLevel}%</p>
                   <div className="mt-4 flex justify-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-2 h-6 rounded-full ${i <= (confidenceLevel / 20) ? 'bg-primary' : 'bg-white/5'}`} />
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Existing Growth Matrix Section */}
        <Card className="lg:col-span-8 glass border-none rounded-[4rem] p-12 space-y-12">
           <div className="flex justify-between items-end">
              <div className="space-y-3">
                 <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 uppercase text-[9px] tracking-widest">Whole-Child Model</Badge>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Growth Matrix.</h2>
              </div>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Across 8 Core Domains</p>
           </div>
           <div className="grid md:grid-cols-2 gap-6">
              {dimensions.map((dim: Dimension, i: number) => (
                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-all">
                   <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-xl bg-white/5 ${getStatusColor(dim.status)} border-none shadow-2xl`}>
                            {i % 2 === 0 ? <Zap className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                         </div>
                         <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{dim.name}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                         <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest uppercase border ${getStatusColor(dim.status)}`}>
                            {dim.status}
                         </Badge>
                         <div className="flex items-center gap-1.5">
                            {getTrendIcon(dim.trend)}
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{dim.trend}</span>
                         </div>
                      </div>
                      {/* Dimension Scientific Backing */}
                      {dim.scientific_backing && (
                         <div className="pt-2 flex items-start gap-2 max-w-[200px]">
                            <Globe className="w-3 h-3 text-primary/40 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-500 italic leading-tight">{dim.scientific_backing}</p>
                         </div>
                      )}
                   </div>
                   <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                         <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                         <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${dim.score * 1.76} 176`} className="text-primary" />
                      </svg>
                      <span className="text-xs font-black text-white">{dim.score}</span>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        {/* Cognitive Topology - Radar */}
        <Card className="lg:col-span-4 glass border-none rounded-[4rem] p-12 flex flex-col justify-between space-y-12">
           <div className="space-y-3">
              <Badge className="bg-accent/10 text-accent border-accent/20 px-3 uppercase text-[9px] tracking-widest">Neural Topology</Badge>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Processor <br />Balance.</h3>
           </div>
           
           <div className="flex-1 flex items-center justify-center bg-white/5 rounded-[3.5rem] border border-white/5 relative p-4 min-h-[350px]">
              <ResponsiveContainer width="100%" height={320} minHeight={320}>
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dimensions.map((d: Dimension) => ({ subject: d.name.split(' ')[0], A: d.score }))}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="subject" stroke="#666" fontSize={9} fontWeight="black" />
                    <Radar name="Student" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '1rem', fontWeight: 'bold' }} />
                 </RadarChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white/5 rounded-full pointer-events-none opacity-20" />
           </div>

           <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Top Proficiency Pillars</p>
              <div className="flex flex-wrap justify-center gap-2">
                 {strengths.slice(0, 3).map((s: Strength, i:number) => (
                   <span key={i} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[9px] font-black uppercase tracking-widest">{s.title}</span>
                 ))}
              </div>
           </div>
        </Card>

        {/* Strengths & Support areas */}
        <div className="lg:col-span-12 grid md:grid-cols-2 gap-10">
           {/* Section 2: Strengths */}
           <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Leverage Points.</h3>
              </div>
              <div className="grid gap-6">
                 {strengths.map((s: Strength, i: number) => (
                   <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] space-y-4 hover:border-emerald-500/30 transition-all">
                      <h4 className="text-xl font-black text-white uppercase">{s.title}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{s.explanation}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Section 3: Areas to Watch */}
           <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                    <AlertCircle className="w-6 h-6" />
                 </div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Support Areas.</h3>
              </div>
              <div className="grid gap-6">
                 {supportAreas.map((s: SupportArea, i: number) => (
                   <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] space-y-4 hover:border-amber-500/30 transition-all">
                      <h4 className="text-xl font-black text-white uppercase">{s.title}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{s.explanation}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Early Risk signals */}
        <Card className="lg:col-span-12 glass border-none rounded-[4rem] p-12 space-y-12 bg-linear-to-r from-background to-rose-500/5 border border-rose-500/10">
           <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                 <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Early Warning Signals.</h3>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Non-alarming behavioral patterns requiring observation.</p>
              </div>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {risks.length > 0 ? risks.map((r: Risk, i: number) => (
                <div key={i} className="relative group">
                   <div className="absolute inset-0 bg-rose-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative bg-white/5 border border-white/5 p-10 rounded-[3rem] space-y-6 h-full flex flex-col">
                      <div className="flex justify-between items-start">
                         <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest uppercase ${r.urgency === 'Focus' ? 'bg-rose-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                            {r.urgency} Urgency
                         </Badge>
                         <HelpCircle className="w-4 h-4 text-slate-700" />
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase leading-tight line-clamp-2">{r.name}</h4>
                      <div className="space-y-4 flex-1">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Observations</p>
                            <p className="text-sm text-slate-300 line-clamp-3">{r.observations}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Why it matters</p>
                            <p className="text-sm text-slate-300 line-clamp-3">{r.why_it_matters}</p>
                         </div>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="col-span-3 py-10 bg-emerald-500/5 rounded-[4rem] border border-dashed border-emerald-500/20 text-center">
                   <p className="text-emerald-400 font-black uppercase tracking-widest">No Priority Risk Signals Detected at This Calibration.</p>
                </div>
              )}
           </div>
        </Card>

        {/* Section 4: Action Plan Architecture (Result Oriented Categorization) */}
        <div className="lg:col-span-12 space-y-12 pt-10">
           <div className="text-center md:text-left space-y-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.4em]">Strategic Recovery Protocol</Badge>
              <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">The Action Map.</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-10">
              {/* Student actions */}
              <div className="space-y-8">
                 <div className="flex items-center gap-4 px-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary text-black flex items-center justify-center font-black shadow-lg shadow-primary/20">S</div>
                    <div>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tight">For Student</h4>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Structure • Focus • Accountability</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {actionPlan.student_actions?.map((act: Action, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-4 group hover:border-primary/40 transition-all relative overflow-hidden">
                         <div className="flex justify-between items-start relative z-10">
                            <div className={`p-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${act.type === 'Immediate' ? 'bg-primary text-black border-primary' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                               {act.type === 'Immediate' ? 'Actionable Now' : 'Habitual Protocol'}
                            </div>
                            {act.type === 'Immediate' && <MousePointer2 className="w-4 h-4 text-primary animate-bounce" />}
                         </div>
                         <p className="text-md font-bold text-slate-300 leading-relaxed relative z-10">{act.task}</p>
                         {act.type === 'Immediate' && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />}
                      </div>
                    ))}
                 </div>
              </div>

              {/* Parent actions */}
              <div className="space-y-8">
                 <div className="flex items-center gap-4 px-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center font-black shadow-lg shadow-accent/20">P</div>
                    <div>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tight">For Parent</h4>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reinforcement • Atmosphere • Synergy</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {actionPlan.parent_actions?.map((act: Action, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-4 group hover:border-accent/40 transition-all relative overflow-hidden">
                         <div className="flex justify-between items-start relative z-10">
                            <div className={`p-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${act.type === 'Immediate' ? 'bg-accent text-white border-accent' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                               {act.type === 'Immediate' ? 'Execute Today' : 'Daily Practice'}
                            </div>
                            <Activity className="w-4 h-4 text-accent/40" />
                         </div>
                         <p className="text-md font-bold text-slate-300 leading-relaxed relative z-10">{act.task}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Environment adjustments */}
              <div className="space-y-8">
                 <div className="flex items-center gap-4 px-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black shadow-lg">E</div>
                    <div>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tight">Environmental</h4>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Atmospheric • Digital • Spatial</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {actionPlan.environment_adjustments?.map((act: any, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex gap-6 group hover:border-white/40 transition-all">
                         <div className="w-6 h-6 rounded-full border border-white/20 shrink-0 mt-1 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Globe className="w-3 h-3 text-slate-600" />
                         </div>
                         <p className="text-md font-bold text-slate-300 border-none leading-relaxed">
                           {typeof act === 'object' ? act.task || JSON.stringify(act) : act}
                         </p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Premium AI Teaser (Innovative Monetization) */}
        <Card className="lg:col-span-12 glass border-none rounded-[4rem] p-12 md:p-20 bg-linear-to-br from-indigo-500/10 via-background to-purple-500/5 relative overflow-hidden group border border-indigo-500/20">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-6">
                 <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.4em]">Neural Protocol Upgrade</Badge>
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">Deep AI <br />Insights.</h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                    Unlock the full potential of our Neural Engine. Get personalized, psychology-backed observations and long-term trajectory mapping powered by advanced GPT-4 architectures.
                 </p>
                 <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="h-16 px-10 rounded-2xl border-indigo-500/30 text-indigo-300 font-black uppercase text-xs tracking-widest hover:bg-indigo-500/10">Join the Waitlist</Button>
                 </div>
              </div>
              <div className="w-64 h-64 bg-white/5 rounded-full border border-white/10 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-indigo-500/10 animate-pulse rounded-full" />
                 <Sparkles className="w-20 h-20 text-indigo-400 animate-bounce" />
              </div>
           </div>
        </Card>

        {/* Support Layers Grid */}
        <div className="lg:col-span-8 grid md:grid-cols-2 gap-10">
           {/* Section 6: Communication Guidance */}
           <Card className="glass border-none rounded-[4rem] p-12 space-y-10">
              <div className="flex items-center gap-4">
                 <MessageSquare className="w-8 h-8 text-indigo-400" />
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Comms Guidance.</h3>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Supportive Tone</p>
                    <p className="text-2xl font-black text-white leading-tight italic decoration-emerald-500/20 underline underline-offset-8">
                       &quot;{comms.recommended_tone}&quot;
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Encourage</p>
                        <ul className="space-y-2">
                           {Array.isArray(comms.to_encourage) && comms.to_encourage.map((item: string, i: number) => (
                             <li key={i} className="text-xs font-bold text-slate-400 flex items-start gap-2">
                               <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> {item}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avoid</p>
                        <ul className="space-y-2">
                           {Array.isArray(comms.to_avoid) && comms.to_avoid.map((item: string, i: number) => (
                             <li key={i} className="text-xs font-bold text-slate-400 flex items-start gap-2">
                               <AlertCircle className="w-3 h-3 text-rose-500 mt-0.5" /> {item}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Check-in Rhythm</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">{comms.frequency}</Badge>
                 </div>
              </div>
           </Card>

           {/* Section 5: Why These Suggestions (Explainability) */}
           <Card className="glass border-none rounded-[4rem] p-12 space-y-10">
              <div className="flex items-center gap-4">
                 <HelpCircle className="w-8 h-8 text-primary" />
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Why These?</h3>
              </div>
              <div className="space-y-8 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                 {explainability.map((exp: ExplainabilityData, i: number) => (
                   <div key={i} className="space-y-4 pb-8 border-b border-white/5 last:border-none">
                      <div className="flex items-center justify-between">
                         <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{exp.insight}</h4>
                         <Sparkles className="w-4 h-4 text-primary/40" />
                      </div>
                      <div className="grid gap-4">
                         <p className="text-sm font-medium text-slate-300 leading-relaxed">{exp.observation}</p>
                         <p className="text-[11px] font-black text-accent uppercase tracking-widest leading-relaxed p-4 bg-accent/5 rounded-2xl border border-accent/10">
                            Reasoning: {exp.why_it_matters}
                         </p>
                         <p className="text-xs font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                            <ArrowRight className="w-3 h-3" /> Expected Impact: {exp.expected_impact}
                         </p>
                      </div>
                   </div>
                 ))}
                 
                 {/* Scientific References Section */}
                 {scientificCitations.length > 0 && (
                   <div className="pt-8 space-y-6">
                      <div className="flex items-center gap-3">
                         <Shield className="w-5 h-5 text-emerald-400" />
                         <h4 className="text-xl font-black text-white uppercase tracking-tighter">Scientific Foundation</h4>
                      </div>
                      <div className="space-y-4">
                         {scientificCitations.map((cite, i) => (
                           <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl space-y-3">
                              <p className="text-[11px] font-black text-white uppercase leading-tight">{cite.title}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">{cite.authors} ({cite.year})</p>
                              <div className="h-px bg-emerald-500/10 w-full" />
                              <p className="text-[10px] text-emerald-400/80 italic font-medium leading-relaxed">{cite.relevance_to_child}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
           </Card>
        </div>

        {/* Section 7: Next Check-in */}
        <Card className="lg:col-span-4 glass border-none rounded-[4rem] p-12 bg-linear-to-b from-primary/20 to-background flex flex-col items-center justify-center text-center space-y-10 border border-primary/10 relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
           <div className="relative z-10 space-y-6">
              <Calendar className="w-20 h-20 text-primary mx-auto opacity-20 group-hover:scale-110 transition-transform duration-700" />
              <div className="space-y-3">
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Resync <br />Protocol.</h3>
                 <p className="text-slate-400 font-medium text-sm">We recommend a full neural recalibration <br />in <span className="text-white font-black">2-4 weeks</span> for baseline trend-mapping.</p>
              </div>
           </div>
           <div className="w-full space-y-4 relative z-10">
              <Button className="w-full h-20 rounded-[2.5rem] bg-white text-black font-black uppercase text-lg transition-all hover:scale-105 shadow-2xl">Schedule Recalibration</Button>
              <div className="flex justify-between gap-4">
                 <Button onClick={handleUpgrade} variant="outline" className="flex-1 h-14 rounded-2xl border-white/5 bg-white/5 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Precision Upscale</Button>
                 <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/5 bg-white/5 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Export Map</Button>
              </div>
           </div>
        </Card>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
