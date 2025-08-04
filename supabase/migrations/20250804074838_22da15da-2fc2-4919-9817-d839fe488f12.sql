-- Enable realtime for students table
ALTER TABLE public.students REPLICA IDENTITY FULL;

-- Add the students table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;