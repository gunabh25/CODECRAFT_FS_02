'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react'

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  type = "warning", // warning, danger, success, info
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false
}) {
  const getModalStyles = (type) => {
    const styles = {
      warning: {
        icon: AlertTriangle,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
        confirmText: 'text-white'
      },
      danger: {
        icon: Trash2,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        confirmBg: 'bg-red-600 hover:bg-red-700',
        confirmText: 'text-white'
      },
      success: {
        icon: CheckCircle,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        confirmBg: 'bg-green-600 hover:bg-green-700',
        confirmText: 'text-white'
      },
      info: {
        icon: AlertTriangle,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        confirmBg: 'bg-blue-600 hover:bg-blue-700',
        confirmText: 'text-white'
      }
    };
    
    return styles[type] || styles.warning;
  };

  const styles = getModalStyles(type);
  const IconComponent = styles.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className={`${styles.iconBg} p-3 rounded-xl`}>
                <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {title}
                </h3>
                <p className="text-slate-600 mb-6">
                  {message}
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelText}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 rounded-lg ${styles.confirmBg} ${styles.confirmText} transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {loading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                    {confirmText}
                  </motion.button>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}