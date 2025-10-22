import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'My Closet', path: '/closet', icon: '👗' },
    { name: 'AI Stylist', path: '/stylist', icon: '🤖' },
    { name: 'Smart Mirror', path: '/mirror', icon: '🪞' },
    { name: 'Analytics', path: '/analytics', icon: '📈' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/20 hover:backdrop-blur-xl ${
      isScrolled 
        ? 'bg-gradient-to-r from-purple-900/70 via-blue-900/70 to-indigo-900/70 backdrop-blur-lg shadow-2xl hover:from-purple-900/80 hover:via-blue-900/80 hover:to-indigo-900/80' 
        : 'bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md shadow-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✨</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Fit Genie</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg'
                    : 'text-gray-200 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white focus:outline-none hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md border-t border-white/20">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg'
                      : 'text-gray-200 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;