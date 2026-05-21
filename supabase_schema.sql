-- SUPABASE SQL SCHEMA FOR INSTITUTE MANAGEMENT SYSTEM
-- This script creates the database structure matching the application types.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Links with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMINISTRATOR', 'ADMIN', 'FRANCHISE', 'TEACHER', 'STUDENT')),
    avatar TEXT,
    franchise_id TEXT, -- Link to franchises table
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BUSINESS PROFILE (Typically a single record)
CREATE TABLE IF NOT EXISTS public.business_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    legal_name TEXT,
    iso_no TEXT,
    reg_no TEXT,
    email TEXT,
    phone TEXT,
    address TEXT, -- Head Office Address
    regional_address TEXT,
    pincode TEXT,
    website TEXT,
    working_hours TEXT,
    logo_url TEXT,
    header_image_url TEXT, -- Receipt Header Image
    signature_url TEXT,
    mission TEXT, -- Short Mission Statement
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    enable_digital_signatures BOOLEAN DEFAULT TRUE,
    
    -- Director Profile
    director_photo_url TEXT,
    director_name TEXT,
    director_message TEXT,
    
    -- Visionaries & Banners
    visionaries JSONB DEFAULT '[]', -- Array of {id, name, designation, photo_url}
    banners TEXT[], -- Website Home Banners (Array of image URLs)
    gallery JSONB DEFAULT '[]', -- Institute Gallery (Array of {id, url, caption})
    
    -- Website Static Page Images
    about_banner_url TEXT,
    contact_banner_url TEXT,
    featured_courses_image_url TEXT,
    success_stories_banner_url TEXT,
    receipt_top_header_url TEXT, -- Official Fee Receipt Top Header Wide Image
    
    -- Academic Prospectus
    prospectus_url TEXT,
    prospectus_name TEXT,
    prospectus_size TEXT,
    prospectus_version TEXT,
    prospectus_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COURSES
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    features TEXT[],
    level TEXT NOT NULL,
    rating NUMERIC DEFAULT 4.5,
    photo_url TEXT,
    banner_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3a. COURSE CATEGORIES
CREATE TABLE IF NOT EXISTS public.course_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url TEXT,
    banner_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3b. SUBJECTS (Subject Matrix)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    credit_hours NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3c. PROGRAMS (Create Program)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT,
    include_courses TEXT[], -- Array of included course IDs/names
    thumbnail_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3d. GLOBAL COURSE SETTINGS
CREATE TABLE IF NOT EXISTS public.global_course_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    auto_generate_code BOOLEAN DEFAULT TRUE,
    prerequisite_check BOOLEAN DEFAULT FALSE,
    pass_percentage NUMERIC DEFAULT 35,
    min_attendance_required NUMERIC DEFAULT 75,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FRANCHISES
CREATE TABLE IF NOT EXISTS public.franchises (
    id TEXT PRIMARY KEY, -- e.g. SKY123
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    contact TEXT NOT NULL,
    address TEXT NOT NULL,
    wallet_balance NUMERIC DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'BLOCKED')),
    revenue_share_percent NUMERIC NOT NULL DEFAULT 20,
    validity_from DATE,
    validity_to DATE,
    login_id TEXT UNIQUE,
    password TEXT,
    approval_certificate_url TEXT,
    director_photo_url TEXT,
    logo_url TEXT,
    enabled_menus TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    enrollment_no TEXT UNIQUE NOT NULL,
    admission_no TEXT NOT NULL,
    name TEXT NOT NULL,
    father_name TEXT,
    mother_name TEXT,
    dob DATE,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other', '')),
    contact TEXT NOT NULL,
    guardian_contact TEXT,
    email TEXT,
    caste_category TEXT,
    religion TEXT,
    marital_status TEXT,
    identity_type TEXT,
    id_number TEXT,
    appar_id TEXT,
    photo_url TEXT,
    
    -- Center & Course Details
    franchise_id TEXT REFERENCES public.franchises(id) ON DELETE SET NULL,
    study_center TEXT,
    session TEXT,
    course_category TEXT,
    course TEXT, -- Course name
    course_duration TEXT,
    admission_date DATE,
    
    -- Qualification
    highest_qualification TEXT,
    qualification_detail TEXT,
    qualification_board_university TEXT,
    passing_year TEXT,
    
    -- Address
    address TEXT,
    state TEXT,
    district TEXT,
    pincode TEXT,
    
    -- Documents & KYC URLS (Form image inputs)
    aadhar_id_card_url TEXT,
    qualification_doc_url TEXT,
    signature_url TEXT,
    address_proof_url TEXT,
    other_doc_url TEXT,
    
    -- Extra
    remark TEXT,
    enquiry_source TEXT,
    verification_code TEXT,
    
    -- Status
    fee_status TEXT DEFAULT 'PENDING' CHECK (fee_status IN ('PAID', 'PARTIAL', 'PENDING')),
    kyc_status TEXT DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    kyc_docs JSONB DEFAULT '[]', -- Array of DocumentRecord
    total_fees NUMERIC DEFAULT 0,
    paid_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FEE PAYMENTS (Receipts)
CREATE TABLE IF NOT EXISTS public.fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    receipt_no TEXT NOT NULL UNIQUE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    fee_type TEXT,
    heads JSONB DEFAULT '[]', -- Array of FeeHeadDetail
    amount NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    penalty NUMERIC DEFAULT 0,
    paid_amount NUMERIC NOT NULL,
    balance NUMERIC DEFAULT 0,
    payment_mode TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('Paid', 'Partial', 'Pending')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WALLET TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    franchise_id TEXT REFERENCES public.franchises(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
    purpose TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
    voucher_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. VOUCHERS (Top-up requests)
CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_no TEXT UNIQUE NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    amount NUMERIC NOT NULL,
    franchise_id TEXT REFERENCES public.franchises(id) ON DELETE CASCADE,
    center_name TEXT,
    director_name TEXT,
    remarks TEXT,
    status TEXT NOT NULL CHECK (status IN ('VERIFIED', 'PENDING', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9a. CERTIFICATE TEMPLATES (For Layout Design)
CREATE TABLE IF NOT EXISTS public.certificate_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g. DIPLOMA, CERTIFICATE, MARKSHEET
    design_config JSONB DEFAULT '{}', -- Custom visual styles, fonts, fields mapping
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CERTIFICATES (For Student Certifications & Manual Entries)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_no TEXT UNIQUE NOT NULL,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE, -- Nullable for manual entries
    student_name TEXT, -- Candidate Name or student name
    father_name TEXT, -- Father's Name (for manual entries)
    course TEXT, -- Course Title / Trade
    duration TEXT, -- e.g. "3 Months"
    grade TEXT, -- e.g. "A"
    term_start TEXT, -- e.g. "Apr-2026"
    term_end TEXT, -- e.g. "Oct-2026"
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    status TEXT NOT NULL CHECK (status IN ('ISSUED', 'REVOKED')),
    franchise_id TEXT REFERENCES public.franchises(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.certificate_templates(id) ON DELETE SET NULL, -- Selected Template
    qr_code_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. EMPLOYEES
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    designation TEXT,
    department TEXT,
    date_of_joining DATE,
    salary NUMERIC,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target JSONB DEFAULT '"ALL"', -- Can be array of roles or "ALL"
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'NORMAL', 'MEDIUM - NORMAL', 'LOW - MINOR', 'HIGH - CRITICAL')),
    status TEXT CHECK (status IN ('PUBLISHED', 'DRAFT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ADMISSION ENQUIRIES (Leads)
CREATE TABLE IF NOT EXISTS public.admission_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    course TEXT,
    message TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'FOLLOWED_UP', 'ENROLLED', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. BUSINESS TRANSACTIONS (General Ledger)
CREATE TABLE IF NOT EXISTS public.business_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    category TEXT,
    amount NUMERIC NOT NULL,
    description TEXT,
    payment_mode TEXT,
    reference_id TEXT,
    status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. FEE STRUCTURES (Pre-defined templates)
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    head TEXT NOT NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    course_name TEXT,
    frequency TEXT,
    amount NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    late_penalty NUMERIC DEFAULT 0,
    session TEXT,
    type TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. ACADEMIC SESSIONS
CREATE TABLE IF NOT EXISTS public.academic_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. EXAMS
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    session TEXT,
    trade TEXT,
    unit TEXT,
    start_date DATE,
    end_date DATE,
    remarks TEXT,
    status TEXT CHECK (status IN ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    invigilator TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (Optional but recommended)
-- By default, we enable RLS on sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Modify based on your needs)
-- Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Allow admins to see everything
-- (Requires a way to check admin role, usually via a function or claim)

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql SECURITY INVOKER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_franchises_updated_at ON public.franchises;
CREATE TRIGGER update_franchises_updated_at BEFORE UPDATE ON public.franchises FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_business_profile_updated_at ON public.business_profile;
CREATE TRIGGER update_business_profile_updated_at BEFORE UPDATE ON public.business_profile FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_certificates_updated_at ON public.certificates;
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_certificate_templates_updated_at ON public.certificate_templates;
CREATE TRIGGER update_certificate_templates_updated_at BEFORE UPDATE ON public.certificate_templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_admission_enquiries_updated_at ON public.admission_enquiries;
CREATE TRIGGER update_admission_enquiries_updated_at BEFORE UPDATE ON public.admission_enquiries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- FIX RLS AUTO ENABLE SECURITY DEFINER WARNINGS IF IT EXISTS
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid 
        WHERE proname = 'rls_auto_enable' AND nspname = 'public'
    ) THEN
        -- Switch the function to SECURITY INVOKER so it doesn't bypass system permissions 
        -- or run with elevated privileges of the creator
        ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER SET search_path = public, pg_temp;
        
        -- Revoke execute permissions on the function from public, anonymous (anon), and authenticated roles
        REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_franchise_id ON public.students(franchise_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON public.fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_receipt_no ON public.fee_payments(receipt_no);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_franchise_id ON public.wallet_transactions(franchise_id);

-- FAIL-SAFE ALTER STATEMENTS FOR EXISTING DATABASES
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

ALTER TABLE public.students ADD COLUMN IF NOT EXISTS qualification_board_university TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS aadhar_id_card_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS qualification_doc_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS address_proof_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS other_doc_url TEXT;

-- Business Profile modifications
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS enable_digital_signatures BOOLEAN DEFAULT TRUE;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS visionaries JSONB DEFAULT '[]';
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS about_banner_url TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS contact_banner_url TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS featured_courses_image_url TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS success_stories_banner_url TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS receipt_top_header_url TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS prospectus_url TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS prospectus_name TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS prospectus_size TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS prospectus_version TEXT;
ALTER TABLE public.business_profile ADD COLUMN IF NOT EXISTS prospectus_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Certificates table modifications
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS term_start TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS term_end TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.certificate_templates(id) ON DELETE SET NULL;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Announcements & Admission Enquiries modifications
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.admission_enquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Relax check constraint on announcements priority dynamically if required
DO $$
BEGIN
    ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_priority_check;
    ALTER TABLE public.announcements ADD CONSTRAINT announcements_priority_check 
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'NORMAL', 'MEDIUM - NORMAL', 'LOW - MINOR', 'HIGH - CRITICAL'));
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- ENABLE RLS ON NEW TABLES
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_course_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR NEW TABLES (Enables smooth client integrations)
DROP POLICY IF EXISTS "Allow select for public/authenticated on courses" ON public.courses;
CREATE POLICY "Allow select for public/authenticated on courses" ON public.courses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated on courses" ON public.courses;
CREATE POLICY "Allow all for authenticated on courses" ON public.courses FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow select for public/authenticated on categories" ON public.course_categories;
CREATE POLICY "Allow select for public/authenticated on categories" ON public.course_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated on categories" ON public.course_categories;
CREATE POLICY "Allow all for authenticated on categories" ON public.course_categories FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow select for public/authenticated on subjects" ON public.subjects;
CREATE POLICY "Allow select for public/authenticated on subjects" ON public.subjects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated on subjects" ON public.subjects;
CREATE POLICY "Allow all for authenticated on subjects" ON public.subjects FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow select for public/authenticated on programs" ON public.programs;
CREATE POLICY "Allow select for public/authenticated on programs" ON public.programs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated on programs" ON public.programs;
CREATE POLICY "Allow all for authenticated on programs" ON public.programs FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow select for public/authenticated on settings" ON public.global_course_settings;
CREATE POLICY "Allow select for public/authenticated on settings" ON public.global_course_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated on settings" ON public.global_course_settings;
CREATE POLICY "Allow all for authenticated on settings" ON public.global_course_settings FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow select for public/authenticated on templates" ON public.certificate_templates;
CREATE POLICY "Allow select for public/authenticated on templates" ON public.certificate_templates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated on templates" ON public.certificate_templates;
CREATE POLICY "Allow all for authenticated on templates" ON public.certificate_templates FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

