
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useStudentAuth } from '@/hooks/useStudentAuth';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isAuthenticated, isLoading } = useStudentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gray-600 rounded-full inline-block mb-4">
            <GraduationCap className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white absolute top-4 left-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        {/* Logo and Title */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-white">
            HextaUI
          </h1>
        </div>
        
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 bg-gray-800 border-0 text-white placeholder:text-gray-400 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-gray-600"
                />
              </div>
              
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 bg-gray-800 border-0 text-white placeholder:text-gray-400 rounded-xl px-4 pr-12 text-base focus-visible:ring-1 focus-visible:ring-gray-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-base font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign in"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have credentials? Contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
