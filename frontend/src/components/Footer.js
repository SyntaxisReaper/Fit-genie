import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Smart Mirror', path: '/mirror', icon: '🪞' },
    { name: 'My Closet', path: '/closet', icon: '👗' },
    { name: 'AI Stylist', path: '/stylist', icon: '🤖' },
    { name: 'Analytics', path: '/analytics', icon: '📊' }
  ];

  const helpLinks = [
    { name: 'Getting Started', path: '/help/getting-started', icon: '🚀' },
    { name: 'User Guide', path: '/help/user-guide', icon: '📖' },
    { name: 'FAQ', path: '/help/faq', icon: '❓' },
    { name: 'Privacy Policy', path: '/help/privacy', icon: '🛡️' },
    { name: 'Terms of Service', path: '/help/terms', icon: '📋' }
  ];

  const teamLinks = [
    { name: 'About Us', path: '/about', icon: '👥' },
    { name: 'Our Team', path: '/team', icon: '🧑‍💼' },
    { name: 'Careers', path: '/careers', icon: '💼' },
    { name: 'Blog', path: '/blog', icon: '📝' },
    { name: 'Press', path: '/press', icon: '📰' }
  ];

  const socialLinks = [
    { name: 'Twitter', url: 'https://twitter.com/stylinapp', icon: '🐦', color: 'hover:text-blue-400' },
    { name: 'Instagram', url: 'https://instagram.com/stylinapp', icon: '📷', color: 'hover:text-pink-400' },
    { name: 'Facebook', url: 'https://facebook.com/stylinapp', icon: '📘', color: 'hover:text-blue-600' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/stylinapp', icon: '💼', color: 'hover:text-blue-700' },
    { name: 'YouTube', url: 'https://youtube.com/stylinapp', icon: '📺', color: 'hover:text-red-500' },
    { name: 'TikTok', url: 'https://tiktok.com/@stylinapp', icon: '🎵', color: 'hover:text-black' }
  ];

  const handleSocialClick = (url, platform) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    // Analytics tracking (mock)
    console.log(`Social link clicked: ${platform}`);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>🧭</span>
              <span>Navigation</span>
            </h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>🆘</span>
              <span>Help & Support</span>
            </h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Link */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all hover:scale-105"
              >
                <span>📧</span>
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Company & Team Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>🏢</span>
              <span>Company</span>
            </h3>
            <ul className="space-y-2">
              {teamLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>🌐</span>
              <span>Connect With Us</span>
            </h3>
            
            {/* Social Media Links */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={() => handleSocialClick(social.url, social.name)}
                  className={`bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all hover:scale-110 ${social.color} group`}
                  title={`Follow us on ${social.name}`}
                >
                  <span className="text-xl group-hover:animate-bounce">{social.icon}</span>
                </button>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center space-x-1">
                <span>📮</span>
                <span>Stay Updated</span>
              </h4>
              <p className="text-sm text-gray-300 mb-3">Get style tips and updates!</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Logo & Copyright */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-lg">Stylin</span>
              </div>
              <span className="text-gray-400 text-sm">
                © {currentYear} Stylin. All rights reserved.
              </span>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <span>👥</span>
                <span>10K+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>👗</span>
                <span>1M+ Outfits</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🤖</span>
                <span>AI-Powered</span>
              </div>
            </div>

            {/* Version & Status */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All Systems Operational</span>
              </div>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>

        {/* Additional Links Row */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-500">
            <Link to="/help/accessibility" className="hover:text-white transition-colors">
              ♿ Accessibility
            </Link>
            <Link to="/help/security" className="hover:text-white transition-colors">
              🔒 Security
            </Link>
            <Link to="/help/api" className="hover:text-white transition-colors">
              🔌 API
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">
              🗺️ Sitemap
            </Link>
            <Link to="/help/cookies" className="hover:text-white transition-colors">
              🍪 Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;