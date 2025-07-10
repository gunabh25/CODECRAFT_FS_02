'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found in localStorage');

        const res = await fetch('/api/employees', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Unknown API error');
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid employee data format');
        }

        setEmployees(data);
      } catch (err) {
        console.error('Fetch failed:', err.message);
        setError(err.message);
      }
    };

    fetchEmployees();
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul>
          {employees.map(emp => (
            <li key={emp.id}>
              {emp.firstName} {emp.lastName} - {emp.position}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
