
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b">
        <div className="container mx-auto flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/f62aa61b-0a36-4e79-b9bf-9c92c6ac1af1.png" 
              alt="NextUP Logo" 
              className="h-8"
            />
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} NextUP. All rights reserved.
      </footer>
    </div>
  );
}
