
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { SignInCard2 } from '@/components/ui/sign-in-card-2';

const StudentLogin = () => {
  const { signIn, isAuthenticated, isLoading } = useStudentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    if (!email || !password) {
      return;
    }

    const success = await signIn({ email, password });
    if (success) {
      navigate('/student/dashboard');
    }
  };

  if (isLoading) {
    return (
      <SignInCard2 
        isLoading={true}
        title="Student Login"
        subtitle="Loading..."
      />
    );
  }

  return (
    <SignInCard2 
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title="Student Login"
      subtitle="Enter your credentials to access your learning dashboard"
    />
  );
};

export default StudentLogin;
