-- MediTex Schema Migration Script
-- Run this in your Supabase SQL Editor to set up the database

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g., [{"label": "Size", "value": "10cm x 4m"}, {"label": "Material", "value": "100% Cotton"}]
    image_url TEXT,
    is_sterile BOOLEAN NOT NULL DEFAULT false,
    certifications TEXT[] NOT NULL DEFAULT '{}'::text[], -- e.g., {'CE', 'ISO 13485', 'BP Standards'}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products(slug);

-- 3. CREATE QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewed, fulfilled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE QUOTE REQUEST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.quote_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_request_id UUID REFERENCES public.quote_requests(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    specifications TEXT -- Custom sizing or notes specific to this product in the request
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_request_items ENABLE ROW LEVEL SECURITY;

-- 6. CREATE RLS POLICIES

-- Products policies
CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Allow full access to products for authenticated users" 
ON public.products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Quote requests policies
CREATE POLICY "Allow public insert to quote requests" 
ON public.quote_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read and write to quote requests" 
ON public.quote_requests FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Quote request items policies
CREATE POLICY "Allow public insert to quote request items" 
ON public.quote_request_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read and write to quote request items" 
ON public.quote_request_items FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 7. AUTO UPDATE UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. INITIAL STORAGE SETUP (if bucket table exists)
-- This attempts to insert the product-images bucket. It will fail gracefully if already exists.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Allow public select from product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Allow admin upload to product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow admin update/delete from product-images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- 9. SEED INITIAL PRODUCTS
INSERT INTO public.products (name, slug, category, description, specifications, image_url, is_sterile, certifications)
VALUES 
(
    'Cotton Bandage',
    'cotton-bandage',
    'Bandages',
    '100% natural cotton, breathable and high absorbency. Ideal for securing wound dressings with maximum patient comfort.',
    '[{"label": "Material", "value": "100% Cotton"}, {"label": "Thread Count", "value": "17 Threads/cm²"}, {"label": "Sterility", "value": "Sterile EO (Ethylene Oxide)"}, {"label": "Available Widths", "value": "5cm, 7.5cm, 10cm, 15cm"}]'::jsonb,
    '/assets/cotton-bandage.png',
    true,
    '{"CE", "ISO 13485"}'::text[]
),
(
    'Crepe Bandage',
    'crepe-bandage',
    'Bandages',
    'Elastic support bandage for sprains, strains, and minor fractures. Extremely durable, washable, and reusable fabric.',
    '[{"label": "Material", "value": "90% Cotton, 10% Spandex"}, {"label": "Stretch Capability", "value": "Heavy Stretch (up to 180%)"}, {"label": "Weight / Thickness", "value": "75 gsm"}, {"label": "Available Lengths", "value": "4m stretched"}]'::jsonb,
    '/assets/crepe-bandage.png',
    false,
    '{"CE", "ISO 13485"}'::text[]
),
(
    'Surgical Cotton Wool',
    'surgical-cotton-wool',
    'Cotton Products',
    'Highly absorbent, chemical-free and impurities-free bleached cotton wool. Perfect for wound cleaning, padding, and liquid absorption.',
    '[{"label": "Material", "value": "100% Bleached Cotton"}, {"label": "Absorbency Speed", "value": "Less than 10 seconds"}, {"label": "Purity Check", "value": "Optical brightener & starch free"}, {"label": "Packaging Sizes", "value": "100g, 250g, 500g rolls"}]'::jsonb,
    '/assets/cotton-wool.png',
    false,
    '{"CE", "ISO 13485", "BP Standards"}'::text[]
),
(
    'Absorbent Cotton Gauze',
    'absorbent-cotton-gauze',
    'Gauze Products',
    'Premium medical cotton gauze conforming to European Pharmacopoeia (BP) standards. Soft and highly absorbent fabric layout.',
    '[{"label": "Material", "value": "100% Cotton Gauze"}, {"label": "Ply & Layers", "value": "8-ply, 12-ply, 16-ply"}, {"label": "Mesh Size Density", "value": "19x15 threads or 20x12 threads"}, {"label": "Sterility Formats", "value": "Sterile or Non-Sterile packs available"}]'::jsonb,
    '/assets/gauze.png',
    true,
    '{"CE", "ISO 13485"}'::text[]
),
(
    'Absorbent Cotton Lint',
    'absorbent-cotton-lint',
    'Cotton Products',
    'Soft, highly flexible cotton lint material raised/napped on one side. Specially designed for sensitive skin, burns, and ointment dressing applications.',
    '[{"label": "Material", "value": "100% Cotton Lint"}, {"label": "Napped Raised Layer", "value": "Single side raised nap structure"}, {"label": "Primary Application", "value": "Ointment application and burn dressing"}, {"label": "Standard Weights", "value": "100g, 500g packages"}]'::jsonb,
    '/assets/lint.png',
    false,
    '{"CE", "ISO 13485"}'::text[]
)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    specifications = EXCLUDED.specifications,
    image_url = EXCLUDED.image_url,
    is_sterile = EXCLUDED.is_sterile,
    certifications = EXCLUDED.certifications;

-- 10. ERP EXTENSION TABLES

-- Raw materials inventory
CREATE TABLE IF NOT EXISTS public.raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    stock_qty NUMERIC NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    unit TEXT NOT NULL DEFAULT 'kg', -- kg, meters, rolls, etc.
    reorder_level NUMERIC NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Production runs / manufacturing batches
CREATE TABLE IF NOT EXISTS public.production_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    lot_number TEXT NOT NULL UNIQUE,
    quantity_produced INTEGER NOT NULL CHECK (quantity_produced > 0),
    status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, failed
    scheduled_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_date TIMESTAMP WITH TIME ZONE
);

-- Logistics / Shipping logs
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_request_id UUID REFERENCES public.quote_requests(id) ON DELETE CASCADE NOT NULL,
    carrier TEXT NOT NULL,
    tracking_number TEXT,
    status TEXT NOT NULL DEFAULT 'preparing', -- preparing, shipped, in_transit, delivered
    customs_documents TEXT, -- URL or filename
    shipped_at TIMESTAMP WITH TIME ZONE
);

-- 11. ENABLE RLS FOR ERP TABLES
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- 12. CREATE RLS POLICIES FOR ERP TABLES (Authenticated users only)
CREATE POLICY "Allow authenticated read and write to raw_materials"
ON public.raw_materials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated read and write to production_batches"
ON public.production_batches FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated read and write to shipments"
ON public.shipments FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 13. SEED INITIAL RAW MATERIALS
INSERT INTO public.raw_materials (name, sku, stock_qty, unit, reorder_level)
VALUES 
('Raw Medical Grade Cotton', 'RAW-COTTON-01', 1250.0, 'kg', 200.0),
('Elastic Crepe Spandex Yarn', 'SPANDEX-YARN-02', 450.0, 'kg', 80.0),
('Sterile EO Indicators', 'STERILE-EO-IND', 2500.0, 'units', 500.0),
('Medical Packaging Boxes', 'PACK-BOX-MED', 1200.0, 'units', 300.0)
ON CONFLICT (sku) DO UPDATE
SET stock_qty = EXCLUDED.stock_qty,
    reorder_level = EXCLUDED.reorder_level;
