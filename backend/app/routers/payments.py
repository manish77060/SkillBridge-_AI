"""
SkillBridge AI — Payments & Webhooks Router
Endpoints:
  POST /api/billing/webhook           — Razorpay raw webhook listener (HMAC signature verified)
  GET  /api/billing/payments/history  — retrieve payment transactions for authenticated org
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from app.routers.admin import verify_user_token
from app.services.billing_service import (
    get_or_create_billing_org,
    process_razorpay_webhook,
    get_payment_history,
)

router = APIRouter(prefix="/api/billing", tags=["Billing & Payments"])


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(default="", alias="X-Razorpay-Signature")
):
    """
    Receives and processes webhook events from Razorpay.
    Verifies HMAC SHA256 signature using RAZORPAY_WEBHOOK_SECRET over the raw request body.
    """
    raw_body = await request.body()
    try:
        result = await process_razorpay_webhook(raw_body, x_razorpay_signature)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing error: {str(e)}")


@router.get("/payments/history")
def payment_history(current_user: dict = Depends(verify_user_token)):
    """Retrieve payment receipts/history for the current user's organization."""
    portal = current_user.get("portal")
    if portal not in ("industry", "institution"):
        raise HTTPException(status_code=400, detail="Invalid portal type")

    billing_org = get_or_create_billing_org(current_user["sub"], portal)
    history = get_payment_history(billing_org)
    return {"payments": history, "count": len(history)}
