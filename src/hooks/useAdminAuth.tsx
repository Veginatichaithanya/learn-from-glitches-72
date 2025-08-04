import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdminSession {
  id: string;
  email: string;
  full_name?: string;
  loginTime: string;
}

export const useAdminAuth = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing admin session
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem('admin_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          
          // Check if session is still valid (24 hours)
          const loginTime = new Date(session.loginTime);
          const now = new Date();
          const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setAdminSession(session);
          } else {
            // Session expired, remove it
            localStorage.removeItem('admin_session');
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('admin_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signOut = () => {
    localStorage.removeItem('admin_session');
    setAdminSession(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from admin panel.",
    });
    window.location.href = '/';
  };

  const signIn = (email: string, password: string) => {
    if (email === "admin@gmail.com" && password === "admin@123") {
      const loginTime = new Date().toISOString();
      const newSession: AdminSession = {
        id: "admin-1",
        email: email,
        full_name: "Admin User",
        loginTime
      };
      
      localStorage.setItem('admin_session', JSON.stringify(newSession));
      setAdminSession(newSession);
      
      toast({
        title: "Welcome Back!",
        description: "Successfully logged in to admin panel.",
        variant: "success"
      });
      
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "error"
      });
      return false;
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