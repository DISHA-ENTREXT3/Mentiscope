from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.api import deps
from app.models.assessment import Assessment, AssessmentType, Insight, ActionPlan
from app.models.user import Student
from sqlalchemy.future import select
from app.services import ai_service
from pydantic import BaseModel

router = APIRouter()

class AssessmentSubmit(BaseModel):
    student_id: str
    assessment_type: AssessmentType
    data: Dict[str, Any]

@router.post("/submit")
async def submit_assessment(
    payload: AssessmentSubmit,
    db: AsyncSession = Depends(deps.get_db)
):
    # Verify student exists
    result = await db.execute(select(Student).where(Student.id == payload.student_id))
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Save Assessment
    new_assessment = Assessment(
        student_id=payload.student_id,
        type=payload.assessment_type,
        data=payload.data
    )
    db.add(new_assessment)
    await db.commit()
    await db.refresh(new_assessment)
    
    # Trigger AI Analysis
    await ai_service.analyze_assessment(db, new_assessment.id)
    
    return {"status": "success", "assessment_id": new_assessment.id}
