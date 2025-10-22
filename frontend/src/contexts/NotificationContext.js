import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration = 5000) => {
    return showNotification(message, 'success', duration);
  };

  const showError = (message, duration = 7000) => {
    return showNotification(message, 'error', duration);
  };

  const showWarning = (message, duration = 6000) => {
    return showNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration = 5000) => {
    return showNotification(message, 'info', duration);
  };

  const value = {
    notifications,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationStyle(notification.type)}
            px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md border border-white/20
            transform transition-all duration-300 ease-in-out
            hover:scale-105 cursor-pointer
            min-w-72 max-w-96
          `}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </span>
            <div className="flex-1">
              <p className="font-medium text-sm">{notification.message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              className="text-white hover:text-gray-200 transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};