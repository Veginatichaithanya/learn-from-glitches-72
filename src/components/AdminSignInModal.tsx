import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface AdminSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const AdminSignInModal = ({
  isOpen,
  onClose
}: AdminSignInModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const {
    toast
  } = useToast();

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
      // Call the verify_admin_login function
      const {
        data,
        error: rpcError
      } = await supabase.rpc('verify_admin_login', {
        email_input: email,
        password_input: password
      });
      if (rpcError) {
        throw rpcError;
      }

      // Type guard for the response data
      const response = data as any;
      if (response?.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.admin?.full_name || response.admin?.email}!`
        });

        // Store admin session data
        localStorage.setItem('admin_session', JSON.stringify({
          id: response.admin?.id,
          email: response.admin?.email,
          full_name: response.admin?.full_name,
          loginTime: new Date().toISOString()
        }));

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
    setError("");
    setEmailError("");
    setPasswordError("");
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-xl">Sign In</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" className={emailError ? "border-destructive" : ""} disabled={isLoading} />
            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={handlePasswordChange} placeholder="Enter your password" className={passwordError ? "border-destructive" : ""} disabled={isLoading} />
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || !!emailError || !!passwordError}>
              {isLoading ? <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </> : "Sign In"}
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t">
          <p>
        </p>
        </div>
      </DialogContent>
    </Dialog>;
};
export default AdminSignInModal;