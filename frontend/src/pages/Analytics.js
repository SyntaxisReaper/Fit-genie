import React, { useState } from 'react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const timeRanges = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  const usageStats = {
    week: { outfits_created: 8, items_added: 3, mirror_sessions: 12, stylist_requests: 5 },
    month: { outfits_created: 35, items_added: 12, mirror_sessions: 48, stylist_requests: 23 },
    quarter: { outfits_created: 112, items_added: 34, mirror_sessions: 156, stylist_requests: 67 },
    year: { outfits_created: 445, items_added: 128, mirror_sessions: 612, stylist_requests: 289 }
  };

  const currentStats = usageStats[timeRange];

  const mostWornItems = [
    { name: 'Blue Jeans', wears: 23, image: 'https://via.placeholder.com/60x80/2563eb/ffffff?text=Jeans', category: 'Bottoms' },
    { name: 'White T-shirt', wears: 21, image: 'https://via.placeholder.com/60x80/ffffff/000000?text=T-shirt', category: 'Tops' },
    { name: 'Black Sneakers', wears: 19, image: 'https://via.placeholder.com/60x80/000000/ffffff?text=Sneakers', category: 'Shoes' },
    { name: 'Navy Blazer', wears: 15, image: 'https://via.placeholder.com/60x80/1e40af/ffffff?text=Blazer', category: 'Outerwear' },
    { name: 'Black Dress', wears: 12, image: 'https://via.placeholder.com/60x80/000000/ffffff?text=Dress', category: 'Dresses' }
  ];

  const colorAnalysis = [
    { color: 'Blue', percentage: 28, count: 13 },
    { color: 'Black', percentage: 23, count: 11 },
    { color: 'White', percentage: 19, count: 9 },
    { color: 'Gray', percentage: 15, count: 7 },
    { color: 'Red', percentage: 8, count: 4 },
    { color: 'Other', percentage: 7, count: 3 }
  ];


  const sustainabilityMetrics = {
    cost_per_wear: 12.50,
    items_not_worn: 8,
    carbon_footprint: 'Low',
    sustainability_score: 85,
    money_saved: 340
  };

  const categoryBreakdown = [
    { category: 'Tops', count: 18, percentage: 38 },
    { category: 'Bottoms', count: 12, percentage: 26 },
    { category: 'Shoes', count: 8, percentage: 17 },
    { category: 'Outerwear', count: 5, percentage: 11 },
    { category: 'Accessories', count: 4, percentage: 8 }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Analytics 📈</h1>
            <p className="text-gray-200 mt-2 text-lg">Insights into your wardrobe and style habits</p>
          </div>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  timeRange === range.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/20 backdrop-blur-md text-gray-200 hover:bg-white/30 hover:text-white border border-white/30'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-lg mr-4 shadow-lg">
                <span className="text-2xl text-white">✨</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{currentStats.outfits_created}</p>
                <p className="text-gray-200 text-sm">Outfits Created</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-lg mr-4 shadow-lg">
                <span className="text-2xl text-white">👕</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{currentStats.items_added}</p>
                <p className="text-gray-200 text-sm">Items Added</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-3 rounded-lg mr-4 shadow-lg">
                <span className="text-2xl text-white">🪞</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{currentStats.mirror_sessions}</p>
                <p className="text-gray-200 text-sm">Mirror Sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-lg mr-4 shadow-lg">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{currentStats.stylist_requests}</p>
                <p className="text-gray-200 text-sm">AI Stylist Uses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Usage Trends Pie Chart */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Usage Distribution</h2>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Outfits Created - 65% */}
                  <circle
                    cx="50" cy="50" r="30"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="12"
                    strokeDasharray="65 35"
                    strokeDashoffset="0"
                    className="opacity-90"
                  />
                  {/* Items Added - 20% */}
                  <circle
                    cx="50" cy="50" r="30"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray="20 80"
                    strokeDashoffset="-65"
                    className="opacity-90"
                  />
                  {/* Mirror Sessions - 15% */}
                  <circle
                    cx="50" cy="50" r="30"
                    fill="transparent"
                    stroke="#8B5CF6"
                    strokeWidth="12"
                    strokeDasharray="15 85"
                    strokeDashoffset="-85"
                    className="opacity-90"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{currentStats.outfits_created + currentStats.items_added + currentStats.mirror_sessions}</div>
                    <div className="text-xs text-gray-200">Total Activities</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-200">Outfits ({currentStats.outfits_created})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-200">Items ({currentStats.items_added})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-200">Mirror ({currentStats.mirror_sessions})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-200">AI Stylist ({currentStats.stylist_requests})</span>
              </div>
            </div>
          </div>

          {/* Color Distribution Pie Chart */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Color Distribution</h2>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="30" fill="transparent" stroke="#3B82F6" strokeWidth="8" strokeDasharray="28 72" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="30" fill="transparent" stroke="#1F2937" strokeWidth="8" strokeDasharray="23 77" strokeDashoffset="-28" />
                  <circle cx="50" cy="50" r="30" fill="transparent" stroke="#F3F4F6" strokeWidth="8" strokeDasharray="19 81" strokeDashoffset="-51" />
                  <circle cx="50" cy="50" r="30" fill="transparent" stroke="#6B7280" strokeWidth="8" strokeDasharray="15 85" strokeDashoffset="-70" />
                  <circle cx="50" cy="50" r="30" fill="transparent" stroke="#EF4444" strokeWidth="8" strokeDasharray="8 92" strokeDashoffset="-85" />
                  <circle cx="50" cy="50" r="30" fill="transparent" stroke="#8B5CF6" strokeWidth="8" strokeDasharray="7 93" strokeDashoffset="-93" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{colorAnalysis.reduce((sum, color) => sum + color.count, 0)}</div>
                    <div className="text-xs text-gray-200">Total Items</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {colorAnalysis.map((color, index) => {
                const colors = ['#3B82F6', '#1F2937', '#F3F4F6', '#6B7280', '#EF4444', '#8B5CF6'];
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index] }}></div>
                    <span className="text-xs text-gray-200">{color.color} ({color.percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Most Worn Items */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Most Worn Items</h2>
            <div className="space-y-4">
              {mostWornItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-white/20 to-white/10 rounded p-1 border border-white/20">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-gray-200">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-cyan-400">{item.wears}</div>
                    <div className="text-xs text-gray-200">wears</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Wardrobe Breakdown</h2>
            <div className="flex items-center justify-center h-40 mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="25" fill="transparent" stroke="#3B82F6" strokeWidth="10" strokeDasharray="38 62" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="25" fill="transparent" stroke="#10B981" strokeWidth="10" strokeDasharray="26 74" strokeDashoffset="-38" />
                  <circle cx="50" cy="50" r="25" fill="transparent" stroke="#F59E0B" strokeWidth="10" strokeDasharray="17 83" strokeDashoffset="-64" />
                  <circle cx="50" cy="50" r="25" fill="transparent" stroke="#EF4444" strokeWidth="10" strokeDasharray="11 89" strokeDashoffset="-81" />
                  <circle cx="50" cy="50" r="25" fill="transparent" stroke="#8B5CF6" strokeWidth="10" strokeDasharray="8 92" strokeDashoffset="-92" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              {categoryBreakdown.map((category, index) => {
                const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index] }}></div>
                      <div>
                        <div className="font-medium text-white text-sm">{category.category}</div>
                        <div className="text-xs text-gray-200">{category.count} items</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-cyan-400">{category.percentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Sustainability Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">${sustainabilityMetrics.cost_per_wear}</div>
              <div className="text-sm text-gray-200">Cost per wear</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{sustainabilityMetrics.items_not_worn}</div>
              <div className="text-sm text-gray-200">Items not worn</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{sustainabilityMetrics.carbon_footprint}</div>
              <div className="text-sm text-gray-200">Carbon footprint</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{sustainabilityMetrics.sustainability_score}%</div>
              <div className="text-sm text-gray-200">Sustainability score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">${sustainabilityMetrics.money_saved}</div>
              <div className="text-sm text-gray-200">Money saved</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
            <h3 className="font-semibold text-white mb-2">💡 Sustainability Tips</h3>
            <ul className="text-sm text-gray-200 space-y-1">
              <li>• You have 8 items that haven't been worn recently - consider styling them!</li>
              <li>• Your cost per wear is excellent - you're maximizing your wardrobe value</li>
              <li>• Try mixing different categories to create more unique outfits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;