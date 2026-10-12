-- ============================================================
-- SkillBridge AI — Subscription & Payment System Setup (Razorpay + Supabase)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. BILLABLE ORGANIZATIONS TABLE
-- Maps either portal_users.id (as organization_id) or separate organization record
-- ============================================================
CREATE TABLE IF NOT EXISTS public.billing_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('industry', 'institution')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_organizations DISABLE ROW LEVEL SECURITY;

-- 2. BILLING PLANS TABLE (Server-controlled plans & prices)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.billing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_type TEXT NOT NULL CHECK (portal_type IN ('industry', 'institution')),
    plan_code TEXT NOT NULL UNIQUE,
    plan_name TEXT NOT NULL,
    billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly', 'yearly')),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    razorpay_plan_id TEXT,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_plans DISABLE ROW LEVEL SECURITY;

-- 3. BILLING SUBSCRIPTIONS TABLE (Trials & Subscriptions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_organization_id UUID NOT NULL REFERENCES public.billing_organizations(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.billing_plans(id),
    status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN (
        'trialing', 'created', 'authenticated', 'active', 'past_due', 'halted', 'cancelled', 'expired'
    )),
    trial_started_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    razorpay_subscription_id TEXT UNIQUE,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_subscriptions DISABLE ROW LEVEL SECURITY;

-- 4. BILLING PAYMENTS TABLE (Payment transaction records)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.billing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.billing_subscriptions(id) ON DELETE SET NULL,
    billing_organization_id UUID NOT NULL REFERENCES public.billing_organizations(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'authorized', 'captured', 'failed', 'refunded'
    )),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_payments DISABLE ROW LEVEL SECURITY;

-- 5. WEBHOOK DEDUPLICATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.billing_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_webhook_events DISABLE ROW LEVEL SECURITY;

-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_org ON public.billing_subscriptions(billing_organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_payments_org ON public.billing_payments(billing_organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status ON public.billing_subscriptions(status);

-- 6. DEFAULT SEED PLANS
-- ============================================================
INSERT INTO public.billing_plans (portal_type, plan_code, plan_name, billing_interval, amount_paise, features)
VALUES 
  (
    'industry', 
    'industry_pro_monthly', 
    'Industry Pro (Monthly)', 
    'monthly', 
    499900, 
    '{
      "unlimited_job_posts": true,
      "ai_candidate_matching": true,
      "unlimited_recruitment_pipeline": true,
      "advanced_analytics": true,
      "candidate_export": true,
      "direct_candidate_messaging": true
    }'::jsonb
  ),
  (
    'industry', 
    'industry_pro_yearly', 
    'Industry Pro (Annual)', 
    'yearly', 
    4999900, 
    '{
      "unlimited_job_posts": true,
      "ai_candidate_matching": true,
      "unlimited_recruitment_pipeline": true,
      "advanced_analytics": true,
      "candidate_export": true,
      "direct_candidate_messaging": true,
      "priority_support": true,
      "annual_discount": "Save 17%"
    }'::jsonb
  ),
  (
    'institution', 
    'institution_pro_monthly', 
    'Institution Pro (Monthly)', 
    'monthly', 
    999900, 
    '{
      "unlimited_student_cohorts": true,
      "ai_skill_gap_tracking": true,
      "placement_analytics": true,
      "downloadable_placement_reports": true,
      "industry_partner_matching": true
    }'::jsonb
  ),
  (
    'institution', 
    'institution_pro_yearly', 
    'Institution Pro (Annual)', 
    'yearly', 
    9999900, 
    '{
      "unlimited_student_cohorts": true,
      "ai_skill_gap_tracking": true,
      "placement_analytics": true,
      "downloadable_placement_reports": true,
      "industry_partner_matching": true,
      "dedicated_account_manager": true,
      "annual_discount": "Save 17%"
    }'::jsonb
  )
ON CONFLICT (plan_code) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  amount_paise = EXCLUDED.amount_paise,
  features = EXCLUDED.features;
