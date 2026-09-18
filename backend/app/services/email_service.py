"""
SkillBridge AI — Email Notification Service
Uses Gmail SMTP to send:
  • Registration alerts to super admins
  • Approval / rejection notifications to users
"""

import os
import smtplib
import asyncio
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from concurrent.futures import ThreadPoolExecutor

from app.config import supabase

logger = logging.getLogger("skillbridge.email")

# ─────────────────────────────────────────────
# SMTP CONFIG (loaded from .env)
# ─────────────────────────────────────────────

SMTP_EMAIL    = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL  = os.getenv("FRONTEND_URL", "http://localhost:5173")

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

_executor = ThreadPoolExecutor(max_workers=2)


def _is_configured() -> bool:
    """Check if SMTP credentials are available."""
    return bool(SMTP_EMAIL and SMTP_PASSWORD)


# ─────────────────────────────────────────────
# CORE SEND FUNCTION
# ─────────────────────────────────────────────

def _send_email(to: str, subject: str, html_body: str) -> bool:
    """
    Send an email via Gmail SMTP.
    Returns True on success, False on failure (never raises).
    """
    if not _is_configured():
        logger.warning("SMTP not configured — skipping email to %s", to)
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["From"]    = f"SkillBridge AI <{SMTP_EMAIL}>"
        msg["To"]      = to
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to, msg.as_string())

        logger.info("Email sent to %s — subject: %s", to, subject)
        return True

    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, str(e))
        return False


def _send_email_async(to: str, subject: str, html_body: str):
    """Fire-and-forget email send (runs in background thread)."""
    try:
        loop = asyncio.get_event_loop()
        loop.run_in_executor(_executor, _send_email, to, subject, html_body)
    except RuntimeError:
        # No running event loop — send synchronously in a thread
        _executor.submit(_send_email, to, subject, html_body)


# ─────────────────────────────────────────────
# EMAIL TEMPLATES
# ─────────────────────────────────────────────

def _base_template(title: str, content: str) -> str:
    """Wrap content in a styled HTML email template."""
    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg, #4f46e5, #7c3aed); padding:28px 32px;">
          <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">
            SkillBridge AI
          </h1>
        </div>
        <!-- Body -->
        <div style="padding:32px;">
          <h2 style="margin:0 0 16px; color:#1e293b; font-size:20px; font-weight:600;">{title}</h2>
          {content}
        </div>
        <!-- Footer -->
        <div style="padding:20px 32px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
          <p style="margin:0; color:#94a3b8; font-size:12px;">
            &copy; 2026 SkillBridge AI &middot; All rights reserved
          </p>
        </div>
      </div>
    </body>
    </html>
    """


# ─────────────────────────────────────────────
# PUBLIC API
# ─────────────────────────────────────────────

def send_registration_notification(
    user_name: str,
    user_email: str,
    portal: str,
    phone: str = None,
):
    """
    Notify all super admins that a new user has registered.
    Sends one email per admin (fire-and-forget).
    """
    if not _is_configured():
        logger.warning("SMTP not configured — skipping registration notification")
        return

    portal_label = portal.capitalize()
    phone_row = ""
    if phone:
        phone_row = f"""
        <tr>
          <td style="padding:8px 12px; color:#64748b; font-size:14px; border-bottom:1px solid #f1f5f9;">Phone</td>
          <td style="padding:8px 12px; color:#1e293b; font-size:14px; border-bottom:1px solid #f1f5f9; font-weight:500;">{phone}</td>
        </tr>"""

    content = f"""
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 20px;">
          A new user has registered on the <strong>{portal_label}</strong> portal and is awaiting your approval.
        </p>
        <table style="width:100%; border-collapse:collapse; background:#f8fafc; border-radius:12px; overflow:hidden; margin-bottom:24px;">
          <tr>
            <td style="padding:8px 12px; color:#64748b; font-size:14px; border-bottom:1px solid #f1f5f9;">Name</td>
            <td style="padding:8px 12px; color:#1e293b; font-size:14px; border-bottom:1px solid #f1f5f9; font-weight:500;">{user_name}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; color:#64748b; font-size:14px; border-bottom:1px solid #f1f5f9;">Email</td>
            <td style="padding:8px 12px; color:#1e293b; font-size:14px; border-bottom:1px solid #f1f5f9; font-weight:500;">{user_email}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; color:#64748b; font-size:14px; border-bottom:1px solid #f1f5f9;">Portal</td>
            <td style="padding:8px 12px; color:#1e293b; font-size:14px; border-bottom:1px solid #f1f5f9;">
              <span style="display:inline-block; padding:3px 10px; background:#eef2ff; color:#4f46e5; font-size:12px; font-weight:600; border-radius:6px;">{portal_label}</span>
            </td>
          </tr>
          {phone_row}
        </table>
        <div style="text-align:center;">
          <a href="{FRONTEND_URL}/admin"
             style="display:inline-block; padding:12px 28px; background:linear-gradient(135deg, #4f46e5, #7c3aed); color:#ffffff; text-decoration:none; border-radius:10px; font-size:14px; font-weight:600;">
            Review in Admin Portal &rarr;
          </a>
        </div>
    """

    html = _base_template("&#127381; New Registration Request", content)
    subject = f"[SkillBridge] New {portal_label} Registration — {user_name}"

    # Fetch all super admin emails
    try:
        result = supabase.table("super_admins").select("email").execute()
        admin_emails = [row["email"] for row in (result.data or [])]
    except Exception as e:
        logger.error("Failed to fetch admin emails: %s", str(e))
        admin_emails = []

    for email in admin_emails:
        _send_email_async(email, subject, html)


def send_approval_notification(user_email: str, user_name: str, portal: str):
    """Notify a user that their account has been approved."""
    portal_label = portal.capitalize()

    content = f"""
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 16px;">
          Hi <strong>{user_name}</strong>,
        </p>
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 20px;">
          Great news! Your <strong>{portal_label}</strong> portal account on SkillBridge AI has been
          <span style="color:#16a34a; font-weight:700;">approved &#9989;</span>.
          You can now log in and start using the platform.
        </p>
        <div style="text-align:center; margin:28px 0;">
          <a href="{FRONTEND_URL}"
             style="display:inline-block; padding:14px 32px; background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; text-decoration:none; border-radius:10px; font-size:15px; font-weight:600;">
            Log In Now &rarr;
          </a>
        </div>
        <p style="color:#94a3b8; font-size:13px; margin:0;">
          If you did not create this account, please ignore this email.
        </p>
    """

    html = _base_template("Account Approved! &#127881;", content)
    subject = f"[SkillBridge] Your {portal_label} Account Has Been Approved!"

    _send_email_async(user_email, subject, html)


def send_rejection_notification(user_email: str, user_name: str, reason: str):
    """Notify a user that their account has been rejected."""
    content = f"""
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 16px;">
          Hi <strong>{user_name}</strong>,
        </p>
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 20px;">
          We regret to inform you that your SkillBridge AI account request has been
          <span style="color:#dc2626; font-weight:700;">not approved</span> at this time.
        </p>
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:16px 20px; margin-bottom:24px;">
          <p style="margin:0 0 4px; color:#991b1b; font-size:13px; font-weight:600;">Reason:</p>
          <p style="margin:0; color:#b91c1c; font-size:14px; line-height:1.5;">{reason}</p>
        </div>
        <p style="color:#475569; font-size:14px; line-height:1.6; margin:0;">
          If you believe this is a mistake, please reach out to our support team at
          <a href="mailto:support@skillbridge.ai" style="color:#4f46e5; text-decoration:none; font-weight:500;">support@skillbridge.ai</a>.
        </p>
    """

    html = _base_template("Account Request Update", content)
    subject = "[SkillBridge] Update on Your Account Request"

    _send_email_async(user_email, subject, html)
