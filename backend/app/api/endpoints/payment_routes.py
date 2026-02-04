from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.models.user import User
from sqlalchemy.future import select
import httpx
from app.core.config import settings

router = APIRouter()

# DODO Payments API details (Mocked URLs if needed)
DODO_API_URL = "https://test.dodopayments.com/api/v1" 

@router.post("/create-checkout")
async def create_checkout(
    user_id: str,
    db: AsyncSession = Depends(deps.get_db)
):
    # Fetch user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # In a real app, call Dodo Payments API
    # payload = {
    #     "product_id": "prod_123",
    #     "customer": {"email": user.email},
    #     "return_url": "http://localhost:3000/dashboard",
    # }
    
    # Mocking the response for now
    mock_checkout_url = "https://app.dodopayments.com/checkout/mock_123"
    
    return {"checkout_url": mock_checkout_url}

@router.post("/webhook")
async def dodo_webhook(
    request: Request,
    db: AsyncSession = Depends(deps.get_db)
):
    # Verify signature from DODO
    # Update user subscription status
    data = await request.json()
    event_type = data.get("type")
    
    if event_type == "subscription.created":
        customer_email = data["data"]["customer"]["email"]
        # Update user in DB
        result = await db.execute(select(User).where(User.email == customer_email))
        user = result.scalars().first()
        if user:
            user.is_subscribed = True
            user.subscription_status = "active"
            await db.commit()
            
    return {"status": "success"}
