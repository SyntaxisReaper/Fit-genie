import React from 'react';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-poppins">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🧞‍♂️ Fit Genie - AI Smart Wardrobe
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-600">Your wardrobe overview and daily recommendations</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Closet</h2>
            <p className="text-gray-600">Browse and manage your clothing collection</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">AI Stylist</h2>
            <p className="text-gray-600">Get personalized outfit recommendations</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">Welcome to your smart wardrobe management system!</p>
        </div>
      </div>
    </div>
  );
};

export default App;
