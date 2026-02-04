from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.api import deps
from app.models.user import Student, User
from app.models.assessment import Assessment, Insight, ActionPlan
from app.services import ai_service

router = APIRouter()

@router.get("/{student_id}")
async def get_student_dashboard(
    student_id: str,
    db: AsyncSession = Depends(deps.get_db)
):
    # Fetch student with recent insights and action plans
    stmt = (
        select(Student)
        .where(Student.id == student_id)
        .options(
            selectinload(Student.insights),
            selectinload(Student.action_plans),
            selectinload(Student.parent),
            selectinload(Student.assessments)
        )
    )
    result = await db.execute(stmt)
    student = result.scalars().first()
    
    if student:
        # Sort assessments by date desc in memory for simplicity
        student.assessments.sort(key=lambda x: x.created_at, reverse=True)
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return student
        
@router.post("/{student_id}/analyze")
async def trigger_student_analysis(
    student_id: str,
    db: AsyncSession = Depends(deps.get_db)
):
    # Fetch student and latest assessment
    stmt = (
        select(Assessment)
        .where(Assessment.student_id == student_id)
        .order_by(Assessment.created_at.desc())
        .limit(1)
    )
    result = await db.execute(stmt)
    assessment = result.scalars().first()
    
    if not assessment:
        return {"status": "error", "message": "No neural mappings found. Please complete an initial check-in."}
    
    await ai_service.analyze_assessment(db, assessment.id)
    return {"status": "success", "message": "Neural analysis complete"}

from pydantic import BaseModel

class StudentCreate(BaseModel):
    name: str
    grade_level: str
    parent_id: str

@router.post("/", response_model=None)
async def create_student(
    payload: StudentCreate,
    db: AsyncSession = Depends(deps.get_db)
):
    # Check if parent exists, if not create dummy for dev
    result = await db.execute(select(User).where(User.id == payload.parent_id))
    parent = result.scalars().first()
    
    if not parent:
        parent = User(id=payload.parent_id, email=f"{payload.parent_id}@example.com")
        db.add(parent)
        await db.flush()

    new_student = Student(
        name=payload.name,
        grade_level=payload.grade_level,
        parent_id=payload.parent_id
    )
    db.add(new_student)
    await db.commit()
    await db.refresh(new_student)
    return new_student
