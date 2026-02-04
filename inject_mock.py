import sqlite3
import json
from datetime import datetime

def inject_mock_analysis():
    conn = sqlite3.connect('backend/test.db')
    cursor = conn.cursor()
    
    # Get the student
    cursor.execute('SELECT id FROM student LIMIT 1')
    student = cursor.fetchone()
    if not student:
        print("No student found.")
        return
    
    student_id = student[0]
    
    # Create a mock analysis JSON matching the new architecture
    analysis_results = {
        "readiness_score": 88,
        "confidence_level": 94,
        "synergy_score": 75,
        "dashboard_summary": "Neural synchronization reveals a student exhibiting high levels of cognitive resilience balanced with emerging academic agency. Current focus should be on stabilizing neural health through rhythmic sleep protocols.",
        "overall_growth_summary": "Alex is entering a phase of significant neural maturity. We observe a strong alignment between cognitive focus and creative output, though social-emotional regulation appears to hit a friction point during high-stakes testing windows.",
        "perception_gap": {
          "gap_score": 18,
          "misalignment": "Alex reports higher stress levels during evening study than observed by parents.",
          "synergy_tip": "Schedule a 5-minute evening logic-check to align on emotional state before transitions."
        },
        "trajectory": {
          "current": 88,
          "projected_30d": 92,
          "projected_90d": 96,
          "growth_driver": "Neural Rhythm Stabilization"
        },
        "dimensions": [
          {"name": "Cognitive Development", "status": "Strong", "trend": "up", "score": 92},
          {"name": "Academic Progress", "status": "Developing", "trend": "up", "score": 84},
          {"name": "Neural & Physiological Health", "status": "Needs Support", "trend": "down", "score": 68},
          {"name": "Emotional Regulation", "status": "Strong", "trend": "stable", "score": 90},
          {"name": "Motivation & Agency", "status": "Strong", "trend": "up", "score": 95},
          {"name": "Social & Communication Skills", "status": "Developing", "trend": "stable", "score": 78},
          {"name": "Empathy & Character", "status": "Strong", "trend": "up", "score": 88},
          {"name": "Life Skills & Independence", "status": "Developing", "trend": "up", "score": 74}
        ],
        "strengths": [
          {"title": "High Cognitive Resilience", "explanation": "The student shows an exceptional ability to recover from complex problem-solving setbacks."},
          {"title": "Neural Readiness for Complexity", "explanation": "Baseline logic nodes suggest an immediate readiness for advanced abstract concepts."}
        ],
        "support_areas": [
          {"title": "Evening Cortisol Management", "explanation": "Likely spike in evening stress suggesting the need for screen-free transitions."},
          {"title": "Academic Boundary Setting", "explanation": "Tendency to over-index on preferred subjects while avoiding friction-heavy concepts."}
        ],
        "risks": [
          {
            "name": "Evening Fatigue Spillover",
            "observations": "Late study hours combined with variable sleep quality reported by the student.",
            "why_it_matters": "Increases short-term memory friction and reduces next-day cognitive focus.",
            "urgency": "Watch"
          }
        ],
        "action_plan": {
          "student_actions": [
            {"task": "Implement a 30-minute digital blackout before bed.", "type": "Immediate"},
            {"task": "Use the 50/10 focus interval for all math modules.", "type": "Habit"},
            {"task": "Record one 'win of the day' in the reflection log.", "type": "Habit"}
          ],
          "parent_actions": [
            {"task": "Initiate evening cool-down walk to lower cortisol.", "type": "Immediate"},
            {"task": "Review weekly goals on Sunday afternoon with a supportive tone.", "type": "Habit"}
          ],
          "environment_adjustments": [
            "Adjust study lighting to warm-spectrum after 7 PM.",
            "Designate a 'Analog Only' zone in the bedroom."
          ]
        },
        "communication_guidance": {
          "to_encourage": ["Consistency in effort", "Self-awareness of fatigue"],
          "to_avoid": ["Performance benchmarking", "Late-night critique"],
          "frequency": "Bi-weekly",
          "recommended_tone": "Strategic, Calm, and Future-Oriented"
        },
        "explainability": [
          {
            "insight": "Divergence in stress perception",
            "observation": "Parent reports 'high energy' while student reports 'heavy fatigue'.",
            "inputs_matter": ["Parent Sleep Observation", "Student Energy Report"],
            "why_it_matters": "Indicates a high-functioning mask that hides emerging burnout levels.",
            "expected_impact": "Direct alignment will reduce emotional friction and improve long-term resilience."
          }
        ]
    }
    
    # Check if there's an assessment for this student
    cursor.execute('SELECT id FROM assessment WHERE student_id=? LIMIT 1', (student_id,))
    assessment = cursor.fetchone()
    
    if assessment:
        assessment_id = assessment[0]
        # Update assessment with mock analysis
        cursor.execute(
            'UPDATE assessment SET analysis_results=? WHERE id=?',
            (json.dumps(analysis_results), assessment_id)
        )
        # Update student readiness score
        cursor.execute(
            'UPDATE student SET readiness_score=? WHERE id=?',
            (88, student_id)
        )
        print(f"Successfully injected mock analysis into assessment {assessment_id}")
    else:
        # Create a mock assessment
        import uuid
        assessment_id = str(uuid.uuid4())
        cursor.execute(
            'INSERT INTO assessment (id, student_id, data, analysis_results, created_at) VALUES (?, ?, ?, ?, ?)',
            (assessment_id, student_id, json.dumps({"mock": "data"}), json.dumps(analysis_results), datetime.now())
        )
        cursor.execute(
            'UPDATE student SET readiness_score=? WHERE id=?',
            (88, student_id)
        )
        print(f"Successfully created mock assessment {assessment_id} for student {student_id}")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    inject_mock_analysis()
