
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminSession {
  id: string;
  email: string;
  full_name?: string;
  loginTime: string;
  rememberMe?: boolean;
}

export const useAdminAuth = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = () => {
      try {
        // Check both localStorage and sessionStorage
        let sessionData = localStorage.getItem('admin_session') || sessionStorage.getItem('admin_session');
        
        if (sessionData) {
          const session = JSON.parse(sessionData);
          
          // Check if session is still valid (24 hours for remember me, 8 hours for regular)
          const loginTime = new Date(session.loginTime);
          const now = new Date();
          const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          const maxHours = session.rememberMe ? 24 : 8;
          
          if (hoursDiff < maxHours) {
            setAdminSession(session);
          } else {
            // Session expired, remove it
            localStorage.removeItem('admin_session');
            sessionStorage.removeItem('admin_session');
            toast({
              title: "Session Expired",
              description: "Please log in again to continue.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [toast]);

  const signOut = () => {
    localStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_session');
    setAdminSession(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from admin panel.",
    });
    window.location.href = '/admin/login';
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        email_input: email,
        password_input: password
      });

      if (error) throw error;

      const response = data as any;
      if (response?.success) {
        const sessionData: AdminSession = {
          id: response.admin?.id,
          email: response.admin?.email,
          full_name: response.admin?.full_name,
          loginTime: new Date().toISOString(),
          rememberMe
        };

        // Store in localStorage if remember me, otherwise sessionStorage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('admin_session', JSON.stringify(sessionData));
        setAdminSession(sessionData);

        toast({
          title: "Welcome Back!",
          description: `Successfully logged in as ${response.admin?.full_name || response.admin?.email}`,
        });

        return { success: true };
      } else {
        toast({
          title: "Login Failed",
          description: response?.error || "Invalid credentials",
          variant: "destructive"
        });
        return { success: false, error: response?.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
      return { success: false, error: "Login failed" };
    }
  };

  const isAuthenticated = !!adminSession;

  return {
    adminSession,
    isAuthenticated,
    isLoading,
    signIn,
    signOut
  };
};
