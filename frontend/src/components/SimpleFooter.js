import React from 'react';
import { Link } from 'react-router-dom';

const SimpleFooter = () => {
  console.log('SimpleFooter component rendering!');
  return (
    <footer className="bg-gray-900 text-white py-12 mt-8 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🪞</span>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Stylin
              </h2>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              AI-powered smart mirror for personalized fashion and style analysis.
            </p>
            <div className="flex space-x-3">
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                🐦 Twitter
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                📷 Instagram
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                📘 Facebook
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Navigation</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-purple-400 transition-colors">🏠 Dashboard</Link>
              <Link to="/mirror" className="block text-gray-300 hover:text-purple-400 transition-colors">🪞 Smart Mirror</Link>
              <Link to="/closet" className="block text-gray-300 hover:text-purple-400 transition-colors">👗 My Closet</Link>
              <Link to="/stylist" className="block text-gray-300 hover:text-purple-400 transition-colors">🤖 AI Stylist</Link>
              <Link to="/analytics" className="block text-gray-300 hover:text-purple-400 transition-colors">📈 Analytics</Link>
            </div>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Features</h3>
            <div className="space-y-2">
              <span className="block text-gray-300">✨ Virtual Try-On</span>
              <span className="block text-gray-300">🤏 Gesture Control</span>
              <span className="block text-gray-300">📱 Social Sharing</span>
              <span className="block text-gray-300">🧠 AI Analysis</span>
              <span className="block text-gray-300">📊 Style Analytics</span>
            </div>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-gray-300 hover:text-purple-400 transition-colors">💬 Contact Us</Link>
              <a href="mailto:hello@stylinapp.com" className="block text-gray-300 hover:text-purple-400 transition-colors">📧 Email Support</a>
              <button className="block text-gray-300 hover:text-purple-400 transition-colors">❓ FAQ</button>
              <button className="block text-gray-300 hover:text-purple-400 transition-colors">📚 Documentation</button>
            </div>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">Get the latest fashion AI insights and updates.</p>
            <div className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
              />
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Stylin Smart Mirror. All rights reserved. | Made with ❤️ for fashion enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;