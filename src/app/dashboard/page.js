/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Users, UserPlus, Search, Filter, TrendingUp, Calendar } from 'lucide-react';
import EmployeeCard from '@/components/dashboard/EmployeeCard';
import EmployeeModal from '@/components/dashboard/EmployeeModal';
import StatsCard from '@/components/dashboard/StatsCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newThisMonth: 0,
    departments: 0,
    activeEmployees: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedDepartment]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees', {
        credentials: 'include'
      });
      if (response.status === 401) {
        console.warn('Unauthorized');
        return;
      }
      const data = await response.json();
      setEmployees(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (employeeData) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newThisMonth = employeeData.filter(emp => {
      const hireDate = new Date(emp.hireDate);
      return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
    }).length;

    const departments = [...new Set(employeeData.map(emp => emp.department))].length;
    const activeEmployees = employeeData.filter(emp => emp.status === 'active').length;

    setStats({
      totalEmployees: employeeData.length,
      newThisMonth,
      departments,
      activeEmployees
    });
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setEmployees(employees.filter(emp => emp.id !== employeeId));
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      const method = selectedEmployee ? 'PUT' : 'POST';
      const url = selectedEmployee 
        ? `/api/employees/${selectedEmployee.id}` 
        : '/api/employees';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
        credentials: 'include'
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        if (selectedEmployee) {
          setEmployees(employees.map(emp => 
            emp.id === selectedEmployee.id ? updatedEmployee : emp
          ));
        } else {
          setEmployees([...employees, updatedEmployee]);
        }
        setIsModalOpen(false);
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const departments = [...new Set(employees.map(emp => emp.department))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user?.name || 'Admin'}
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your team efficiently with our advanced dashboard
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}><StatsCard title="Total Employees" value={stats.totalEmployees} icon={Users} color="blue" theme={theme} /></motion.div>
          <motion.div variants={itemVariants}><StatsCard title="New This Month" value={stats.newThisMonth} icon={TrendingUp} color="green" theme={theme} /></motion.div>
          <motion.div variants={itemVariants}><StatsCard title="Departments" value={stats.departments} icon={Filter} color="purple" theme={theme} /></motion.div>
          <motion.div variants={itemVariants}><StatsCard title="Active Employees" value={stats.activeEmployees} icon={Calendar} color="orange" theme={theme} /></motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-sm`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEmployee}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              Add Employee
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
              >
                <EmployeeCard
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                  theme={theme}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredEmployees.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No employees found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        theme={theme}
      />
    </div>
  );
}
