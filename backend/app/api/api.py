from fastapi import APIRouter
from app.api.endpoints import assess_routes, student_routes, payment_routes, support_routes

api_router = APIRouter()
api_router.include_router(assess_routes.router, prefix="/assessments", tags=["assessments"])
api_router.include_router(student_routes.router, prefix="/students", tags=["students"])
api_router.include_router(payment_routes.router, prefix="/payments", tags=["payments"])
api_router.include_router(support_routes.router, prefix="/support", tags=["support"])
