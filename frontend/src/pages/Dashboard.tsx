import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CloudSun, 
  Monitor, 
  ShoppingBag, 
  Lightbulb,
  PlusCircle,
  Camera,
  Upload,
  Shirt,
  BarChart3
} from 'lucide-react';
import { useFitGenie } from '../context/FitGenieContext';

const Dashboard: React.FC = () => {
  const { state, actions } = useFitGenie();
  const [currentDate, setCurrentDate] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    // Set current date
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Load weather data
    loadWeather();
    
    // Load clothing items if not loaded
    if (state.clothingItems.length === 0) {
      actions.loadClothingItems();
    }
  }, []);

  const loadWeather = async () => {
    try {
      const data = await actions.loadWeatherData();
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
    }
  };

  const stats = [
    { value: state.clothingItems.length || 127, label: 'Total Items' },
    { value: '89%', label: 'Wardrobe Efficiency', color: 'text-green-600' },
    { value: 23, label: 'Saved Outfits', color: 'text-blue-600' },
    { value: 85, label: 'Eco Score', color: 'text-purple-600' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Greeting Header */}
            <motion.div className="glass-card p-6" variants={itemVariants}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Good Morning, User! 👋
                  </h1>
                  <p className="text-gray-600">{currentDate}</p>
                </div>
                <motion.div 
                  className="glass-card p-4 mt-4 sm:mt-0 min-w-48"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-3">
                    <CloudSun className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="font-semibold">
                        {weatherData?.temperature || 25}°C
                      </div>
                      <div className="text-sm text-gray-600">
                        {weatherData?.condition || 'Sunny'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Outfit Suggestion */}
            <motion.div className="glass-card p-6" variants={itemVariants}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-accent" />
                Today's AI Recommendation
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div 
                  className="outfit-carousel bg-gradient-to-br from-white/50 to-white/30 rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center">
                    <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center">
                      <Shirt className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="font-medium">Smart Casual Look</p>
                    <p className="text-sm text-gray-600">Perfect for today's weather</p>
                  </div>
                </motion.div>
                <div className="flex flex-col justify-center space-y-4">
                  <Link to="/stylist" className="btn-primary text-center">
                    Try This Outfit
                  </Link>
                  <Link to="/stylist" className="btn-secondary text-center">
                    See Alternatives
                  </Link>
                  <button className="btn-outline">Plan for Event</button>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6"
              variants={itemVariants}
            >
              <Link to="/mirror">
                <motion.div 
                  className="glass-card p-6 cursor-pointer block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Monitor className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">Smart Mirror</h3>
                  <p className="text-sm text-gray-600">Connect to your wardrobe</p>
                </motion.div>
              </Link>
              <motion.div 
                className="glass-card p-6 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ShoppingBag className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold mb-2">Sync Orders</h3>
                <p className="text-sm text-gray-600">Import online purchases</p>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={itemVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card p-6 text-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  custom={index}
                >
                  <div className={`text-3xl font-bold mb-2 ${stat.color || 'text-gray-800'}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Daily Tips */}
            <motion.div className="glass-card p-6" variants={itemVariants}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-highlight" />
                Daily Style Tip
              </h2>
              <p className="text-gray-700">
                You've worn 80% of your wardrobe this month! Try mixing some pastel colors 
                today for a fresh spring look.
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            variants={itemVariants}
          >
            {/* Add Item Box */}
            <motion.div 
              className="glass-card p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="font-semibold mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 text-accent" />
                Add New Item
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Scan or upload new clothing to your wardrobe
              </p>
              <motion.button 
                className="btn-primary w-full mb-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </motion.button>
              <motion.button 
                className="btn-secondary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </motion.button>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              className="glass-card p-6"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link 
                  to="/closet" 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <Shirt className="w-5 h-5 text-accent" />
                  <span className="text-sm">My Closet</span>
                </Link>
                <Link 
                  to="/stylist" 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm">AI Stylist</span>
                </Link>
                <Link 
                  to="/analytics" 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-accent" />
                  <span className="text-sm">Analytics</span>
                </Link>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="glass-card p-6"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Added Blue Jacket</span>
                  <span className="text-xs text-gray-400 ml-auto">2h ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Wore Red Dress</span>
                  <span className="text-xs text-gray-400 ml-auto">1d ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Created Smart Look</span>
                  <span className="text-xs text-gray-400 ml-auto">2d ago</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;