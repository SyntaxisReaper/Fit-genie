import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shirt, Heart, Sun } from 'lucide-react';

const Stylist: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">AI Stylist</h1>
          <p className="text-gray-600">Get personalized outfit recommendations powered by AI</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Preferences */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Style Preferences</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                  <select className="glass-input w-full">
                    <option>Work/Professional</option>
                    <option>Casual/Everyday</option>
                    <option>Date Night</option>
                    <option>Party/Event</option>
                    <option>Workout</option>
                    <option>Travel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style Vibe</label>
                  <select className="glass-input w-full">
                    <option>Smart Casual</option>
                    <option>Minimalist</option>
                    <option>Trendy/Fashion Forward</option>
                    <option>Classic/Timeless</option>
                    <option>Boho/Eclectic</option>
                    <option>Edgy/Alternative</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary">Generate New Recommendations</button>
            </div>

            {/* Today's Recommendations */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Today's AI Recommendations</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Outfit 1 */}
                <motion.div 
                  className="outfit-card glass-card p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Shirt className="w-12 h-12 text-blue-600 mb-2 mx-auto" />
                      <p className="text-sm text-gray-600">Smart Casual</p>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Professional Look</h3>
                  <div className="text-xs text-gray-600 mb-3">
                    <p>• Navy Blazer</p>
                    <p>• White Shirt</p>
                    <p>• Dark Jeans</p>
                    <p>• Brown Loafers</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="coordination-score text-xs">94/100</div>
                    <button className="text-accent hover:text-purple-600 text-xs">Try This</button>
                  </div>
                </motion.div>

                {/* Outfit 2 */}
                <motion.div 
                  className="outfit-card glass-card p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-red-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Heart className="w-12 h-12 text-red-600 mb-2 mx-auto" />
                      <p className="text-sm text-gray-600">Date Night</p>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Evening Elegance</h3>
                  <div className="text-xs text-gray-600 mb-3">
                    <p>• Red Dress</p>
                    <p>• Black Heels</p>
                    <p>• Gold Accessories</p>
                    <p>• Light Jacket</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="coordination-score text-xs">92/100</div>
                    <button className="text-accent hover:text-purple-600 text-xs">Try This</button>
                  </div>
                </motion.div>

                {/* Outfit 3 */}
                <motion.div 
                  className="outfit-card glass-card p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-teal-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Sun className="w-12 h-12 text-green-600 mb-2 mx-auto" />
                      <p className="text-sm text-gray-600">Weekend</p>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Casual Comfort</h3>
                  <div className="text-xs text-gray-600 mb-3">
                    <p>• Cotton T-Shirt</p>
                    <p>• Denim Shorts</p>
                    <p>• White Sneakers</p>
                    <p>• Baseball Cap</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="coordination-score text-xs">88/100</div>
                    <button className="text-accent hover:text-purple-600 text-xs">Try This</button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Weather Context</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temperature:</span>
                  <span>25°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Condition:</span>
                  <span>Sunny</span>
                </div>
                <div className="flex justify-between">
                  <span>UV Index:</span>
                  <span>High</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Light cottons and breathable fabrics recommended</p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Recent Favorites</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/50">
                  <div className="w-8 h-8 bg-blue-200 rounded"></div>
                  <span className="text-sm">Blue Denim Jacket</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/50">
                  <div className="w-8 h-8 bg-red-200 rounded"></div>
                  <span className="text-sm">Red Summer Dress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Stylist;