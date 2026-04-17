-- CADET PROTOCOL DATABASE SCHEMA
-- Version: 1.0 (2028 Infrastructure)

-- 1. Profiles Table: Stores candidate information
CREATE TABLE IF NOT EXISTS cadet_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  target_service TEXT CHECK (target_service IN ('Army', 'Navy', 'Air Force')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Medical Audits Table: Stores AI scan results
CREATE TABLE IF NOT EXISTS medical_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cadet_id UUID REFERENCES cadet_profiles(id) NOT NULL,
  scan_type TEXT NOT NULL, -- 'Carrying Angle', 'Knock Knee', 'BMI'
  measured_value FLOAT8 NOT NULL,
  compliance_status TEXT CHECK (compliance_status IN ('Fit', 'Risk', 'Unfit')),
  scan_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS)
ALTER TABLE cadet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_audits ENABLE ROW LEVEL SECURITY;

-- Policies: Each cadet can only see their own data
CREATE POLICY "Cadets can view own profile" ON cadet_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Cadets can view own scans" ON medical_audits
  FOR SELECT USING (auth.uid() = cadet_id);

CREATE POLICY "Cadets can insert own scans" ON medical_audits
  FOR INSERT WITH CHECK (auth.uid() = cadet_id);
