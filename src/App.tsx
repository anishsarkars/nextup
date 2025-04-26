
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./hooks/use-theme";
import { ProtectedRoute } from "./components/auth/protected-route";
import Layout from "./components/layout/layout";
import AuthLayout from "./components/layout/auth-layout";
import Index from "./pages/Index";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import ProfileSetup from "./pages/auth/profile-setup";
import AuthCallback from "./pages/auth/callback";
import Discover from "./pages/discover";
import Collaborate from "./pages/collaborate";
import SkillSwap from "./pages/skillswap";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/NotFound";
import { isSupabaseConfigured } from "./lib/supabase";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [showConfigWarning, setShowConfigWarning] = useState(!isSupabaseConfigured());

  useEffect(() => {
    // Hide the warning after 10 seconds
    if (showConfigWarning) {
      const timer = setTimeout(() => {
        setShowConfigWarning(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfigWarning]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showConfigWarning && (
            <div className="fixed top-4 right-4 z-50 w-96 max-w-[90vw]">
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Supabase Configuration Missing</AlertTitle>
                <AlertDescription>
                  Your app is running with placeholder Supabase credentials. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for full functionality.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/collaborate" element={<Collaborate />} />
                  <Route path="/skillswap" element={<SkillSwap />} />
                </Route>
                
                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/signup" element={<SignUp />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Route>
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile-setup" element={<ProfileSetup />} />
                  </Route>
                </Route>
                
                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
