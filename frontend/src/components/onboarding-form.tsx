"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Loader2, Moon, Monitor, Activity, 
  Brain, Users, Zap, 
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createStudent, submitAssessment } from "@/lib/api";

type Stage = "parent" | "student" | "review";

interface FormDataState {
  studentName: string;
  grade: string;
  schoolType: string;
  extraSupport: string;
  academicUnderstanding: number;
  academicConsistency: number;
  subjectAvoidance: string;
  studyPattern: string;
  focusDuration: number;
  reminderDependency: number;
  sleepQuality: number;
  physicalActivity: number;
  screenBalance: number;
  testAnxiety: number;
  stressSpillover: number;
  setbackRecovery: number;
  learningOwnership: number;
  curiosityLevel: number;
  socialComfort: number;
  empathySignals: number;
  responsibilityPatterns: number;
  checkInFrequency: string;
  responseToPerformanceDrop: string;
  topConcerns: string[];
  studentUnderstanding: number;
  studentConfidence: number;
  studentEnjoyment: number;
  studentAttention: number;
  studentRecall: number;
  studentFatigue: number;
  studentStudyHabit: string;
  studentStudyEffectiveness: number;
  studentStressLevel: number;
  studentEffortPride: number;
  studentAskingQuestions: number;
  studentGroupWork: number;
  studentTimeManagement: number;
  studentTaskCompletion: number;
  studentHardThing: string;
}

export default function OnboardingForm() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("parent");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormDataState>({
    // Parent - Section A: Context
    studentName: "",
    grade: "",
    schoolType: "Public",
    extraSupport: "None",
    
    // Parent - Section B: Academic
    academicUnderstanding: 3,
    academicConsistency: 3,
    subjectAvoidance: "None",

    // Parent - Section C: Study & Routine
    studyPattern: "Mix",
    focusDuration: 3,
    reminderDependency: 3,

    // Parent - Section D: Neural & Lifestyle
    sleepQuality: 3,
    physicalActivity: 3,
    screenBalance: 3,

    // Parent - Section E: Emotional & Motivation
    testAnxiety: 3,
    stressSpillover: 3,
    setbackRecovery: 3,
    learningOwnership: 3,
    curiosityLevel: 3,

    // Parent - Section F: Social & Character
    socialComfort: 3,
    empathySignals: 3,
    responsibilityPatterns: 3,

    // Parent - Section G: Parent Context
    checkInFrequency: "Weekly",
    responseToPerformanceDrop: "Supportive",
    topConcerns: [],

    // Student - Section A: Self-Perception
    studentUnderstanding: 3,
    studentConfidence: 3,
    studentEnjoyment: 3,

    // Student - Section B: Focus & Cognition
    studentAttention: 3,
    studentRecall: 3,
    studentFatigue: 3,

    // Student - Section C: Study Behavior
    studentStudyHabit: "Regular",
    studentStudyEffectiveness: 3,
    studentStressLevel: 3,
    studentEffortPride: 3,

    // Student - Section D: Social & Life Skills
    studentAskingQuestions: 3,
    studentGroupWork: 3,
    studentTimeManagement: 3,
    studentTaskCompletion: 3,
    studentHardThing: ""
  });

  const parentSteps = 6;
  const studentSteps = 4;

  const handleNext = () => {
    if (stage === "parent") {
      if (step < parentSteps) setStep(s => s + 1);
      else {
        setStage("student");
        setStep(1);
      }
    } else if (stage === "student") {
      if (step < studentSteps) setStep(s => s + 1);
      else setStage("review");
    }
  };

  const handleBack = () => {
    if (stage === "student" && step === 1) {
      setStage("parent");
      setStep(parentSteps);
    } else if (stage === "review") {
      setStage("student");
      setStep(studentSteps);
    } else {
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const student = await createStudent({
        name: formData.studentName,
        grade_level: formData.grade,
        parent_id: "dummy-parent-id",
        school_type: formData.schoolType
      });

      await submitAssessment(student.id, "onboarding", {
        ...formData
      });

      router.push(`/dashboard/${student.id}`);
    } catch (error) {
      console.error("Onboarding failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderParentStep = () => {
    switch(step) {
      case 1: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Stage 01: Parent Context</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Baseline <br />Fundamentals.</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Context & Basics</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-primary">Student Name</Label>
              <Input 
                placeholder="Full Name / Nickname"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg px-6 focus:ring-primary text-white"
              />
            </div>
            <div className="space-y-4">
              <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-primary">Grade Level</Label>
              <Select onValueChange={(v) => setFormData({...formData, grade: v})} value={formData.grade}>
                <SelectTrigger className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg px-6 text-white">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  {["4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade"].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Stage 02: Academics</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Learning <br />Observations.</h2>
          </div>
          <div className="space-y-12 max-w-2xl mx-auto">
             {[
               { id: 'academicUnderstanding' as const, label: 'Material Understanding', desc: 'How well does your child grasp new concepts?' },
               { id: 'academicConsistency' as const, label: 'Performance Consistency', desc: 'How steady is their performance across different units?' },
             ].map((item) => (
               <div key={item.id} className="space-y-8">
                  <div className="flex justify-between items-center">
                    <Label className="text-xl font-black text-white uppercase tracking-tight">{item.label}</Label>
                    <span className="text-3xl font-black text-primary">{formData[item.id]}/5</span>
                  </div>
                  <Slider 
                    min={1} max={5} step={1} 
                    value={[formData[item.id]]} 
                    onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} 
                    className="py-4"
                  />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Stage 03: Routine</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Study & <br />Rhythms.</h2>
          </div>
          <div className="space-y-12 max-w-2xl mx-auto">
             {[
               { id: 'focusDuration' as const, label: 'Focus Duration', icon: <Zap className="w-5 h-5" /> },
               { id: 'reminderDependency' as const, label: 'Reminder Dependency', icon: <Users className="w-5 h-5" /> },
             ].map(item => (
               <div key={item.id} className="space-y-6">
                  <div className="flex justify-between items-center">
                     <Label className="flex items-center gap-3 text-lg font-black text-white uppercase">{item.icon} {item.label}</Label>
                     <span className="text-2xl font-black text-primary">{formData[item.id]}/5</span>
                  </div>
                  <Slider min={1} max={5} step={1} value={[formData[item.id]]} onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} />
               </div>
             ))}
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Stage 04: Neural Health</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Lifestyle <br />Modifiers.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { id: 'sleepQuality' as const, label: 'Sleep Quality', icon: <Moon className="w-8 h-8 text-indigo-400" /> },
               { id: 'physicalActivity' as const, label: 'Active Energy', icon: <Activity className="w-8 h-8 text-emerald-400" /> },
               { id: 'screenBalance' as const, label: 'Digital Balance', icon: <Monitor className="w-8 h-8 text-rose-400" /> },
             ].map(item => (
               <div key={item.id} className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-8 text-center group">
                  <div className="bg-white/5 p-6 rounded-3xl w-fit mx-auto group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="space-y-4">
                     <Label className="text-sm font-black text-white uppercase tracking-widest leading-tight">{item.label}</Label>
                     <div className="text-4xl font-black text-primary">{formData[item.id]}/5</div>
                     <Slider min={1} max={5} step={1} value={[formData[item.id]]} onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} />
                  </div>
               </div>
             ))}
          </div>
        </div>
      );
      case 5: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Stage 05: Inner State</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Resilience & <br />Agency.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
             <div className="space-y-10">
               {[
                 { id: 'testAnxiety' as const, label: 'Exam Resistance', desc: 'Ability to stay calm during tests.' },
                 { id: 'stressSpillover' as const, label: 'Stress Recovery', desc: 'Recovery after a bad day.' },
               ].map(item => (
                 <div key={item.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                       <Label className="text-sm font-black text-white uppercase tracking-widest">{item.label}</Label>
                       <span className="text-xl font-black text-primary">{formData[item.id]}/5</span>
                    </div>
                    <Slider min={1} max={5} step={1} value={[formData[item.id]]} onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} />
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{item.desc}</p>
                 </div>
               ))}
             </div>
             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 space-y-10">
                {[
                  { id: 'socialComfort' as const, label: 'Social Ease' },
                  { id: 'empathySignals' as const, label: 'Empathy Capacity' },
                ].map(item => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>{item.label}</span>
                      <span>{formData[item.id]}/5</span>
                    </div>
                    <Slider min={1} max={5} step={1} value={[formData[item.id]]} onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} />
                  </div>
                ))}
             </div>
          </div>
        </div>
      );
      case 6: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Stage 06: Support View</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Top <br />Concerns.</h2>
          </div>
          <div className="max-w-xl mx-auto">
             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 space-y-6">
                <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-accent">Primary Concerns (Select 2)</Label>
                <div className="grid grid-cols-2 gap-4">
                  {["Academic Focus", "Stress Levels", "Screen Time", "Social Skills", "Motivation", "Future Readiness"].map((concern) => (
                    <div key={concern} className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <Checkbox 
                        id={concern} 
                        checked={formData.topConcerns.includes(concern)}
                        onCheckedChange={(checked: boolean | string) => {
                          if (checked === true) {
                            if (formData.topConcerns.length < 2) {
                              setFormData({...formData, topConcerns: [...formData.topConcerns, concern]});
                            }
                          } else {
                            setFormData({...formData, topConcerns: formData.topConcerns.filter(c => c !== concern)});
                          }
                        }}
                      />
                      <label htmlFor={concern} className="text-xs font-black uppercase text-slate-300 cursor-pointer">{concern}</label>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  const renderStudentStep = () => {
    switch(step) {
      case 1: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="space-y-4 text-center">
            <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Student Phase: Discovery</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">How School <br />Feels.</h2>
          </div>
          <div className="space-y-12 max-w-2xl mx-auto">
             {[
               { id: 'studentUnderstanding' as const, label: 'I understand what we learn' },
               { id: 'studentConfidence' as const, label: 'I feel confident during tests' },
             ].map((item) => (
               <div key={item.id} className="space-y-6 bg-white/2 rounded-3xl p-8 border border-white/5">
                  <Label className="text-lg font-black text-white px-2 uppercase">{item.label}</Label>
                  <Slider min={1} max={5} step={1} value={[formData[item.id]]} onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} />
               </div>
             ))}
          </div>
        </div>
      );
      case 2: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Student Phase: Mindset</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Focus & <br />Energy.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {[
               { id: 'studentAttention' as const, label: 'Staying Focused', icon: <Zap className="w-8 h-8 text-amber-400" /> },
               { id: 'studentRecall' as const, label: 'Remembering Later', icon: <Brain className="w-8 h-8 text-indigo-400" /> },
             ].map(item => (
               <div key={item.id} className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-8 text-center">
                  <div className="mx-auto">{item.icon}</div>
                  <div className="space-y-4">
                     <Label className="text-sm font-black text-white uppercase tracking-widest leading-tight">{item.label}</Label>
                     <div className="text-4xl font-black text-accent">{formData[item.id]}/5</div>
                     <Slider min={1} max={5} step={1} value={[formData[item.id]]} onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} />
                  </div>
               </div>
             ))}
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Student Phase: Effort</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Pride in <br />Work.</h2>
          </div>
          <div className="max-w-rl mx-auto">
             <div className="space-y-12">
                {[
                  { id: 'studentStressLevel' as const, label: 'Stress Level' },
                  { id: 'studentEffortPride' as const, label: 'Pride in Effort' },
                ].map(item => (
                  <div key={item.id} className="space-y-6">
                     <div className="flex justify-between items-center px-4">
                       <Label className="text-lg font-black text-white uppercase">{item.label}</Label>
                       <span className="text-2xl font-black text-accent">{formData[item.id]}/5</span>
                     </div>
                     <Slider min={1} max={5} step={1} value={[formData[item.id]]} onValueChange={([v]: number[]) => setFormData({...formData, [item.id]: v})} />
                  </div>
                ))}
             </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="space-y-4 text-center">
            <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Student Phase: Character</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Hardest <br />Thing.</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
             <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-accent">One thing that feels hard right now is...</Label>
             <textarea 
               value={formData.studentHardThing}
               onChange={(e) => setFormData({...formData, studentHardThing: e.target.value})}
               className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg focus:outline-none focus:ring-1 ring-accent placeholder:text-slate-700"
               placeholder="Type your answer here..."
             />
          </div>
        </div>
      );
      default: return null;
    }
  };

  const renderReview = () => {
    return (
      <div className="space-y-12 text-center animate-in zoom-in duration-500">
        <div className="space-y-4">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-2 font-black uppercase tracking-[0.4em] text-xs">Final Synchronization</Badge>
          <h2 className="text-7xl font-black text-gradient tracking-tighter uppercase leading-[0.85]">Protocol <br />Established.</h2>
          <p className="max-w-xl mx-auto text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Ready to process the holistic growth baseline for {formData.studentName}.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Progress Architecture */}
      <div className="mb-20 space-y-8">
         <div className="flex justify-between items-center px-6">
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${stage === 'parent' ? 'bg-primary' : 'bg-primary/20'}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${stage === 'parent' ? 'text-white' : 'text-slate-600'}`}>Parent Stage</span>
            </div>
            <div className={`h-px flex-1 mx-8 ${stage === 'student' ? 'bg-accent/40' : 'bg-white/5'}`} />
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${stage === 'student' ? 'bg-accent shadow-[0_0_15px_rgba(255,100,200,0.5)]' : 'bg-accent/20'}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${stage === 'student' ? 'text-white' : 'text-slate-600'}`}>Student Stage</span>
            </div>
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${stage}-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="glass border-none rounded-[4rem] overflow-hidden">
            <CardContent className="p-10 md:p-20">
              {stage === "parent" && renderParentStep()}
              {stage === "student" && renderStudentStep()}
              {stage === "review" && renderReview()}

              <div className="mt-20 flex justify-between items-center px-4">
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={(stage === "parent" && step === 1) || loading}
                  className="px-12 h-18 rounded-3xl font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white/5 hover:text-white transition-all disabled:opacity-0"
                >
                  Regress
                </Button>
                
                {stage !== "review" ? (
                  <Button 
                    onClick={handleNext}
                    className={`px-16 h-20 rounded-[2.5rem] font-black text-lg uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-1 active:scale-95 group ${stage === 'parent' ? 'bg-primary text-primary-foreground shadow-primary/20' : 'bg-accent text-white shadow-accent/20'}`}
                  >
                    Sync Next
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-white text-slate-950 px-24 h-24 rounded-[3.5rem] font-black text-2xl uppercase tracking-tighter shadow-[0_0_80px_rgba(255,255,255,0.4)] transition-all hover:scale-105 active:scale-95"
                  >
                    {loading ? <Loader2 className="w-8 h-8 animate-spin mr-3" /> : 'Launch Intelligence'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
