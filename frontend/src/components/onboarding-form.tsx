"use client";

import { useState, useEffect } from "react";
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
  ChevronRight, Plus, Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createStudent, submitAssessment } from "@/lib/api";
import { auth } from "@/lib/firebase";

type Stage = "parent" | "academic" | "student" | "review" | "success";

interface AcademicMark {
  subject: string;
  mark: number;
}

interface FormDataState {
  studentName: string;
  grade: string;
  schoolType: string;
  extraSupport: string;
  
  // Academic Marks mapping
  academicMarks: AcademicMark[];

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
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserId(user.uid);
  }, []);
  
  const [formData, setFormData] = useState<FormDataState>({
    studentName: "",
    grade: "",
    schoolType: "Public",
    extraSupport: "None",
    academicMarks: [
        { subject: "Mathematics", mark: 0 },
        { subject: "Language Arts", mark: 0 },
        { subject: "Science", mark: 0 }
    ],
    academicUnderstanding: 3,
    academicConsistency: 3,
    subjectAvoidance: "None",
    studyPattern: "Mix",
    focusDuration: 3,
    reminderDependency: 3,
    sleepQuality: 3,
    physicalActivity: 3,
    screenBalance: 3,
    testAnxiety: 3,
    stressSpillover: 3,
    setbackRecovery: 3,
    learningOwnership: 3,
    curiosityLevel: 3,
    socialComfort: 3,
    empathySignals: 3,
    responsibilityPatterns: 3,
    checkInFrequency: "Weekly",
    responseToPerformanceDrop: "Supportive",
    topConcerns: [],
    studentUnderstanding: 3,
    studentConfidence: 3,
    studentEnjoyment: 3,
    studentAttention: 3,
    studentRecall: 3,
    studentFatigue: 3,
    studentStudyHabit: "Regular",
    studentStudyEffectiveness: 3,
    studentStressLevel: 3,
    studentEffortPride: 3,
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
        setStage("academic");
        setStep(1);
      }
    } else if (stage === "academic") {
        setStage("student");
        setStep(1);
    } else if (stage === "student") {
      if (step < studentSteps) setStep(s => s + 1);
      else setStage("review");
    }
  };

  const handleBack = () => {
    if (stage === "academic") {
        setStage("parent");
        setStep(parentSteps);
    } else if (stage === "student" && step === 1) {
      setStage("academic");
      setStep(1);
    } else if (stage === "review") {
      setStage("student");
      setStep(studentSteps);
    } else {
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
        alert("Session expired. Please log in again.");
        return;
    }
    setLoading(true);
    try {
      const student = await createStudent({
        name: formData.studentName,
        grade_level: formData.grade,
        parent_id: userId,
        school_type: formData.schoolType
      });

      if (student.raw_password) {
        setTempPassword(student.raw_password);
        setStage("success");
      }

      await submitAssessment(student.id, "onboarding", {
        ...formData
      });

      // If we have a password, we'll show it before redirecting.
      // If not, we redirect now.
      if (!student.raw_password) {
        router.push(`/dashboard/${student.id}`);
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSuccess = () => {
    return (
      <div className="space-y-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Zap className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Neural Link <br />Established.</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto">Student profile has been encrypted and integrated. Provide these credentials to the student for independent uplink.</p>
        </div>

        <div className="grid gap-6 p-10 bg-white/5 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <Label className="uppercase text-[10px] font-black tracking-[0.4em] text-primary">Student Neural ID</Label>
              <div className="text-3xl font-black text-white tracking-widest bg-white/5 py-4 rounded-2xl border border-white/10">
                PENDING_ID
              </div>
            </div>
            <div className="space-y-3">
              <Label className="uppercase text-[10px] font-black tracking-[0.4em] text-primary">Access Key (10 Chars)</Label>
              <div className="text-3xl font-black text-primary tracking-[0.5em] bg-primary/10 py-4 rounded-2xl border border-primary/20">
                {tempPassword}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <Button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-20 bg-primary text-primary-foreground rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
           >
             Enter Mainframe
           </Button>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Store these securely. Hashed encryption prevents recovery.</p>
        </div>
      </div>
    );
  };

  const addSubject = () => {
    setFormData({
        ...formData,
        academicMarks: [...formData.academicMarks, { subject: "", mark: 0 }]
    });
  };

  const removeSubject = (index: number) => {
    setFormData({
        ...formData,
        academicMarks: formData.academicMarks.filter((_, i) => i !== index)
    });
  };

  const updateMark = (index: number, field: keyof AcademicMark, value: string | number) => {
    const newMarks = [...formData.academicMarks];
    newMarks[index] = { ...newMarks[index], [field]: value };
    setFormData({ ...formData, academicMarks: newMarks });
  };

  const renderParentStep = () => {
    switch(step) {
      case 1: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Stage 01: Parent Context</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Baseline <br />Fundamentals.</h2>
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
                  {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map(g => (
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
               </div>
             ))}
          </div>
        </div>
      );
      // ... (other cases 3,4,5,6 copied but adapted if needed)
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
                        onCheckedChange={(checked: boolean) => {
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

  const renderAcademicStep = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4 text-center">
                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 px-4 py-1 font-black text-[10px] tracking-[0.3em] uppercase">Academic Excellence Mapping</Badge>
                <h2 className="text-5xl md:text-6xl font-black text-gradient tracking-tighter uppercase leading-none">Performance <br />Metrics.</h2>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Enter recent marks to map academic patterns</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid gap-6">
                    {formData.academicMarks.map((m, i) => (
                        <div key={i} className="flex items-center gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/5 group">
                            <div className="flex-1 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject</Label>
                                <Input 
                                    value={m.subject}
                                    onChange={(e) => updateMark(i, 'subject', e.target.value)}
                                    placeholder="e.g. Mathematics"
                                    className="h-14 bg-transparent border-none text-xl font-black text-white focus:ring-0 px-0"
                                />
                            </div>
                            <div className="w-32 space-y-2 text-right">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Marks (%)</Label>
                                <Input 
                                    type="number"
                                    value={m.mark}
                                    onChange={(e) => updateMark(i, 'mark', parseInt(e.target.value) || 0)}
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-center text-xl font-black text-primary focus:ring-primary"
                                />
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => removeSubject(i)}
                                className="h-14 w-14 rounded-2xl hover:bg-rose-500/20 hover:text-rose-400"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                </div>
                
                <Button 
                    onClick={addSubject}
                    className="w-full h-16 rounded-[2rem] border-2 border-dashed border-white/10 bg-transparent text-slate-500 font-black uppercase tracking-widest hover:bg-white/5 hover:border-white/20 transition-all"
                >
                    <Plus className="mr-2 w-5 h-5" /> Add Subject Dimension
                </Button>
            </div>
        </div>
    );
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
          <div className="max-w-xl mx-auto">
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
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${stage === 'parent' ? 'text-white' : 'text-slate-600'}`}>Parent Context</span>
            </div>
            <div className={`h-px flex-1 mx-8 ${(stage === 'academic' || stage === 'student' || stage === 'review') ? 'bg-primary/40' : 'bg-white/5'}`} />
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${stage === 'academic' ? 'bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-violet-500/20'}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${stage === 'academic' ? 'text-white' : 'text-slate-600'}`}>Academic Mapping</span>
            </div>
            <div className={`h-px flex-1 mx-8 ${(stage === 'student' || stage === 'review') ? 'bg-accent/40' : 'bg-white/5'}`} />
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${stage === 'student' ? 'bg-accent shadow-[0_0_15px_rgba(255,100,200,0.5)]' : 'bg-accent/20'}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${stage === 'student' ? 'text-white' : 'text-slate-600'}`}>Student Phase</span>
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
              {stage === "academic" && renderAcademicStep()}
              {stage === "student" && renderStudentStep()}
              {stage === "review" && renderReview()}
              {stage === "success" && renderSuccess()}

              {stage !== "success" && (
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
                      className={`px-16 h-20 rounded-[2.5rem] font-black text-lg uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-1 active:scale-95 group ${stage === 'parent' ? 'bg-primary text-primary-foreground shadow-primary/20' : stage === 'academic' ? 'bg-violet-600 text-white shadow-violet-500/20' : 'bg-accent text-white shadow-accent/20'}`}
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
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
