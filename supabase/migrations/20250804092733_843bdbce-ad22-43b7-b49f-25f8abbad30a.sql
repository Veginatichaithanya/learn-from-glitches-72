
-- Remove all students except rdm@gmail.com
DELETE FROM public.students 
WHERE email != 'rdm@gmail.com';
