
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useStudentAuth } from '@/hooks/useStudentAuth';

interface ProtectedStudentRouteProps {
  children: React.ReactNode;
}

const ProtectedStudentRoute = ({ children }: ProtectedStudentRouteProps) => {
  const { isAuthenticated, isLoading } = useStudentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/student/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gradient-primary rounded-full inline-block mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedStudentRoute;
