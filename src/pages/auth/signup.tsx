
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// Schema for form validation
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms of service and privacy policy",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password);
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error("Signup failed:", error);
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
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Enter your information to get started</p>
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
            <Label htmlFor="password">Password</Label>
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
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={form.watch("agreeTerms")}
              onCheckedChange={(checked) => form.setValue("agreeTerms", !!checked)}
              disabled={isLoading}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-primary underline">
                terms of service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary underline">
                privacy policy
              </Link>
            </label>
          </div>
          {form.formState.errors.agreeTerms && (
            <p className="text-sm text-destructive">{form.formState.errors.agreeTerms.message}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full transition-soft" 
            disabled={isLoading || !form.watch("agreeTerms")}
          >
            {isLoading ? "Creating account..." : "Create account"}
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
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline transition-soft">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
