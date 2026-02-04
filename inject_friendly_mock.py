import sqlite3
import json
from datetime import datetime

def inject_friendly_analysis():
    conn = sqlite3.connect('backend/test.db')
    cursor = conn.cursor()
    
    # Get the student
    cursor.execute('SELECT id, name, grade_level FROM student LIMIT 1')
    student = cursor.fetchone()
    if not student:
        print("No student found.")
        return
    
    student_id, student_name, grade_level = student
    
    # Create a warm, friendly mock analysis with Academic Intelligence
    analysis_results = {
        "readiness_score": 85,
        "confidence_level": 92,
        "synergy_score": 80,
        "dashboard_summary": f"{student_name} is showing wonderful progress across multiple areas! Their curiosity and effort are truly shining through. We've identified some exciting opportunities to make learning even more enjoyable and effective.",
        "overall_growth_summary": f"Your child is developing beautifully! {student_name} demonstrates strong engagement in learning and shows a natural ability to connect ideas. With some targeted support in study strategies, we can help them reach even greater heights.",
        "perception_gap": {
          "gap_score": 15,
          "misalignment": f"{student_name} feels they need more time for homework than parents observe",
          "synergy_tip": "Try a brief daily check-in where your child shares what they're working on. This builds connection and helps you both stay aligned on their workload."
        },
        "academic_intelligence": {
          "score": 82,
          "learning_style": "Visual",
          "study_effectiveness": "Moderate",
          "growth_mindset_level": "Strong",
          "recommendations": [
            "Introduce visual study aids like mind maps and color-coded notes",
            "Practice the Pomodoro Technique (25 min focus + 5 min break)",
            "Celebrate effort and progress, not just grades",
            "Create a dedicated, well-lit study space with minimal distractions"
          ]
        },
        "trajectory": {
          "current": 85,
          "projected_30d": 88,
          "projected_90d": 92,
          "growth_driver": "Effective Study Habits"
        },
        "dimensions": [
          {"name": "Cognitive Development", "status": "Strong", "trend": "up", "score": 88},
          {"name": "Academic Progress", "status": "Strong", "trend": "up", "score": 86},
          {"name": "Academic Intelligence", "status": "Developing", "trend": "up", "score": 82},
          {"name": "Neural & Physiological Health", "status": "Developing", "trend": "stable", "score": 75},
          {"name": "Emotional Regulation", "status": "Strong", "trend": "up", "score": 87},
          {"name": "Motivation & Agency", "status": "Strong", "trend": "up", "score": 90},
          {"name": "Social & Communication Skills", "status": "Developing", "trend": "up", "score": 80},
          {"name": "Empathy & Character", "status": "Strong", "trend": "stable", "score": 85},
          {"name": "Life Skills & Independence", "status": "Developing", "trend": "up", "score": 78}
        ],
        "strengths": [
          {"title": "Natural Curiosity", "explanation": f"{student_name} shows genuine interest in learning new things and asks thoughtful questions."},
          {"title": "Strong Growth Mindset", "explanation": "Your child views challenges as opportunities to learn and doesn't give up easily."},
          {"title": "Good Emotional Awareness", "explanation": f"{student_name} can identify and express their feelings in healthy ways."}
        ],
        "support_areas": [
          {"title": "Study Organization", "explanation": "Building better systems for organizing notes and assignments will help reduce stress."},
          {"title": "Time Management", "explanation": "Learning to estimate how long tasks take and planning accordingly will boost confidence."},
          {"title": "Sleep Consistency", "explanation": "A more regular bedtime routine could improve focus and energy during the day."}
        ],
        "risks": [
          {
            "name": "Occasional Study Overwhelm",
            "observations": f"{student_name} sometimes feels stressed when multiple assignments are due at once.",
            "why_it_matters": "Learning to manage workload now builds resilience for future academic challenges.",
            "urgency": "Watch"
          }
        ],
        "action_plan": {
          "student_actions": [
            {"task": "Try using a colorful planner to track assignments and deadlines", "type": "Immediate"},
            {"task": "Practice the 25-minute focus technique for homework sessions", "type": "Habit"},
            {"task": "Create a simple checklist before starting homework each day", "type": "Habit"}
          ],
          "parent_actions": [
            {"task": "Set up a cozy, well-lit study corner together", "type": "Immediate"},
            {"task": "Have a brief 'study check-in' chat each evening (5 minutes)", "type": "Habit"}
          ],
          "environment_adjustments": [
            "Ensure study area has good natural light or a warm desk lamp",
            "Keep study space free from phone and gaming distractions",
            "Display a visual schedule or calendar at eye level"
          ]
        },
        "communication_guidance": {
          "to_encourage": ["Effort and persistence", "Trying new study methods", "Asking for help when needed"],
          "to_avoid": ["Comparing to siblings or peers", "Focusing only on grades", "Interrupting during focused work time"],
          "frequency": "Weekly",
          "recommended_tone": "Warm, encouraging, and curious. Ask 'What did you learn today?' instead of 'Did you finish your homework?'"
        },
        "explainability": [
          {
            "insight": "Visual learning preference",
            "observation": f"{student_name} responds well to diagrams and visual examples in their work.",
            "inputs_matter": ["Parent observations of study habits", "Student self-report on learning preferences"],
            "why_it_matters": "Matching study methods to learning style makes learning more enjoyable and effective.",
            "expected_impact": "Using visual study tools could improve retention by 20-30% and reduce study time."
          }
        ]
    }
    
    # Update or create assessment
    cursor.execute('SELECT id FROM assessment WHERE student_id=? LIMIT 1', (student_id,))
    assessment = cursor.fetchone()
    
    if assessment:
        assessment_id = assessment[0]
        cursor.execute(
            'UPDATE assessment SET analysis_results=? WHERE id=?',
            (json.dumps(analysis_results), assessment_id)
        )
        cursor.execute(
            'UPDATE student SET readiness_score=? WHERE id=?',
            (85, student_id)
        )
        print(f"✅ Successfully updated analysis for {student_name} (Grade {grade_level})")
    else:
        import uuid
        assessment_id = str(uuid.uuid4())
        cursor.execute(
            'INSERT INTO assessment (id, student_id, data, analysis_results, created_at) VALUES (?, ?, ?, ?, ?)',
            (assessment_id, student_id, json.dumps({"sample": "data"}), json.dumps(analysis_results), datetime.now())
        )
        cursor.execute(
            'UPDATE student SET readiness_score=? WHERE id=?',
            (85, student_id)
        )
        print(f"✅ Successfully created analysis for {student_name} (Grade {grade_level})")
        
    conn.commit()
    conn.close()
    
    print("\n📊 Analysis includes:")
    print("  • 9 developmental dimensions (including Academic Intelligence)")
    print("  • Learning style: Visual")
    print("  • Study effectiveness: Moderate → High potential")
    print("  • Growth mindset: Strong")
    print("  • 4 personalized study recommendations")
    print("\n🎨 New warm, friendly design applied!")

if __name__ == "__main__":
    inject_friendly_analysis()
