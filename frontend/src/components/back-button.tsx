"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export function BackButton() {
  const router = useRouter();
  
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="mb-8 group text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest px-0"
    >
      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
      Return to Protocol
    </Button>
  );
}
