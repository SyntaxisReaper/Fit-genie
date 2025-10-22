import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Camera, Zap, CameraOff } from 'lucide-react';
import { useFitGenie } from '../context/FitGenieContext';

const Mirror: React.FC = () => {
  const { actions } = useFitGenie();

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Smart Mirror Integration</h1>
          <p className="text-gray-600">Connect with your smart wardrobe and virtual try-on system</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mirror Display Panel */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-accent" />
              Virtual Mirror
            </h2>
            
            {/* Camera Feed */}
            <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Smart Mirror Camera</p>
                  <button 
                    className="btn-primary"
                    onClick={() => actions.showNotification('Mirror activation coming soon!', 'info')}
                  >
                    Activate Mirror
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mirror Controls */}
            <div className="flex space-x-3">
              <button 
                className="btn-primary flex-1"
                onClick={() => actions.showNotification('Capture feature coming soon!', 'info')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture Outfit
              </button>
              <button 
                className="btn-secondary flex-1"
                onClick={() => actions.showNotification('Style analysis coming soon!', 'info')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Analyze Style
              </button>
            </div>
          </div>
          
          {/* Status Panel */}
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">System Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Mirror Connection</span>
                  </div>
                  <span className="status-online">Online</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>AI Analysis</span>
                  </div>
                  <span className="font-semibold text-blue-600">Active</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Wardrobe Sync</span>
                  </div>
                  <span className="font-semibold text-purple-600">Connected</span>
                </div>
              </div>
            </div>

            {/* Sensor Data */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Environmental Sensors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">22°C</div>
                  <div className="text-xs text-gray-600">Temperature</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">45%</div>
                  <div className="text-xs text-gray-600">Humidity</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">850lx</div>
                  <div className="text-xs text-gray-600">Light Level</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">52</div>
                  <div className="text-xs text-gray-600">Items Detected</div>
                </div>
              </div>
              
              <button 
                className="btn-secondary w-full mt-4"
                onClick={() => actions.showNotification('Sensors refreshed!', 'success')}
              >
                Refresh Sensors
              </button>
            </div>

            {/* Recent Captures */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Recent Mirror Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Smart Casual Look</div>
                    <div className="text-xs text-gray-600">Score: 87/100 • 2 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Evening Formal</div>
                    <div className="text-xs text-gray-600">Score: 94/100 • Yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Mirror;