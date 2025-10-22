import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/closet', label: 'My Closet' },
    { path: '/stylist', label: 'AI Stylist' },
    { path: '/mirror', label: 'Smart Mirror' },
    { path: '/analytics', label: 'Analytics' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className="glass-nav fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Fit Genie
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Camera Button */}
          <motion.button
            className="bg-accent hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera className="w-5 h-5" />
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0, 
          height: isMobileMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md border-t border-white/20">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-btn block w-full text-left px-3 py-2 rounded-md transition-colors ${
                isActive(item.path) ? 'bg-accent/20 text-accent' : 'text-gray-600 hover:text-accent'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;