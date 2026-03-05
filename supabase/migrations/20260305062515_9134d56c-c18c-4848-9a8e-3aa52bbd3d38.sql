
-- Add new columns to widget_settings
ALTER TABLE public.widget_settings
  ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  ADD COLUMN IF NOT EXISTS template text NOT NULL DEFAULT 'customer_support',
  ADD COLUMN IF NOT EXISTS theme text NOT NULL DEFAULT 'light',
  ADD COLUMN IF NOT EXISTS primary_color text NOT NULL DEFAULT '#E8734A',
  ADD COLUMN IF NOT EXISTS profile_picture_url text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS training_text text;

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-assets', 'agent-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own files
CREATE POLICY "Users upload own agent assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'agent-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access
CREATE POLICY "Public read agent assets"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'agent-assets');

-- Allow users to update/delete their own files
CREATE POLICY "Users manage own agent assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'agent-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
