-- Create meetings table for admin-created meetings
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  meet_link TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.admin_users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Admin can manage all meetings
CREATE POLICY "Admin can manage meetings" 
ON public.meetings 
FOR ALL
USING (public.is_admin_authenticated());

-- Students can view active meetings
CREATE POLICY "Students can view active meetings" 
ON public.meetings 
FOR SELECT
USING (is_active = true);

-- Create storage bucket for meeting images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meeting-images', 'meeting-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for meeting images
CREATE POLICY "Anyone can view meeting images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'meeting-images');

CREATE POLICY "Admins can upload meeting images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'meeting-images' AND public.is_admin_authenticated());

CREATE POLICY "Admins can update meeting images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'meeting-images' AND public.is_admin_authenticated());

CREATE POLICY "Admins can delete meeting images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'meeting-images' AND public.is_admin_authenticated());

-- Enable realtime for meetings
ALTER TABLE public.meetings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;

-- Create trigger for updated_at
CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();