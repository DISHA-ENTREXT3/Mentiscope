from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, JSON, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.user import generate_uuid
import enum

class AssessmentType(str, enum.Enum):
    ONBOARDING = "onboarding"
    WEEKLY_CHECKIN = "weekly_checkin"
    AD_HOC = "ad_hoc"

class Assessment(Base):
    __tablename__ = "assessment"
    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("student.id"), nullable=False)
    type = Column(String, default=AssessmentType.ONBOARDING)
    
    # Stores the raw Q&A. Example: {"q1_subject_difficulty": "Math", "q2_sleep_hours": 7}
    data = Column(JSON, nullable=False) 
    analysis_results = Column(JSON, nullable=True) # AI synthesized insights
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student", back_populates="assessments")
    generated_insights = relationship("Insight", back_populates="assessment")

class InsightType(str, enum.Enum):
    RISK = "risk"
    STRENGTH = "strength"
    HABIT = "habit"
    TREND = "trend"

class Insight(Base):
    __tablename__ = "insight"
    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("student.id"), nullable=False)
    assessment_id = Column(String, ForeignKey("assessment.id"), nullable=True) # Can be derived from a specific assessment OR historical trends
    
    type = Column(String, nullable=False)
    title = Column(String, nullable=False) # Short headline
    observation = Column(Text, nullable=False) # "We noticed..."
    interpretation = Column(Text, nullable=False) # "This likely means..."
    confidence_score = Column(Integer, default=0) # 0-100 internal score
    
    # Scientific backing for the insight
    scientific_references = Column(JSON, nullable=True) # List of research citations
    dimension = Column(String, nullable=True) # Which of the 9 dimensions this relates to
    
    is_viewed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student", back_populates="insights")
    assessment = relationship("Assessment", back_populates="generated_insights")
    action_items = relationship("ActionPlan", back_populates="insight")

class ActionPlan(Base):
    __tablename__ = "action_plan"
    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("student.id"), nullable=False)
    insight_id = Column(String, ForeignKey("insight.id"), nullable=True)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False) # Detailed "What to do"
    role_target = Column(String, default="parent") # parent, student
    
    status = Column(String, default="pending") # pending, in_progress, completed
    due_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student", back_populates="action_plans")
    insight = relationship("Insight", back_populates="action_items")
