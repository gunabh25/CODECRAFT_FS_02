'use client';

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Edit, Trash2, User, Building, Calendar } from 'lucide-react';

export default function EmployeeCard({ employee, onEdit, onDelete, theme }) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      onDelete(employee.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl p-6 shadow-lg backdrop-blur-sm border ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      } transition-all duration-300 hover:shadow-xl relative overflow-hidden group`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
          >
            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </motion.div>
          <div>
            <h3 className={`font-bold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {employee.name}
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {employee.position}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
          theme === 'dark' ? 'bg-opacity-20' : ''
        } ${getStatusColor(employee.status)}`}>
          {employee.status}
        </div>
      </div>

      {/* Employee Details */}
      <div className="space-y-3 mb-6 relative z-10">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Mail className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {employee.email}
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Phone className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {employee.phone}
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Building className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {employee.department}
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Calendar className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Hired: {new Date(employee.hireDate).toLocaleDateString()}
          </span>
        </motion.div>
      </div>

      {/* Salary */}
      <div className={`mb-6 p-3 rounded-lg ${
        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
      } relative z-10`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Salary
          </span>
          <span className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            ${employee.salary?.toLocaleString() || 'N/A'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(employee)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } shadow-lg hover:shadow-xl`}
        >
          <Edit className="w-4 h-4" />
          Edit
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          } shadow-lg hover:shadow-xl`}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </motion.button>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
           style={{
             background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
             animation: 'border-slide 3s linear infinite'
           }} />
      
      <style jsx>{`
        @keyframes border-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}