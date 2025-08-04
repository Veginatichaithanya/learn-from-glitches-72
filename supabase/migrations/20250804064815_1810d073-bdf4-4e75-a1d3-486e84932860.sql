-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create error challenges table
CREATE TABLE public.error_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  error_type TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  completion_count INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create live classes table
CREATE TABLE public.live_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  instructor_name TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  attendee_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (only admins can access these tables)
CREATE POLICY "Admins can view all students" 
ON public.students 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

CREATE POLICY "Admins can manage students" 
ON public.students 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

CREATE POLICY "Admins can view all courses" 
ON public.courses 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

CREATE POLICY "Admins can manage courses" 
ON public.courses 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

CREATE POLICY "Admins can view all error challenges" 
ON public.error_challenges 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

CREATE POLICY "Admins can manage error challenges" 
ON public.error_challenges 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

CREATE POLICY "Admins can view all live classes" 
ON public.live_classes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

CREATE POLICY "Admins can manage live classes" 
ON public.live_classes 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE id::text = auth.uid()::text AND is_active = true
));

-- Add triggers for updated_at
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_error_challenges_updated_at
BEFORE UPDATE ON public.error_challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_live_classes_updated_at
BEFORE UPDATE ON public.live_classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.courses REPLICA IDENTITY FULL;
ALTER TABLE public.error_challenges REPLICA IDENTITY FULL;
ALTER TABLE public.live_classes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD table public.students;
ALTER publication supabase_realtime ADD table public.courses;
ALTER publication supabase_realtime ADD table public.error_challenges;
ALTER publication supabase_realtime ADD table public.live_classes;

-- Insert sample data
INSERT INTO public.students (email, full_name) VALUES 
('john.doe@example.com', 'John Doe'),
('jane.smith@example.com', 'Jane Smith'),
('bob.wilson@example.com', 'Bob Wilson'),
('alice.brown@example.com', 'Alice Brown'),
('charlie.davis@example.com', 'Charlie Davis');

INSERT INTO public.courses (title, description, difficulty_level, student_count) VALUES 
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming', 'beginner', 156),
('React Error Handling', 'Master error boundaries and debugging in React', 'intermediate', 89),
('Advanced TypeScript', 'Deep dive into TypeScript advanced features', 'advanced', 45),
('Node.js Debugging', 'Debug Node.js applications effectively', 'intermediate', 78);

INSERT INTO public.error_challenges (title, description, error_type, completion_count, total_attempts) VALUES 
('TypeError: Cannot read property', 'Fix common property access errors', 'TypeError', 234, 456),
('SyntaxError: Missing semicolon', 'Learn proper JavaScript syntax', 'SyntaxError', 189, 298),
('ReferenceError: Variable not defined', 'Understand variable scope issues', 'ReferenceError', 145, 267),
('Promise rejection handling', 'Handle async errors properly', 'UnhandledPromiseRejection', 98, 187);

INSERT INTO public.live_classes (title, instructor_name, scheduled_at, attendee_count) VALUES 
('Live Debugging Session', 'Sarah Johnson', NOW() + INTERVAL '2 hours', 24),
('Error Handling Best Practices', 'Mike Chen', NOW() + INTERVAL '1 day', 0),
('React Performance Debugging', 'Emma Davis', NOW() + INTERVAL '2 days', 0);