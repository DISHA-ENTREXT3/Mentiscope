from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, JSON, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base_class import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    PARENT = "parent"
    ADMIN = "admin"
    COUNSELOR = "counselor"

class User(Base):
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    # Supabase Auth ID linkage
    supabase_uid = Column(String, unique=True, index=True, nullable=True) 
    full_name = Column(String, nullable=True)
    role = Column(String, default=UserRole.PARENT)
    
    # Subscription (Dodo Payments)
    is_subscribed = Column(Boolean, default=False)
    dodo_customer_id = Column(String, nullable=True)
    subscription_status = Column(String, default="inactive") # active, inactive, canceled
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    students = relationship("Student", back_populates="parent")

class Student(Base):
    id = Column(String, primary_key=True, default=generate_uuid)
    parent_id = Column(String, ForeignKey("user.id"), nullable=False)
    name = Column(String, nullable=False) # Can be nickname for privacy
    grade_level = Column(String, nullable=False) # e.g., "5", "10", "12"
    school_type = Column(String, nullable=True) # Public, Private, Homeschool
    
    # Emotional/Learning Baseline (Simplified for v1)
    baseline_stress_level = Column(Integer, default=0) # 0-10
    readiness_score = Column(Integer, default=0) # 0-100 latest score
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    parent = relationship("User", back_populates="students")
    assessments = relationship("Assessment", back_populates="student")
    insights = relationship("Insight", back_populates="student")
    action_plans = relationship("ActionPlan", back_populates="student")
