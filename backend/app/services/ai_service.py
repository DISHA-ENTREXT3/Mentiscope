from typing import List, Dict, Any, Optional
import json
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.models.assessment import Assessment, Insight, ActionPlan, InsightType
from app.models.user import Student

# Shifting to OpenRouter
client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENAI_API_KEY, # User will provide OpenRouter key here
    default_headers={
        "HTTP-Referer": "https://mentiscope.vercel.app", 
        "X-Title": "Mentiscope",
    }
)

async def analyze_assessment(db: AsyncSession, assessment_id: str):
    if not settings.OPENAI_API_KEY:
        print("OPENAI_API_KEY not set. Skipping AI analysis.")
        return

    # Fetch assessment and student
    result = await db.execute(
        select(Assessment)
        .where(Assessment.id == assessment_id)
    )
    assessment = result.scalars().first()
    if not assessment:
        return
        
    result = await db.execute(
        select(Student)
        .where(Student.id == assessment.student_id)
    )
    student = result.scalars().first()
    if not student:
        return

    # Prepare data for AI
    assessment_data = assessment.data
    
    # Fetch historical context
    hist_stmt = (
        select(Assessment)
        .where(Assessment.student_id == student.id)
        .where(Assessment.id != assessment.id)
        .order_by(Assessment.created_at.desc())
        .limit(3)
    )
    hist_result = await db.execute(hist_stmt)
    history = hist_result.scalars().all()
    history_data = [h.data for h in history]

    prompt = f"""
    You are an expert Child Development Scientist and Neural Readiness Architect.
    
    ### CORE MISSION:
    Analyze the provided holistic development data across 9 core dimensions to provide a comprehensive growth mapping for the student.
    
    ### THE 9 DIMENSIONS:
    1. Cognitive Development
    2. Academic Progress
    3. Academic Intelligence (Learning Strategies, Study Skills, Academic Mindset, Metacognition)
    4. Neural & Physiological Health
    5. Emotional Regulation
    6. Motivation & Agency
    7. Social & Communication Skills
    8. Empathy & Character
    9. Life Skills & Independence

    ### PHILOSOPHY:
    - **No Labels**: Do not diagnose or label. Use descriptive behavioral patterns.
    - **Clarity & Reassurance**: Use supportive, explainable, and practical language.
    - **Early Signals**: Focus on patterns and trends rather than snapshots.
    - **Age-Appropriate**: Tailor insights and actions to the student's grade level (1-12).

    ### STUDENT CONTEXT:
    - Name: {student.name}
    - Grade: {student.grade_level}
    
    ### DATA SPECTRUM:
    - Current Assessment: {json.dumps(assessment_data, indent=2)}
    - Historical Context: {json.dumps(history_data, indent=2)}
    
    ### PROMPT ARCHITECTURE:
    1. **Overall Growth Analysis**: Analyze inputs across 9 dimensions. Focus on patterns.
       - Output: summary (3-4 sentences), 2-3 strengths, 2-3 support areas, confidence score (0-100).
    2. **Academic Intelligence Deep Dive**: Assess learning strategies, study habits, academic mindset, and metacognition.
       - Output: academic_intelligence_score (0-100), learning_style, study_effectiveness, growth_mindset_level, key_recommendations.
    3. **Perception Gap (Synergy Analysis)**: Compare Parent and Student responses. Identify "Blind Spots" where perceptions differ.
       - Output: gap_score (0-100), key_misalignment_area (string), recommendation (string).
    4. **Risk Signal Detection**: Identify early risk signals ONLY if multiple indicators align. Explain "Why".
       - Output: Risk name, observations, why it matters, urgency (Low, Watch, Focus).
    5. **Personalized Action Map**: specific, achievable, time-bound. Calm language. Age-appropriate for grade level.
       - Include: 3-5 student actions, 2-3 parent actions, 1-2 environment adjustments.
       - Distinguish: "Immediate Trigger" (Day 1) vs "Habit Protocol" (Week 1).
    6. **Predictive Growth Trajectory**: Forecast growth if the action plan is followed.
       - Output: current_readiness, projected_30d, projected_90d, primary_growth_driver (string).
    7. **Parent Communication Guidance**: Support tone and rhythms.
       - Include: what to encourage, what to avoid, check-in frequency, recommended tone.
    8. **Explainability Layer**: For each major insight/suggestion.
       - Include: what was observed, which inputs mattered, why it matters, expected impact.
    9. **Dashboard Summary**: Under 120 words. Focus on clarity and reassurance.

    ### JSON OUTPUT FORMAT:
    {{
      "readiness_score": int,
      "confidence_level": int,
      "synergy_score": int,
      "dashboard_summary": "string",
      "overall_growth_summary": "string",
      "perception_gap": {{
        "gap_score": int,
        "misalignment": "string",
        "synergy_tip": "string"
      }},
      "academic_intelligence": {{
        "score": int (0-100),
        "learning_style": "Visual" | "Auditory" | "Kinesthetic" | "Mixed",
        "study_effectiveness": "High" | "Moderate" | "Needs Improvement",
        "growth_mindset_level": "Strong" | "Developing" | "Fixed",
        "recommendations": ["string"]
      }},
      "trajectory": {{
        "current": int,
        "projected_30d": int,
        "projected_90d": int,
        "growth_driver": "string"
      }},
      "dimensions": [
        {{
          "name": "string",
          "status": "Strong" | "Developing" | "Needs Support",
          "trend": "up" | "down" | "stable",
          "score": int (0-100)
        }}
      ],
      "strengths": [
        {{ "title": "string", "explanation": "string" }}
      ],
      "support_areas": [
        {{ "title": "string", "explanation": "string" }}
      ],
      "risks": [
        {{
          "name": "string",
          "observations": "string",
          "why_it_matters": "string",
          "urgency": "Low" | "Watch" | "Focus"
        }}
      ],
      "action_plan": {{
        "student_actions": [{{ "task": "string", "type": "Immediate" | "Habit" }}],
        "parent_actions": [{{ "task": "string", "type": "Immediate" | "Habit" }}],
        "environment_adjustments": ["string"]
      }},
      "communication_guidance": {{
        "to_encourage": ["string"],
        "to_avoid": ["string"],
        "frequency": "string",
        "recommended_tone": "string"
      }},
      "explainability": [
        {{
          "insight": "string",
          "observation": "string",
          "inputs_matter": ["string"],
          "why_it_matters": "string",
          "expected_impact": "string"
        }}
      ]
    }}
    """

    try:
        response = await client.chat.completions.create(
            model="google/gemini-2.0-flash-exp:free",
            messages=[
                {"role": "system", "content": "You are a Neural Architect assistant. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        raw_content = response.choices[0].message.content
        analysis = json.loads(raw_content)
        
        if "dashboard_summary" not in analysis:
            analysis["dashboard_summary"] = analysis.get("overall_growth_summary", "Neural pulse synchronization complete. Dashboard updated with holistic baseline.")
            
        student.readiness_score = analysis.get("readiness_score", student.readiness_score)
        assessment.analysis_results = analysis
        
        # 2. Save Specific Insights (Strengths, Risks, etc.)
        # Clear old insights for this assessment to avoid duplicates if re-running
        # (Optional, but good for consistency)
        
        # Overall Summary as a Trend Insight
        db.add(Insight(
            student_id=student.id,
            assessment_id=assessment.id,
            type="trend",
            title="Dashboard Summary",
            observation="Integrated whole-child mapping.",
            interpretation=analysis.get("dashboard_summary", ""),
            confidence_score=95
        ))

        # Strengths
        for s in analysis.get("strengths", []):
            db.add(Insight(
                student_id=student.id,
                assessment_id=assessment.id,
                type="strength",
                title=s.get("title"),
                observation="Area of core proficiency.",
                interpretation=s.get("explanation"),
                confidence_score=90
            ))

        # Risks
        for r in analysis.get("risks", []):
            db.add(Insight(
                student_id=student.id,
                assessment_id=assessment.id,
                type="risk",
                title=r.get("name"),
                observation=r.get("observations"),
                interpretation=f"{r.get('why_it_matters')} (Urgency: {r.get('urgency')})",
                confidence_score=85
            ))
        
        # 3. Save Action Items
        action_plan = analysis.get("action_plan", {})
        for act in action_plan.get("student_actions", []):
            db.add(ActionPlan(
                student_id=student.id,
                title="Student Action",
                description=act,
                role_target="student"
            ))
        for act in action_plan.get("parent_actions", []):
            db.add(ActionPlan(
                student_id=student.id,
                title="Parent Action",
                description=act,
                role_target="parent"
            ))
        for act in action_plan.get("environment_adjustments", []):
            db.add(ActionPlan(
                student_id=student.id,
                title="Environment Adjustment",
                description=act,
                role_target="parent" # Default to parent for environment
            ))
            
        await db.commit()
        
    except Exception as e:
        print(f"Error in deep AI analysis: {e}")
