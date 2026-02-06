import { HowItWorks } from "@/components/how-it-works";
import { SubscribeSection } from "@/components/subscribe-section";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter mb-20 text-center">Protocol <br /><span className="text-gradient">Breakdown</span>.</h1>
        <HowItWorks />
        <div className="mt-32">
          <SubscribeSection />
        </div>
      </div>
    </div>
  );
}
