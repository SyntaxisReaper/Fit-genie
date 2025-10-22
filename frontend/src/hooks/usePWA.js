import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for network status changes
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Listen for app installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            }
          });
        });

        console.log('Service worker registered successfully');
        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        return null;
      }
    }
    return null;
  };

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const scheduleBackgroundSync = (tag) => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register(tag);
      });
    }
  };

  return {
    isInstallable,
    isOffline,
    updateAvailable,
    installApp,
    updateApp,
    requestNotificationPermission,
    scheduleBackgroundSync
  };
};

export const useOfflineStorage = () => {
  const saveOfflineData = (key, data) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return true;
    } catch (error) {
      console.error('Error saving offline data:', error);
      return false;
    }
  };

  const getOfflineData = (key) => {
    try {
      const item = localStorage.getItem(`offline_${key}`);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  };

  const clearOfflineData = (key) => {
    try {
      localStorage.removeItem(`offline_${key}`);
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  };

  return {
    saveOfflineData,
    getOfflineData,
    clearOfflineData
  };
};