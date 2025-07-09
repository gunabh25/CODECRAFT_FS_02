'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Calendar, Filter, Search, Eye, Users, TrendingUp, DollarSign, Clock, ChevronRight, Plus } from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('generated');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchReports = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports([
        {
          id: 1,
          title: 'Monthly Employee Performance Report',
          type: 'Performance',
          createdAt: '2024-07-05',
          size: '2.5 MB',
          format: 'PDF',
          status: 'completed',
          description: 'Comprehensive performance analysis for June 2024',
          metrics: { employees: 247, departments: 6, avgRating: 4.2 }
        },
        {
          id: 2,
          title: 'Quarterly Hiring Report',
          type: 'Recruitment',
          createdAt: '2024-07-03',
          size: '1.8 MB',
          format: 'Excel',
          status: 'completed',
          description: 'Q2 2024 hiring statistics and trends',
          metrics: { newHires: 45, interviews: 180, successRate: 25 }
        },
        {
          id: 3,
          title: 'Department Salary Analysis',
          type: 'Compensation',
          createdAt: '2024-07-01',
          size: '3.2 MB',
          format: 'PDF',
          status: 'completed',
          description: 'Salary distribution and compensation analysis',
          metrics: { avgSalary: 75000, maxSalary: 150000, minSalary: 35000 }
        },
        {
          id: 4,
          title: 'Employee Attendance Report',
          type: 'Attendance',
          createdAt: '2024-06-28',
          size: '1.1 MB',
          format: 'CSV',
          status: 'processing',
          description: 'Monthly attendance patterns and insights',
          metrics: { attendanceRate: 94.5, lateArrivals: 23, leaves: 156 }
        }
      ]);
      setLoading(false);
    };

    fetchReports();
  }, []);

  const reportTemplates = [
    {
      id: 1,
      name: 'Employee Performance Report',
      description: 'Generate detailed performance analytics',
      icon: TrendingUp,
      color: 'indigo',
      fields: ['Performance Period', 'Departments', 'Metrics']
    },
    {
      id: 2,
      name: 'Payroll Report',
      description: 'Comprehensive payroll and compensation data',
      icon: DollarSign,
      color: 'green',
      fields: ['Pay Period', 'Employee Groups', 'Deductions']
    },
    {
      id: 3,
      name: 'Attendance Report',
      description: 'Track attendance patterns and trends',
      icon: Clock,
      color: 'blue',
      fields: ['Date Range', 'Departments', 'Absence Types']
    },
    {
      id: 4,
      name: 'Workforce Demographics',
      description: 'Employee demographics and diversity metrics',
      icon: Users,
      color: 'purple',
      fields: ['Demographics', 'Departments', 'Time Period']
    }
  ];

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabVariants = {
    inactive: {
      backgroundColor: 'transparent',
      color: '#64748b'
    },
    active: {
      backgroundColor: '#6366f1',
      color: '#ffffff'
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleGenerateReport = (template) => {
    setSelectedReport(template);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-slate-600 mt-2">Generate and manage your workforce reports</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('generate')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Generate Report
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={cardVariants} className="mb-8">
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg">
          {[
            { key: 'generated', label: 'Generated Reports' },
            { key: 'generate', label: 'Generate New' },
            { key: 'scheduled', label: 'Scheduled Reports' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              variants={tabVariants}
              animate={activeTab === tab.key ? 'active' : 'inactive'}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200"
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'generated' && (
          <motion.div
            key="generated"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search and Filter */}
            <motion.div variants={cardVariants} className="mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      Filter
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reports List */}
            <motion.div variants={cardVariants} className="space-y-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  variants={cardVariants}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 rounded-xl">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{report.title}</h3>
                        <p className="text-slate-600 mt-1">{report.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-slate-500">Created: {report.createdAt}</span>
                          <span className="text-sm text-slate-500">Size: {report.size}</span>
                          <span className="text-sm text-slate-500">Format: {report.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'generate' && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  variants={cardVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleGenerateReport(template)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${template.color}-100`}>
                      <template.icon className={`w-6 h-6 text-${template.color}-600`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{template.name}</h3>
                  <p className="text-slate-600 mb-4">{template.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Configuration Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.fields.map((field, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'scheduled' && (
          <motion.div
            key="scheduled"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Scheduled Reports</h3>
            <p className="text-slate-600 mb-6">Set up automated report generation for regular insights</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Schedule Report
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Report Generation */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Generate Report</h3>
              <p className="text-slate-600 mb-6">Configure your {selectedReport?.name}</p>
              
              <div className="space-y-4">
                {selectedReport?.fields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{field}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Generate Report
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}