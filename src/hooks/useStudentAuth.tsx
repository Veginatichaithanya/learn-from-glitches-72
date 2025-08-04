import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentSession {
  id: string;
  email: string;
  full_name?: string;
  loginTime: string;
  sessionId: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Temporary storage for sessions (in production, this would be in database)
const activeSessions = new Map<string, string>(); // studentId -> sessionId

export const useStudentAuth = () => {
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Generate unique session ID for this browser/device
  const generateSessionId = () => {
    const browserInfo = navigator.userAgent;
    const timestamp = Date.now();
    const random = Math.random().toString(36);
    return btoa(`${browserInfo}-${timestamp}-${random}`).slice(0, 32);
  };

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const sessionData = localStorage.getItem('student_session');
      if (!sessionData) {
        setIsLoading(false);
        return;
      }

      const session = JSON.parse(sessionData);
      
      // Verify student still exists and is active
      const { data: student, error } = await supabase
        .from('students')
        .select('id, email, full_name, is_active')
        .eq('id', session.id)
        .eq('is_active', true)
        .single();

      if (error || !student) {
        localStorage.removeItem('student_session');
        setIsLoading(false);
        return;
      }

      // Check if session is still valid (8 hours)
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      // Check if session matches stored session for this student
      const storedSessionId = activeSessions.get(session.id);
      
      if (hoursDiff > 8 || storedSessionId !== session.sessionId) {
        localStorage.removeItem('student_session');
        activeSessions.delete(session.id);
        setIsLoading(false);
        return;
      }

      setStudentSession(session);
    } catch (error) {
      console.error('Error checking student session:', error);
      localStorage.removeItem('student_session');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll use a simple login (in production, use proper auth)
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, email, full_name')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single();

      if (studentError || !student) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "error"
        });
        return false;
      }

      // Simple password validation (in production, use hashed passwords)
      if (credentials.password.length < 4) {
        toast({
          title: "Login Failed", 
          description: "Invalid email or password",
          variant: "error"
        });
        return false;
      }

      // Check if already logged in elsewhere
      const existingSessionId = activeSessions.get(student.id);
      if (existingSessionId) {
        toast({
          title: "Account Already in Use",
          description: "This account is already logged in on another device. Please log out from the other device first.",
          variant: "error"
        });
        return false;
      }

      // Generate new session
      const sessionId = generateSessionId();
      const loginTime = new Date().toISOString();

      // Store session in memory (in production, this would be in database)
      activeSessions.set(student.id, sessionId);

      // Update last login time
      await supabase
        .from('students')
        .update({ last_login_at: loginTime })
        .eq('id', student.id);

      // Create session object
      const newSession: StudentSession = {
        id: student.id,
        email: student.email,
        full_name: student.full_name || undefined,
        sessionId,
        loginTime
      };

      // Store session locally
      localStorage.setItem('student_session', JSON.stringify(newSession));
      setStudentSession(newSession);

      toast({
        title: "Welcome!",
        description: `Successfully logged in as ${student.full_name || student.email}`,
        variant: "success"
      });

      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "error"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!studentSession) return;

    try {
      // Remove session from memory
      activeSessions.delete(studentSession.id);

      // Clear local session
      localStorage.removeItem('student_session');
      setStudentSession(null);

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "success"
      });
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local session even if other operations fail
      localStorage.removeItem('student_session');
      setStudentSession(null);
    }
  };

  return {
    studentSession,
    isAuthenticated: !!studentSession,
    isLoading,
    signIn,
    signOut,
    activeSessions // For admin to see active sessions
  };
};