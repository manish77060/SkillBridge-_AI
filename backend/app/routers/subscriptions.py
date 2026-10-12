"""
SkillBridge AI — Subscriptions Router
Endpoints:
  GET  /api/billing/plans                 — list plans for industry / institution
  GET  /api/billing/status                — current organization subscription / trial status
  POST /api/billing/trial/start           — start 14-day free trial
  POST /api/billing/subscriptions/create  — create Razorpay checkout session
  POST /api/billing/subscriptions/verify  — verify checkout signature and activate access
  POST /api/billing/subscriptions/cancel  — request subscription cancellation
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.routers.admin import verify_user_token
from app.services.billing_service import (
    get_or_create_billing_org,
    get_active_plans,
    get_billing_status,
    start_organization_trial,
    create_checkout_session,
    verify_checkout_payment,
    cancel_organization_subscription,
)

router = APIRouter(prefix="/api/billing", tags=["Billing & Subscriptions"])


# ─────────────────────────────────────────────
# REQUEST SCHEMAS
# ─────────────────────────────────────────────

class CreateSubscriptionRequest(BaseModel):
    plan_code: str


class VerifySubscriptionRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: Optional[str] = None
    razorpay_subscription_id: Optional[str] = None
    razorpay_signature: Optional[str] = ""
    plan_code: Optional[str] = None


# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@router.get("/plans")
def list_plans(portal_type: Optional[str] = Query(None)):
    """Return available billing plans for the specified portal type."""
    plans = get_active_plans(portal_type)
    return {"plans": plans, "count": len(plans)}


@router.get("/status")
def get_status(current_user: dict = Depends(verify_user_token)):
    """Return current trial/subscription status for the authenticated user's organization."""
    portal = current_user.get("portal")
    if portal not in ("industry", "institution"):
        raise HTTPException(status_code=400, detail="Billing is only applicable to Industry and Institution portals")

    billing_org = get_or_create_billing_org(current_user["sub"], portal)
    status_data = get_billing_status(billing_org)
    status_data["organization"] = {
        "id": billing_org.get("id"),
        "portal_type": portal,
        "email": current_user.get("email")
    }
    return status_data


@router.post("/trial/start")
def start_trial(current_user: dict = Depends(verify_user_token)):
    """Start 14-day free trial for eligible organization."""
    portal = current_user.get("portal")
    if portal not in ("industry", "institution"):
        raise HTTPException(status_code=400, detail="Trial is only available for Industry and Institution portals")

    billing_org = get_or_create_billing_org(current_user["sub"], portal)
    try:
        updated_status = start_organization_trial(billing_org)
        return {
            "message": "14-day free trial activated successfully!",
            "status": updated_status
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to activate trial: {str(e)}")


@router.post("/subscriptions/create")
def create_subscription(
    payload: CreateSubscriptionRequest,
    current_user: dict = Depends(verify_user_token)
):
    """Generate checkout session (order or subscription) for Razorpay checkout."""
    portal = current_user.get("portal")
    if portal not in ("industry", "institution"):
        raise HTTPException(status_code=400, detail="Subscriptions are only available for Industry and Institution portals")

    billing_org = get_or_create_billing_org(current_user["sub"], portal)
    try:
        checkout_data = create_checkout_session(billing_org, payload.plan_code)
        return checkout_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not create checkout session: {str(e)}")


@router.post("/subscriptions/verify")
def verify_subscription(
    payload: VerifySubscriptionRequest,
    current_user: dict = Depends(verify_user_token)
):
    """Verify Razorpay payment signature server-side and activate subscription."""
    portal = current_user.get("portal")
    if portal not in ("industry", "institution"):
        raise HTTPException(status_code=400, detail="Invalid portal type")

    billing_org = get_or_create_billing_org(current_user["sub"], portal)
    try:
        result = verify_checkout_payment(billing_org, payload.model_dump())
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")


@router.post("/subscriptions/cancel")
def cancel_subscription(current_user: dict = Depends(verify_user_token)):
    """Request cancellation of subscription at the end of billing period."""
    portal = current_user.get("portal")
    billing_org = get_or_create_billing_org(current_user["sub"], portal)
    return cancel_organization_subscription(billing_org)
