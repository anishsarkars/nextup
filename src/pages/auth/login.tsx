
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// Schema for form validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithEmail } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    try {
      await signIn(provider);
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to sign in</p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...form.register("email")}
              placeholder="hello@example.com"
              type="email"
              className="transition-soft"
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
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
              {...form.register("password")}
              placeholder="••••••••"
              type="password"
              className="transition-soft"
              disabled={isLoading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
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
          <Button 
            variant="outline" 
            className="transition-soft" 
            disabled={isLoading}
            onClick={() => handleOAuthLogin('google')}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.048 12v4.032H18.4c-.256 2.144-2.384 4.16-4.352 4.16-2.688 0-5.952-2.24-5.952-6.176 0-4.416 4.256-6.56 5.92-6.56 1.76 0 2.752.864 3.488 1.552l3.168-3.008C19.104 4.8 16.64 3.04 14.048 3.04 9.12 3.04 4 7.52 4 12s5.088 8.96 10.016 8.96c5.856 0 9.984-4.32 9.984-9.28 0-.928-.16-1.472-.288-2.08h-11.664V12z" />
            </svg>
            Google
          </Button>
          <Button 
            variant="outline" 
            className="transition-soft" 
            disabled={isLoading}
            onClick={() => handleOAuthLogin('github')}
          >
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
      </motion.div>
    </div>
  );
}
