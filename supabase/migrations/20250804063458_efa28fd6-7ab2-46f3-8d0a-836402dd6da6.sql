-- Create admin_users table for secure admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin users (only allow admins to access)
CREATE POLICY "Admin users can view their own data" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update their own data" 
ON public.admin_users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Create function to hash passwords using crypt
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT crypt(password, gen_salt('bf', 12));
$$;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT hash = crypt(password, hash);
$$;

-- Create function for admin login verification
CREATE OR REPLACE FUNCTION public.verify_admin_login(email_input text, password_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record public.admin_users;
  result json;
BEGIN
  -- Find admin user by email
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = email_input AND is_active = true;
  
  -- Check if user exists and password is correct
  IF admin_record.id IS NOT NULL AND public.verify_password(password_input, admin_record.password_hash) THEN
    -- Update last login time
    UPDATE public.admin_users 
    SET last_login_at = now(), updated_at = now()
    WHERE id = admin_record.id;
    
    -- Return success with user data
    result := json_build_object(
      'success', true,
      'admin', json_build_object(
        'id', admin_record.id,
        'email', admin_record.email,
        'full_name', admin_record.full_name,
        'last_login_at', admin_record.last_login_at
      )
    );
  ELSE
    -- Return failure
    result := json_build_object(
      'success', false,
      'error', 'Invalid email or password'
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Insert the default admin user with hashed password
INSERT INTO public.admin_users (email, password_hash, full_name)
VALUES (
  'admin@gmail.com',
  public.hash_password('admin@123'),
  'System Administrator'
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();