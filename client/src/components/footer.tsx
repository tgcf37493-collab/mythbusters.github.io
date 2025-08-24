import { Link } from "wouter";
import { Search } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* AdSense Footer Ad */}
        <div className="mb-8">
          <div className="bg-slate-800 rounded-lg p-6 text-center border-2 border-dashed border-slate-600">
            <div className="text-2xl text-slate-400 mb-2">📢</div>
            <p className="text-slate-400">AdSense Footer Banner (728x90)</p>
            <p className="text-xs text-slate-500">Footer Advertisement Placement</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">YBYMythBust</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Dedicated to separating fact from fiction through evidence-based analysis and critical thinking.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" data-testid="link-social-twitter">
                🐦
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" data-testid="link-social-facebook">
                📘
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" data-testid="link-social-instagram">
                📷
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" data-testid="link-social-youtube">
                📺
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <div className="space-y-2">
              <Link href="/category/health-myths" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-health">
                Health Myths
              </Link>
              <Link href="/category/science-myths" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-science">
                Science Myths
              </Link>
              <Link href="/category/history-myths" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-history">
                History Myths
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-about">
                About Us
              </Link>
              <Link href="/contact" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-contact">
                Contact
              </Link>
              <a href="/privacy" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-privacy">
                Privacy Policy
              </a>
              <a href="/terms" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-terms">
                Terms of Service
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-sources">
                Research Sources
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-guide">
                Fact-Checking Guide
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-submit">
                Submit a Myth
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors" data-testid="link-footer-rss">
                RSS Feed
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2024 YBYMythBust. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-slate-400">Built with React & TailwindCSS</span>
            <Link href="/admin" className="text-slate-500 hover:text-primary transition-colors text-xs" data-testid="link-footer-admin">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
