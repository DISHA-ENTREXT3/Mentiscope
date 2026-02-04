"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, LineChart, FileText, Settings, 
  LogOut, Bell, Activity, Sparkles, Terminal,
  Cpu
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const studentId = pathname.split('/')[2] || "demo-student-id";

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sleek Glass Sidebar */}
      <aside className="w-80 bg-background/50 backdrop-blur-3xl border-r border-white/5 hidden md:flex flex-col p-8 space-y-12">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter text-white group cursor-pointer">
            <div className="p-2 rounded-2xl bg-primary shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Activity className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-gradient">GROWTH<span className="text-primary">INTEL</span></span>
        </div>
        
        <nav className="flex-1 space-y-3">
          {[
            { name: "Intelligence Core", href: `/dashboard/${studentId}`, icon: LayoutDashboard },
            { name: "Neural Trends", href: "#", icon: LineChart },
            { name: "Action Protocols", href: "#", icon: FileText },
            { name: "System Settings", href: "#", icon: Settings },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="block group"
              >
                <motion.div 
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20" 
                      : "text-slate-500 hover:text-white hover:bg-white/5"}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "" : "group-hover:text-primary transition-colors"}`} />
                  {item.name}
                  {isActive && <motion.div layoutId="activeDot" className="ml-auto w-2 h-2 rounded-full bg-white glow" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mainframe Status</p>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase">Operational</span>
              <Cpu className="w-4 h-4 text-slate-600" />
           </div>
        </div>

        <button className="flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-accent transition-colors w-full">
          <LogOut className="w-5 h-5" />
          Terminate
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Dynamic Header */}
        <header className="h-24 bg-background/50 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-10">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                <Terminal className="w-4 h-4 text-primary" />
                <span>Path: /growth/intel/core</span>
             </div>
          </div>
          <div className="flex items-center gap-8">
             <motion.button 
               whileHover={{ scale: 1.1 }}
               className="p-3 text-slate-400 hover:text-white bg-white/5 rounded-2xl relative border border-white/5"
             >
               <Bell className="w-5 h-5" />
               <span className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border border-background shadow-[0_0_10px_rgba(255,100,100,0.5)]" />
             </motion.button>
             
             <div className="flex items-center gap-4 border-l pl-8 border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-white leading-none">Sarah Mitchell</p>
                  <p className="text-[10px] font-bold text-primary active:scale-95 uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
                    <Sparkles className="w-3 h-3" /> Elite Tier
                  </p>
                </div>
                <Avatar className="w-12 h-12 border-2 border-primary/20 p-1 shadow-xl">
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-sm uppercase">SM</AvatarFallback>
                </Avatar>
             </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,rgba(135,255,200,0.03),transparent)]">
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 h-full">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
