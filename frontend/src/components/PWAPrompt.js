import React from 'react';
import { usePWA } from '../hooks/usePWA';
import { useNotification } from '../contexts/NotificationContext';

const PWAPrompt = () => {
  const { isInstallable, isOffline, updateAvailable, installApp, updateApp } = usePWA();
  const { showSuccess, showError } = useNotification();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      showSuccess('Fit Genie installed successfully! You can now use it offline.');
    } else {
      showError('Installation cancelled or failed.');
    }
  };

  const handleUpdate = () => {
    updateApp();
    showSuccess('App updated successfully!');
  };

  return (
    <>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed top-20 left-4 right-4 z-40 bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">You're offline</div>
              <div className="text-xs opacity-75">Some features may be limited. Your data will sync when you're back online.</div>
            </div>
            <div className="text-xl">📶</div>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      {isInstallable && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-md text-white px-6 py-4 rounded-xl border border-white/20 shadow-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-2xl">📱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install Fit Genie</h3>
              <p className="text-xs opacity-90 mt-1">
                Get the full app experience! Install Fit Genie for offline access, push notifications, and faster loading.
              </p>
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={handleInstall}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30"
                >
                  ✨ Install
                </button>
                <button
                  onClick={() => {/* Close prompt logic */}}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Available */}
      {updateAvailable && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-md text-white px-6 py-4 rounded-xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-xl">🔄</div>
              <div>
                <h3 className="font-semibold text-sm">Update Available</h3>
                <p className="text-xs opacity-90">A new version of Fit Genie is ready!</p>
              </div>
            </div>
            <button
              onClick={handleUpdate}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAPrompt;