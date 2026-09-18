"""
SkillBridge AI — Super Admin Router
Endpoints:
  POST /api/admin/login         — admin login → JWT
  GET  /api/admin/requests      — list users (pending/approved/rejected)
  POST /api/admin/approve/{id}  — approve a user
  POST /api/admin/reject/{id}   — reject a user with reason
  GET  /api/admin/stats         — dashboard counts
  POST /api/admin/change-password — admin changes own password

  POST /api/users/register      — public user registration (status=pending)
  POST /api/users/login         — public user login (checks status=approved)
"""

import os
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from jose import jwt, JWTError

from app.config import supabase
from app.services.email_service import (
    send_registration_notification,
    send_approval_notification,
    send_rejection_notification,
)

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────

ADMIN_JWT_SECRET = os.getenv("ADMIN_JWT_SECRET")
USER_JWT_SECRET  = os.getenv("USER_JWT_SECRET")
ALGORITHM        = "HS256"
TOKEN_EXPIRE_HRS = 12

if not ADMIN_JWT_SECRET or not USER_JWT_SECRET:
    raise RuntimeError("ADMIN_JWT_SECRET and USER_JWT_SECRET must be set in the environment")

router = APIRouter(prefix="/api", tags=["Admin & Auth"])


# ─────────────────────────────────────────────
# MODELS
# ─────────────────────────────────────────────

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class UserRegisterRequest(BaseModel):
    name:     str
    email:    str
    password: str
    portal:   str          # student | industry | institution
    college:  Optional[str] = None
    company:  Optional[str] = None
    branch:   Optional[str] = None
    phone:    Optional[str] = None
    location: Optional[str] = None
    role_title: Optional[str] = None

class UserLoginRequest(BaseModel):
    email:    str
    password: str
    portal:   str

class RejectRequest(BaseModel):
    reason: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password:     str


# ─────────────────────────────────────────────
# JWT HELPERS
# ─────────────────────────────────────────────

def create_admin_token(admin_id: str, name: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HRS)
    return jwt.encode(
        {"sub": admin_id, "name": name, "email": email,
         "type": "admin", "exp": expire},
        ADMIN_JWT_SECRET, algorithm=ALGORITHM
    )

def create_user_token(user_id: str, email: str, portal: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HRS)
    return jwt.encode(
        {"sub": user_id, "email": email, "portal": portal,
         "type": "user", "exp": expire},
        USER_JWT_SECRET, algorithm=ALGORITHM
    )

def verify_admin_token(authorization: str = Header(...)) -> dict:
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(401, "Invalid auth scheme")
        payload = jwt.decode(token, ADMIN_JWT_SECRET, algorithms=[ALGORITHM])
        if payload.get("type") != "admin":
            raise HTTPException(403, "Not an admin token")
        return payload
    except (JWTError, ValueError):
        raise HTTPException(401, "Invalid or expired admin token")


def verify_user_token(authorization: str = Header(...)) -> dict:
    """Validate a public portal user's bearer token."""
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(401, "Invalid auth scheme")
        payload = jwt.decode(token, USER_JWT_SECRET, algorithms=[ALGORITHM])
        if payload.get("type") != "user":
            raise HTTPException(403, "Not a user token")
        return payload
    except (JWTError, ValueError):
        raise HTTPException(401, "Invalid or expired user token")


# ─────────────────────────────────────────────
# ADMIN ENDPOINTS
# ─────────────────────────────────────────────

@router.post("/admin/login")
def admin_login(req: AdminLoginRequest):
    """Admin team member login."""
    try:
        result = supabase.table("super_admins") \
            .select("*") \
            .eq("email", req.email.lower().strip()) \
            .execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")

    if not result.data:
        raise HTTPException(401, "Invalid email or password")

    admin = result.data[0]

    # Verify bcrypt password
    if not bcrypt.checkpw(req.password.encode(), admin["password_hash"].encode()):
        raise HTTPException(401, "Invalid email or password")

    token = create_admin_token(admin["id"], admin["name"], admin["email"])

    return {
        "token": token,
        "admin": {
            "id":    admin["id"],
            "name":  admin["name"],
            "email": admin["email"],
        }
    }


@router.get("/admin/requests")
def get_requests(
    status: str = "pending",
    admin: dict = Depends(verify_admin_token)
):
    """Get all users filtered by status (pending/approved/rejected)."""
    try:
        result = supabase.table("portal_users") \
            .select("id,name,email,portal,status,college,company,branch,phone,location,role_title,rejection_reason,created_at,reviewed_at") \
            .eq("status", status) \
            .order("created_at", desc=True) \
            .execute()
        return {"users": result.data, "count": len(result.data)}
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")


@router.get("/admin/stats")
def get_stats(admin: dict = Depends(verify_admin_token)):
    """Dashboard summary counts."""
    try:
        pending  = supabase.table("portal_users").select("id", count="exact").eq("status", "pending").execute()
        approved = supabase.table("portal_users").select("id", count="exact").eq("status", "approved").execute()
        rejected = supabase.table("portal_users").select("id", count="exact").eq("status", "rejected").execute()
        students     = supabase.table("portal_users").select("id", count="exact").eq("portal", "student").eq("status", "approved").execute()
        industries   = supabase.table("portal_users").select("id", count="exact").eq("portal", "industry").eq("status", "approved").execute()
        institutions = supabase.table("portal_users").select("id", count="exact").eq("portal", "institution").eq("status", "approved").execute()

        return {
            "pending":      pending.count  or 0,
            "approved":     approved.count or 0,
            "rejected":     rejected.count or 0,
            "students":     students.count     or 0,
            "industries":   industries.count   or 0,
            "institutions": institutions.count or 0,
        }
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")


@router.get("/admin/activity")
def get_activity(admin: dict = Depends(verify_admin_token)):
    """Recent admin actions (last 50)."""
    try:
        result = supabase.table("admin_activity_log") \
            .select("*") \
            .order("created_at", desc=True) \
            .limit(50) \
            .execute()
        return {"activity": result.data}
    except Exception:
        return {"activity": []}


@router.post("/admin/approve/{user_id}")
def approve_user(user_id: str, admin: dict = Depends(verify_admin_token)):
    """Approve a pending user — they can now log in."""
    try:
        # Get user info for logging
        user_res = supabase.table("portal_users").select("email,name,portal").eq("id", user_id).execute()
        if not user_res.data:
            raise HTTPException(404, "User not found")
        user = user_res.data[0]

        # Update status
        supabase.table("portal_users").update({
            "status":       "approved",
            "reviewed_at":  datetime.now(timezone.utc).isoformat(),
        }).eq("id", user_id).execute()

        # Log the action (table may not exist yet)
        try:
            supabase.table("admin_activity_log").insert({
                "admin_id":    admin["sub"],
                "admin_name":  admin["name"],
                "action":      "approved",
                "target_user": user_id,
                "target_email": user["email"],
                "notes":       f"Approved {user['portal']} portal access for {user['name']}",
            }).execute()
        except Exception:
            pass  # Activity log table may not exist

        # Notify the user via email
        try:
            send_approval_notification(
                user_email=user["email"],
                user_name=user["name"],
                portal=user["portal"],
            )
        except Exception:
            pass  # Email failures must not break approval

        return {"message": f"User {user['email']} approved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")


@router.post("/admin/reject/{user_id}")
def reject_user(
    user_id: str,
    req: RejectRequest,
    admin: dict = Depends(verify_admin_token)
):
    """Reject a user with a reason."""
    try:
        user_res = supabase.table("portal_users").select("email,name,portal").eq("id", user_id).execute()
        if not user_res.data:
            raise HTTPException(404, "User not found")
        user = user_res.data[0]

        supabase.table("portal_users").update({
            "status":           "rejected",
            "reviewed_at":      datetime.now(timezone.utc).isoformat(),
            "rejection_reason": req.reason,
        }).eq("id", user_id).execute()

        # Log the action (table may not exist yet)
        try:
            supabase.table("admin_activity_log").insert({
                "admin_id":    admin["sub"],
                "admin_name":  admin["name"],
                "action":      "rejected",
                "target_user": user_id,
                "target_email": user["email"],
                "notes":       req.reason,
            }).execute()
        except Exception:
            pass  # Activity log table may not exist

        # Notify the user via email
        try:
            send_rejection_notification(
                user_email=user["email"],
                user_name=user["name"],
                reason=req.reason,
            )
        except Exception:
            pass  # Email failures must not break rejection

        return {"message": f"User {user['email']} rejected"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")


@router.post("/admin/change-password")
def change_admin_password(req: ChangePasswordRequest, admin: dict = Depends(verify_admin_token)):
    """Admin changes their own password."""
    try:
        result = supabase.table("super_admins").select("password_hash").eq("id", admin["sub"]).execute()
        if not result.data:
            raise HTTPException(404, "Admin not found")

        if not bcrypt.checkpw(req.current_password.encode(), result.data[0]["password_hash"].encode()):
            raise HTTPException(401, "Current password is wrong")

        new_hash = bcrypt.hashpw(req.new_password.encode(), bcrypt.gensalt(10)).decode()
        supabase.table("super_admins").update({"password_hash": new_hash}).eq("id", admin["sub"]).execute()
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")


# ─────────────────────────────────────────────
# PUBLIC USER ENDPOINTS
# ─────────────────────────────────────────────

@router.post("/users/register")
def register_user(req: UserRegisterRequest):
    """Register a new user — creates account with status=pending."""
    if req.portal not in ("student", "industry", "institution"):
        raise HTTPException(400, "Invalid portal type")

    # Check if email already exists
    existing = supabase.table("portal_users").select("id,status").eq("email", req.email.lower().strip()).execute()
    if existing.data:
        user = existing.data[0]
        if user["status"] == "rejected":
            raise HTTPException(400, "Your previous request was rejected. Please contact support.")
        raise HTTPException(400, "An account with this email already exists")

    # Hash password
    pw_hash = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt(10)).decode()

    try:
        result = supabase.table("portal_users").insert({
            "name":         req.name.strip(),
            "email":        req.email.lower().strip(),
            "password_hash": pw_hash,
            "portal":       req.portal,
            "status":       "pending",
            "college":      req.college,
            "company":      req.company,
            "branch":       req.branch,
            "phone":        req.phone,
            "location":     req.location,
            "role_title":   req.role_title,
        }).execute()

        # Notify all super admins via email
        try:
            send_registration_notification(
                user_name=req.name.strip(),
                user_email=req.email.lower().strip(),
                portal=req.portal,
                phone=req.phone,
            )
        except Exception:
            pass  # Email failures must not break registration

        return {
            "message": "Registration successful! Your request is pending admin approval.",
            "status": "pending",
            "user_id": result.data[0]["id"] if result.data else None,
        }
    except Exception as e:
        raise HTTPException(500, f"Registration failed: {str(e)}")


@router.post("/users/login")
def login_user(req: UserLoginRequest):
    """User login — only works if status=approved."""
    try:
        result = supabase.table("portal_users") \
            .select("*") \
            .eq("email", req.email.lower().strip()) \
            .eq("portal", req.portal) \
            .execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")

    if not result.data:
        raise HTTPException(401, "No account found for this email and portal")

    user = result.data[0]

    # Verify password
    if not bcrypt.checkpw(req.password.encode(), user["password_hash"].encode()):
        raise HTTPException(401, "Wrong password")

    # Check approval status
    if user["status"] == "pending":
        raise HTTPException(403, "PENDING: Your account is awaiting admin approval. You'll receive access soon.")
    if user["status"] == "rejected":
        reason = user.get("rejection_reason") or "No reason provided"
        raise HTTPException(403, f"REJECTED: {reason}")

    # status == approved → issue token
    token = create_user_token(user["id"], user["email"], user["portal"])

    return {
        "token": token,
        "portal": user["portal"],
        "user": {
            "id":       user["id"],
            "name":     user["name"],
            "email":    user["email"],
            "portal":   user["portal"],
            "college":  user.get("college"),
            "company":  user.get("company"),
            "branch":   user.get("branch"),
            "role":     user.get("role_title") or user["portal"].capitalize(),
        }
    }
