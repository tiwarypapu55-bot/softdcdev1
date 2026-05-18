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
    address TEXT,
    regional_address TEXT,
    website TEXT,
    working_hours TEXT,
    logo_url TEXT,
    header_image_url TEXT,
    signature_url TEXT,
    mission TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    director_photo_url TEXT,
    director_name TEXT,
    director_message TEXT,
    banners TEXT[], -- Array of image URLs
    gallery JSONB DEFAULT '[]', -- Array of {id, url, caption}
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    passing_year TEXT,
    
    -- Address
    address TEXT,
    state TEXT,
    district TEXT,
    pincode TEXT,
    
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

-- 9. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_no TEXT UNIQUE NOT NULL,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT,
    course TEXT,
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    status TEXT NOT NULL CHECK (status IN ('ISSUED', 'REVOKED')),
    franchise_id TEXT REFERENCES public.franchises(id) ON DELETE CASCADE,
    qr_code_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status TEXT CHECK (status IN ('PUBLISHED', 'DRAFT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Allow admins to see everything
-- (Requires a way to check admin role, usually via a function or claim)

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_franchises_updated_at BEFORE UPDATE ON public.franchises FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_business_profile_updated_at BEFORE UPDATE ON public.business_profile FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_franchise_id ON public.students(franchise_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON public.fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_receipt_no ON public.fee_payments(receipt_no);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_franchise_id ON public.wallet_transactions(franchise_id);
