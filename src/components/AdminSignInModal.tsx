
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSignInModal = ({ isOpen, onClose }: AdminSignInModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();

  // Real-time validation
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 3) {
      setPasswordError("Password must be at least 3 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submit
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

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
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.admin?.full_name || response.admin?.email}!`,
        });

        // Store admin session data securely
        const sessionData = {
          id: response.admin?.id,
          email: response.admin?.email,
          full_name: response.admin?.full_name,
          loginTime: new Date().toISOString()
        };

        sessionStorage.setItem('admin_session', JSON.stringify(sessionData));

        // Close modal and redirect
        onClose();
        window.location.href = '/admin/dashboard';
      } else {
        setError(response?.error || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError("");
    setEmailError("");
    setPasswordError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-black border-gray-800">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-600 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl text-white">Admin Sign In</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={`h-12 bg-gray-800 border-0 text-white placeholder:text-gray-400 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-600 ${emailError ? "ring-1 ring-red-500" : ""}`}
              disabled={isLoading}
            />
            {emailError && <p className="text-sm text-red-400">{emailError}</p>}
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className={`h-12 bg-gray-800 border-0 text-white placeholder:text-gray-400 rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-gray-600 ${passwordError ? "ring-1 ring-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              disabled={isLoading || !!emailError || !!passwordError}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSignInModal;
