// Scientific References Display Component
// Use this to show research backing for insights

import React from "react";
import { Info } from "lucide-react";
import { Insight, ScientificReference } from "@/types";

interface ScientificReferencesProps {
  references: ScientificReference[];
  dimension?: string;
}

export function ScientificReferences({ references, dimension }: ScientificReferencesProps) {
  if (!references || references.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white/5 border border-primary/20 rounded-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-xl">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Scientific Foundation
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Research-Backed Analysis
          </p>
        </div>
      </div>

      {dimension && (
        <div className="text-xs font-black uppercase tracking-widest text-primary">
          Dimension: {dimension.replace(/_/g, ' ')}
        </div>
      )}

      <div className="space-y-4">
        {references.map((ref, index) => (
          <div key={index} className="space-y-2 pb-4 border-b border-white/5 last:border-0">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary font-black text-xs px-2 py-1 rounded-lg">
                {index + 1}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-bold text-white leading-tight">
                  {ref.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {ref.authors} ({ref.year}) • {ref.journal}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {ref.summary}
                </p>
                {ref.doi !== "N/A" && (
                  <a
                    href={`https://doi.org/${ref.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                  >
                    View Research →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-center">
          All insights grounded in peer-reviewed research
        </p>
      </div>
    </div>
  );
}

// Example Usage in Dashboard:
/*
import { ScientificReferences } from "@/components/scientific-references";

// In your component:
<div className="space-y-8">
  <InsightCard insight={insight} />
  
  {insight.scientific_references && (
    <ScientificReferences 
      references={insight.scientific_references}
      dimension={insight.dimension}
    />
  )}
</div>
*/


// Example: Displaying in a collapsible section
export function InsightWithReferences({ insight }: { insight: Insight }) {
  const [showReferences, setShowReferences] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Main Insight */}
      <div className="glass p-8 rounded-[3rem] space-y-4">
        <h3 className="text-2xl font-black text-white">{insight.title}</h3>
        <p className="text-slate-400">{insight.observation}</p>
        <p className="text-white font-medium">{insight.interpretation}</p>
        
        {/* Show References Button */}
        {insight.scientific_references && insight.scientific_references.length > 0 && (
          <button
            onClick={() => setShowReferences(!showReferences)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors mt-4"
          >
            <Info className="w-4 h-4" />
            {showReferences ? 'Hide' : 'View'} Scientific Backing
            ({insight.scientific_references.length} {insight.scientific_references.length === 1 ? 'study' : 'studies'})
          </button>
        )}
      </div>

      {/* Scientific References (Collapsible) */}
      {showReferences && insight.scientific_references && (
        <ScientificReferences 
          references={insight.scientific_references}
          dimension={insight.dimension}
        />
      )}
    </div>
  );
}
