import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({ temp: '22°C', condition: 'Sunny' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickStats = [
    { label: 'Clothing Items', value: '47', color: 'bg-blue-50 text-blue-600', icon: '👕' },
    { label: 'Outfits Created', value: '12', color: 'bg-green-50 text-green-600', icon: '✨' },
    { label: 'This Week\'s Wear', value: '8', color: 'bg-purple-50 text-purple-600', icon: '📅' },
    { label: 'Sustainability Score', value: '85%', color: 'bg-yellow-50 text-yellow-600', icon: '🌱' }
  ];

  const todayOutfit = {
    image: 'https://via.placeholder.com/200x250/e2e8f0/64748b?text=Today\'s+Outfit',
    items: ['Blue Denim Jacket', 'White Cotton T-shirt', 'Black Slim Jeans', 'White Sneakers'],
    weather_match: 'Perfect for today\'s weather!'
  };

  const quickLinks = [
    { name: 'Add New Item', path: '/closet', icon: '➕', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Get Outfit Suggestion', path: '/stylist', icon: '🎨', color: 'bg-purple-600 hover:bg-purple-700' },
    { name: 'View Analytics', path: '/analytics', icon: '📊', color: 'bg-green-600 hover:bg-green-700' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {getGreeting()}, Sarah! 👋
          </h1>
          <p className="text-gray-200 mt-2 text-lg">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Weather Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Today's Weather</h3>
              <div className="flex items-center mt-2">
                <span className="text-3xl mr-3">☀️</span>
                <div>
                  <span className="text-2xl font-bold text-white">{weather.temp}</span>
                  <span className="text-gray-200 ml-2">{weather.condition}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Perfect weather for</p>
              <p className="text-cyan-300 font-medium">Light layers & breathable fabrics</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-4 shadow-lg`}>
                  <span className="text-xl text-white">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-200 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Today's Outfit Suggestion */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Today's Outfit Suggestion</h3>
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <img 
                  src={todayOutfit.image} 
                  alt="Today's outfit" 
                  className="w-48 h-60 object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-white mb-3">Outfit Details:</h4>
                <ul className="space-y-2 mb-4">
                  {todayOutfit.items.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-200">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm border border-green-300/30 rounded-lg p-3">
                  <p className="text-green-200 text-sm">
                    <span className="font-medium">✓ Weather Match:</span> {todayOutfit.weather_match}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Added new item', item: 'Navy Blue Blazer', time: '2 hours ago', icon: '➕' },
              { action: 'Created outfit', item: 'Business Casual Look', time: '1 day ago', icon: '✨' },
              { action: 'Used Smart Mirror', item: 'Tried 3 different combinations', time: '2 days ago', icon: '🪞' },
              { action: 'Updated preferences', item: 'Color palette preferences', time: '3 days ago', icon: '🎨' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 py-3 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
                <span className="text-xl">{activity.icon}</span>
                <div className="flex-grow">
                  <p className="text-white">
                    <span className="font-medium">{activity.action}:</span> {activity.item}
                  </p>
                  <p className="text-gray-300 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;