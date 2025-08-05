import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Code2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the secure admin login function
      const { data, error: rpcError } = await supabase.rpc('verify_admin_login', {
        email_input: email,
        password_input: password
      });

      if (rpcError) {
        throw rpcError;
      }

      const response = data as any;
      if (response?.success) {
        // Store admin session data securely
        const sessionData = {
          id: response.admin?.id,
          email: response.admin?.email,
          full_name: response.admin?.full_name,
          loginTime: new Date().toISOString(),
          rememberMe
        };

        if (rememberMe) {
          localStorage.setItem('admin_session', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('admin_session', JSON.stringify(sessionData));
        }

        toast({
          title: "Welcome Back!",
          description: `Successfully logged in as ${response.admin?.full_name || response.admin?.email}`,
        });

        // Navigate to admin dashboard
        navigate("/admin/dashboard");
      } else {
        setError(response?.error || "Invalid credentials");
        toast({
          title: "Login Failed",
          description: response?.error || "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred during login. Please try again.");
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-full max-w-md space-y-8">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Code2 className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
              Learn with Errors
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Manage your learning platform
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-semibold">Admin Login</CardTitle>
            <CardDescription className="text-base">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field with Floating Label */}
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pt-4 peer placeholder-transparent transition-all duration-200 focus:ring-2 focus:ring-primary/30 border-2"
                  placeholder="admin@example.com"
                />
                <Label
                  htmlFor="email"
                  className="absolute left-3 top-3 text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-card peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-card peer-[:not(:placeholder-shown)]:px-2"
                >
                  Email Address
                </Label>
              </div>

              {/* Password Field with Floating Label */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pt-4 pr-12 peer placeholder-transparent transition-all duration-200 focus:ring-2 focus:ring-primary/30 border-2"
                  placeholder="Enter your password"
                />
                <Label
                  htmlFor="password"
                  className="absolute left-3 top-3 text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-card peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-card peer-[:not(:placeholder-shown)]:px-2"
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-fade-in">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-base font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Learn with Errors. Secure Admin Access Only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
