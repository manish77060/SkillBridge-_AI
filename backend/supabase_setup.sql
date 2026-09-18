-- ============================================================
-- SkillBridge AI — Super Admin System Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================


-- 1. SUPER ADMINS TABLE (6 team members)
-- ============================================================
CREATE TABLE IF NOT EXISTS super_admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS so backend (service role) can always read it
ALTER TABLE super_admins DISABLE ROW LEVEL SECURITY;


-- 2. PORTAL USERS TABLE (all registered users)
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  email            TEXT UNIQUE NOT NULL,
  password_hash    TEXT NOT NULL,
  portal           TEXT NOT NULL CHECK (portal IN ('student', 'industry', 'institution')),
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Optional profile fields
  college          TEXT,
  company          TEXT,
  branch           TEXT,
  phone            TEXT,
  location         TEXT,
  role_title       TEXT,

  -- Admin review fields
  reviewed_by      UUID REFERENCES super_admins(id),
  reviewed_at      TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Timestamps
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portal_users DISABLE ROW LEVEL SECURITY;


-- 3. ADMIN ACTIVITY LOG TABLE (audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES super_admins(id),
  admin_name  TEXT,
  action      TEXT NOT NULL,
  target_user UUID REFERENCES portal_users(id),
  target_email TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_activity_log DISABLE ROW LEVEL SECURITY;


-- 4. INSERT THE 6 SUPER ADMINS
-- Password for ALL admins is: Admin@SkillBridge2026
-- bcrypt hash (cost=10) of that password:
-- ============================================================
INSERT INTO super_admins (name, email, password_hash) VALUES
  ('Manish Yadav',     'manish@skillbridge.ai',    '$2b$10$XsHRd4Xad.k.9OFsFz.nQekjfBFEJLEKBLF4GzVt6.T2bWxEPSO6K'),
  ('Team Member 2',    'admin2@skillbridge.ai',    '$2b$10$XsHRd4Xad.k.9OFsFz.nQekjfBFEJLEKBLF4GzVt6.T2bWxEPSO6K'),
  ('Team Member 3',    'admin3@skillbridge.ai',    '$2b$10$XsHRd4Xad.k.9OFsFz.nQekjfBFEJLEKBLF4GzVt6.T2bWxEPSO6K'),
  ('Team Member 4',    'admin4@skillbridge.ai',    '$2b$10$XsHRd4Xad.k.9OFsFz.nQekjfBFEJLEKBLF4GzVt6.T2bWxEPSO6K'),
  ('Team Member 5',    'admin5@skillbridge.ai',    '$2b$10$XsHRd4Xad.k.9OFsFz.nQekjfBFEJLEKBLF4GzVt6.T2bWxEPSO6K'),
  ('Team Member 6',    'admin6@skillbridge.ai',    '$2b$10$XsHRd4Xad.k.9OFsFz.nQekjfBFEJLEKBLF4GzVt6.T2bWxEPSO6K')
ON CONFLICT (email) DO NOTHING;

-- NOTE: After setup, each admin should change their password via the admin portal.
-- Default password: Admin@SkillBridge2026
