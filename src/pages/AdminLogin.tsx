
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SignInCard2 } from "@/components/ui/sign-in-card-2";

const AdminLogin = () => {
  const { isAuthenticated, isLoading, signIn } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    if (!email || !password) {
      return;
    }

    const result = await signIn(email, password, false);
    if (result.success) {
      navigate('/admin/dashboard');
    }
  };

  if (isLoading) {
    return (
      <SignInCard2 
        isLoading={true}
        title="Admin Login"
        subtitle="Loading..."
      />
    );
  }

  return (
    <SignInCard2 
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title="Admin Login"
      subtitle="Manage your learning platform"
    />
  );
};

export default AdminLogin;
