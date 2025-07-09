'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

const NotificationIcon = ({ type }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  
  const Icon = icons[type];
  return <Icon className="w-5 h-5" />;
};

const getNotificationStyles = (type) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600'
    }
  };
  
  return styles[type] || styles.info;
};

export default function Notification({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) {
  const styles = getNotificationStyles(type);
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${styles.bg} ${styles.border} border rounded-xl p-4 shadow-lg max-w-md w-full backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <div className={`${styles.icon} mt-0.5`}>
          <NotificationIcon type={type} />
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-medium ${styles.text} mb-1`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${styles.text} opacity-90`}>
            {message}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClose(id)}
          className={`${styles.text} opacity-60 hover:opacity-100 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`h-1 ${styles.icon.replace('text-', 'bg-')} mt-3 rounded-full opacity-30`}
        />
      )}
    </motion.div>
  );
}

export function NotificationContainer({ notifications, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}