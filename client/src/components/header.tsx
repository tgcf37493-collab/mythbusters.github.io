import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">YBYMythBust</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-nav-home"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors ${isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-nav-about"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`transition-colors ${isActive('/contact') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-nav-contact"
            >
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-muted hover:bg-muted/80"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-muted hover:bg-muted/80"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-mobile-home"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`transition-colors ${isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-mobile-about"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`transition-colors ${isActive('/contact') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-mobile-contact"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
