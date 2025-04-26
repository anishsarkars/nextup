
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoonIcon, SunIcon, MenuIcon, X } from "lucide-react";
import NotificationDropdown from "@/components/notifications/notification-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Navigation items
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Discover", path: "/discover" },
    { label: "Collaborate", path: "/collaborate" },
    { label: "SkillSwap", path: "/skillswap" },
  ];
  
  // Auth navigation items
  const authNavItems = [
    { label: "Dashboard", path: "/dashboard" },
  ];
  
  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b py-3" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">NextUP</span>
          <span className="text-xs text-muted-foreground">Designed @ Anish</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}

          {user && authNavItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Right Side - Auth & Theme */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          
          {/* Notifications for logged in users */}
          {user && <NotificationDropdown />}
          
          {/* Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile-setup">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t"
          >
            <div className="container mx-auto py-4 px-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  {authNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/profile-setup"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-muted transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button variant="outline" asChild>
                    <Link to="/auth/login">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
