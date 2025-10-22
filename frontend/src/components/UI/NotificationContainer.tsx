import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useFitGenie } from '../../context/FitGenieContext';

const NotificationContainer: React.FC = () => {
  const { state, actions } = useFitGenie();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800 border-green-200 bg-green-50/90';
      case 'error':
        return 'text-red-800 border-red-200 bg-red-50/90';
      case 'warning':
        return 'text-yellow-800 border-yellow-200 bg-yellow-50/90';
      default:
        return 'text-blue-800 border-blue-200 bg-blue-50/90';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {state.notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
            className={`
              glass-card p-4 shadow-xl max-w-sm w-full backdrop-blur-md border
              ${getColorClasses(notification.type)}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => actions.removeNotification(notification.id)}
                className="flex-shrink-0 ml-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;