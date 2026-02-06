import { FeaturesSection } from "@/components/features-section";
import { SubscribeSection } from "@/components/subscribe-section";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
       <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter mb-20 text-center">System <br /><span className="text-gradient">Capabilities</span>.</h1>
        <FeaturesSection />
        <div className="mt-32">
          <SubscribeSection />
        </div>
      </div>
    </div>
  );
}
