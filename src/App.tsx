
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
              <Route element={<AuthLayout children={undefined} />}>
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

export default App;
