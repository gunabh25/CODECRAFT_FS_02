/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Users,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import EmployeeModal from '@/components/dashboard/EmployeeModal';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized or Failed to fetch employees');
      }

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid response format');

      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(
        (employee) => employee.department === selectedDepartment
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (employee) => employee.status === selectedStatus
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/employees/${employeeId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to delete');
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSaveEmployee = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      const url =
        modalMode === 'create'
          ? '/api/employees'
          : `/api/employees/${selectedEmployee.id}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save employee');
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const departments = [...new Set(employees.map((emp) => emp.department))];
  const statuses = ['active', 'inactive', 'terminated'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button
          onClick={handleAddEmployee}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="mr-2" size={18} /> Add Employee
        </button>
      </div>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Email</th>
              <th className="p-3 text-left font-medium">Position</th>
              <th className="p-3 text-left font-medium">Department</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td className="p-3">{emp.firstName} {emp.lastName}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.position}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3 capitalize">{emp.status}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEditEmployee(emp)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteEmployee(emp.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <EmployeeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEmployee}
            mode={modalMode}
            employee={selectedEmployee}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeesPage;
