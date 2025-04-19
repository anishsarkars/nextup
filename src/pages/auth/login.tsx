
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you'd make an API call here
      // For demo, simulate a login delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful login
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to sign in</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="hello@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="transition-soft"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-soft">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="transition-soft"
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full transition-soft" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="transition-soft" disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.048 12v4.032H18.4c-.256 2.144-2.384 4.16-4.352 4.16-2.688 0-5.952-2.24-5.952-6.176 0-4.416 4.256-6.56 5.92-6.56 1.76 0 2.752.864 3.488 1.552l3.168-3.008C19.104 4.8 16.64 3.04 14.048 3.04 9.12 3.04 4 7.52 4 12s5.088 8.96 10.016 8.96c5.856 0 9.984-4.32 9.984-9.28 0-.928-.16-1.472-.288-2.08h-11.664V12z" />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="transition-soft" disabled={isLoading}>
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-primary hover:underline transition-soft">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
