import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Leaf, TrendingUp, Clock, Palette, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Wardrobe Analytics & Sustainability</h1>
          <p className="text-gray-600">Track your fashion choices and environmental impact</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">127</div>
            <div className="text-sm text-gray-600">Total Items</div>
            <div className="text-xs text-green-600 mt-1">+5 this month</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent">89%</div>
            <div className="text-sm text-gray-600">Items Worn</div>
            <div className="text-xs text-blue-600 mt-1">+3% vs last month</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-green-600">85</div>
            <div className="text-sm text-gray-600">Eco Score</div>
            <div className="text-xs text-green-600 mt-1">+7 points</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">€2.1K</div>
            <div className="text-sm text-gray-600">Cost per Wear</div>
            <div className="text-xs text-purple-600 mt-1">€4.20 average</div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Usage Breakdown</h2>
            <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive charts coming soon!</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
            <div className="h-64 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Activity trends coming soon!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Dashboard */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Sustainability Dashboard
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Carbon Footprint */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-800 mb-3">Carbon Footprint</h3>
                  <div className="text-3xl font-bold text-green-700 mb-2">-24%</div>
                  <p className="text-sm text-green-600">Reduced vs industry average</p>
                </div>

                {/* Water Usage */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-3">Water Conservation</h3>
                  <div className="text-3xl font-bold text-blue-700 mb-2">1,240L</div>
                  <p className="text-sm text-blue-600">Saved this month</p>
                </div>

                {/* Waste Reduction */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-800 mb-3">Waste Reduction</h3>
                  <div className="text-3xl font-bold text-purple-700 mb-2">3.2kg</div>
                  <p className="text-sm text-purple-600">Textile waste prevented</p>
                </div>

                {/* Cost Savings */}
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-semibold text-orange-800 mb-3">Cost Optimization</h3>
                  <div className="text-3xl font-bold text-orange-700 mb-2">€340</div>
                  <p className="text-sm text-orange-600">Saved this quarter</p>
                </div>
              </div>
            </div>

            {/* Sustainability Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full bg-green-200"></div>
                <div className="relative">
                  <div className="text-3xl font-bold text-green-600">85</div>
                  <div className="text-xs text-gray-600">Eco Score</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="badge">🌱 Eco Saver</div>
                <div className="badge">⭐ Style Star</div>
                <div className="badge">♻️ Reuse Champion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Most Worn
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Black Jeans</span>
                <span className="font-medium">25×</span>
              </div>
              <div className="flex justify-between">
                <span>White T-Shirt</span>
                <span className="font-medium">22×</span>
              </div>
              <div className="flex justify-between">
                <span>Blue Sneakers</span>
                <span className="font-medium">18×</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-600" />
              Least Worn
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Formal Suit</span>
                <span className="font-medium">2×</span>
              </div>
              <div className="flex justify-between">
                <span>Evening Dress</span>
                <span className="font-medium">1×</span>
              </div>
              <div className="flex justify-between">
                <span>Winter Coat</span>
                <span className="font-medium">0×</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Palette className="w-4 h-4 mr-2 text-purple-600" />
              Color Preferences
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                  <span>Black</span>
                </div>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span>Blue</span>
                </div>
                <span className="font-medium">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-white border rounded-full mr-2"></div>
                  <span>White</span>
                </div>
                <span className="font-medium">18%</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-green-600" />
              Seasonal Trends
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Summer Items</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span>Spring/Fall</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="flex justify-between">
                <span>Winter Items</span>
                <span className="font-medium">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;