import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Search, User, Menu, X, Home, LayoutDashboard, BookOpen, Calendar, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const progress = await base44.entities.UserProgress.filter({ user_email: currentUser.email });
      if (progress.length > 0) {
        setUserProgress(progress[0]);
      }
    } catch (e) {
      // Not logged in
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl(`Resources?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard },
    { name: 'Resources', page: 'Resources', icon: BookOpen },
    { name: 'Calendar', page: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: #7c6aef;
          --primary-light: #a99ef7;
          --primary-dark: #5b4acf;
          --accent: #f8b84e;
        }
        .gradient-header {
          background: linear-gradient(135deg, #7c6aef 0%, #a99ef7 100%);
        }
        .text-gradient {
          background: linear-gradient(135deg, #7c6aef 0%, #a99ef7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Header */}
      <header className="gradient-header sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-[#7c6aef]">ε</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPageName === item.page
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:block relative">
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 lg:w-64 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </form>
              </div>

              {/* XP Display */}
              {userProgress && (
                <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                  <span className="text-amber-300 font-bold">{userProgress.xp || 0}</span>
                  <span className="text-white/80 text-sm">XP</span>
                </div>
              )}

              {/* Profile */}
              {user ? (
                <Link to={createPageUrl('Profile')}>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </Link>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-[#7c6aef] hover:bg-white/90"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20">
            <div className="px-4 py-3 space-y-2">
              <form onSubmit={handleSearch} className="mb-3">
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </form>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white ${
                    currentPageName === item.page ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="gradient-header mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-[#7c6aef]">ε</span>
              </div>
              <span className="text-white font-semibold">Epsilon Learning</span>
            </div>
            <p className="text-white/70 text-sm">
              © 2024 Epsilon. Empowering future business leaders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}