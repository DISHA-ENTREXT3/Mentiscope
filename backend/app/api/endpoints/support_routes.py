from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import requests
import os
from app.core.config import settings
from typing import Optional, Dict

router = APIRouter()

class SupportRequest(BaseModel):
    product: str
    category: str
    message: str
    user_email: EmailStr
    metadata: Optional[Dict] = None

@router.post("")
def submit_support(payload: SupportRequest):
    response = requests.post(
        settings.SUPABASE_SUPPORT_URL,
        headers={
            "Content-Type": "application/json",
            "x-form-secret": settings.FORM_SECRET
        },
        json=payload.model_dump() # Using model_dump() for Pydantic v2
    )

    if response.status_code == 429:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions. Try again later."
        )

    if not response.ok:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text
        )

    return response.json()
