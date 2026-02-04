# Scientific References Implementation Guide

## Overview

Every insight in Mentiscope is now backed by peer-reviewed scientific research. This guide shows how to integrate and display scientific references in your application.

---

## Backend Implementation

### 1. Using Scientific References in Analysis

```python
from app.core.scientific_references import ScientificReferences

# When generating an insight
def generate_insight(student_data, dimension):
    # ... your analysis logic ...

    # Get relevant scientific references
    references = ScientificReferences.get_references_for_dimension(dimension)

    # Format for storage
    references_json = [
        {
            "title": ref.title,
            "authors": ref.authors,
            "year": ref.year,
            "journal": ref.journal,
            "doi": ref.doi,
            "summary": ref.summary,
            "relevance": ref.relevance
        }
        for ref in references[:2]  # Include top 2 most relevant
    ]

    # Create insight with references
    insight = Insight(
        student_id=student_id,
        type="strength",
        title="Strong Visual Learning Style",
        observation="Your child shows preference for visual materials...",
        interpretation="This suggests visual strategies will be most effective...",
        dimension="academic_intelligence",
        scientific_references=references_json,
        confidence_score=85
    )

    return insight
```

### 2. Available Dimensions

```python
# All available dimensions with research backing:
dimensions = [
    "cognitive_development",
    "academic_intelligence",
    "growth_mindset",
    "emotional_regulation",
    "sleep_health",
    "social_skills",
    "executive_function",
    "resilience",
    "parent_communication"
]
```

### 3. Getting Reference Summary

```python
# Get a formatted summary of research for a dimension
summary = ScientificReferences.get_reference_summary("academic_intelligence")
print(summary)
# Output:
# This analysis is grounded in 3 peer-reviewed research studies:
#
# 1. Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008) - Learning Styles: Concepts and Evidence
#    Critical analysis of learning style theories and evidence-based learning strategies
# ...
```

---

## Frontend Implementation

### 1. Import the Component

```tsx
import { ScientificReferences } from "@/components/scientific-references";
```

### 2. Display with Insight

```tsx
// In your dashboard or insight display component
export function InsightCard({ insight }) {
  return (
    <div className="space-y-6">
      {/* Main Insight Content */}
      <div className="glass p-8 rounded-[3rem]">
        <h3 className="text-2xl font-black text-white">{insight.title}</h3>
        <p className="text-slate-400 mt-4">{insight.observation}</p>
        <p className="text-white font-medium mt-2">{insight.interpretation}</p>
      </div>

      {/* Scientific References */}
      {insight.scientific_references && (
        <ScientificReferences
          references={insight.scientific_references}
          dimension={insight.dimension}
        />
      )}
    </div>
  );
}
```

### 3. Collapsible Version

```tsx
import { InsightWithReferences } from "@/components/scientific-references";

// Automatically handles show/hide of references
<InsightWithReferences insight={insight} />;
```

---

## Example API Response

When fetching insights from the backend, you'll receive:

```json
{
  "id": "insight-123",
  "student_id": "student-456",
  "type": "strength",
  "title": "Strong Visual Learning Style Detected",
  "observation": "Your child consistently performs better when using visual study materials like diagrams, charts, and mind maps.",
  "interpretation": "This indicates a strong visual learning preference. Visual learners process information best through images and spatial understanding.",
  "dimension": "academic_intelligence",
  "confidence_score": 85,
  "scientific_references": [
    {
      "title": "Learning Styles: Concepts and Evidence",
      "authors": "Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R.",
      "year": 2008,
      "journal": "Psychological Science in the Public Interest",
      "doi": "10.1111/j.1539-6053.2009.01038.x",
      "summary": "Critical analysis of learning style theories and evidence-based learning strategies",
      "relevance": "Guides personalized learning strategy recommendations"
    }
  ],
  "created_at": "2026-02-05T00:00:00Z"
}
```

---

## UI Examples

### Compact View

```tsx
<div className="flex items-center gap-2 text-xs">
  <Info className="w-4 h-4 text-primary" />
  <span className="font-bold text-slate-400">
    Backed by {insight.scientific_references?.length || 0} research studies
  </span>
</div>
```

### Badge View

```tsx
{
  insight.scientific_references && insight.scientific_references.length > 0 && (
    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase">
      <ShieldCheck className="w-3 h-3" />
      Research-Backed
    </div>
  );
}
```

### Tooltip View

```tsx
<Tooltip>
  <TooltipTrigger>
    <Info className="w-4 h-4 text-primary cursor-help" />
  </TooltipTrigger>
  <TooltipContent>
    <div className="max-w-sm space-y-2">
      <p className="font-bold">Scientific Foundation:</p>
      {insight.scientific_references?.map((ref, i) => (
        <p key={i} className="text-xs">
          {ref.authors} ({ref.year})
        </p>
      ))}
    </div>
  </TooltipContent>
</Tooltip>
```

---

## Benefits

### For Parents

- ✅ **Trust**: See the research behind every recommendation
- ✅ **Transparency**: Understand why insights are given
- ✅ **Credibility**: Peer-reviewed scientific backing

### For the Platform

- ✅ **Authenticity**: Differentiate from generic advice
- ✅ **Professional**: Medical/educational-grade credibility
- ✅ **Defensible**: Every claim has research support

### For Compliance

- ✅ **Evidence-Based**: Required for educational platforms
- ✅ **Traceable**: Clear source attribution
- ✅ **Auditable**: Research can be verified

---

## Customization

### Add More References

Edit `backend/app/core/scientific_references.py`:

```python
NEW_DIMENSION = [
    ScientificReference(
        title="Your Research Title",
        authors="Author Names",
        year=2024,
        journal="Journal Name",
        doi="10.xxxx/xxxxx",
        summary="Brief summary of findings",
        relevance="Why this matters for the analysis"
    )
]
```

### Customize Display

Edit `frontend/src/components/scientific-references.tsx` to match your design system.

---

## Testing

### Backend Test

```python
# Test getting references
refs = ScientificReferences.get_references_for_dimension("academic_intelligence")
assert len(refs) > 0
assert refs[0].title is not None
```

### Frontend Test

```tsx
// Test component renders
const mockInsight = {
  title: "Test",
  scientific_references: [
    {
      title: "Test Study",
      authors: "Test Author",
      year: 2024,
      journal: "Test Journal",
      doi: "10.test/test",
    },
  ],
};

render(<ScientificReferences references={mockInsight.scientific_references} />);
expect(screen.getByText("Test Study")).toBeInTheDocument();
```

---

## Future Enhancements

- [ ] Add "Cite this research" button
- [ ] Link to full papers (where available)
- [ ] Show research strength indicators
- [ ] Allow parents to request more details
- [ ] Add research update notifications

---

**Status**: ✅ Fully Implemented

**Documentation**: Complete

**Ready for**: Production use
