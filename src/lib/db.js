// In-memory database for demo purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.

let employees = [
  {
    id: 'emp-001',
    employeeId: 'EMP-2024-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0123',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 75000,
    hireDate: '2023-01-15',
    birthDate: '1990-05-20',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1-555-0124',
      relationship: 'Spouse'
    },
    status: 'active',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: 'emp-002',
    employeeId: 'EMP-2024-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0125',
    position: 'Product Manager',
    department: 'Product',
    salary: 85000,
    hireDate: '2023-03-10',
    birthDate: '1988-12-03',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '+1-555-0126',
      relationship: 'Brother'
    },
    status: 'active',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10'),
  },
  {
    id: 'emp-003',
    employeeId: 'EMP-2024-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@company.com',
    phone: '+1-555-0127',
    position: 'UX Designer',
    department: 'Design',
    salary: 70000,
    hireDate: '2023-02-20',
    birthDate: '1992-08-15',
    address: '789 Pine St, Chicago, IL 60601',
    emergencyContact: {
      name: 'Lisa Brown',
      phone: '+1-555-0128',
      relationship: 'Mother'
    },
    status: 'active',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20'),
  },
]

export const db = {
  employees: {
    findAll: () => employees,
    
    findById: (id) => employees.find(emp => emp.id === id),
    
    findByEmail: (email) => employees.find(emp => emp.email === email),
    
    create: (employeeData) => {
      const newEmployee = {
        id: `emp-${Date.now()}`,
        employeeId: employeeData.employeeId || `EMP-${Date.now()}`,
        ...employeeData,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      employees.push(newEmployee)
      return newEmployee
    },
    
    update: (id, updateData) => {
      const index = employees.findIndex(emp => emp.id === id)
      if (index === -1) return null
      
      employees[index] = {
        ...employees[index],
        ...updateData,
        updatedAt: new Date(),
      }
      return employees[index]
    },
    
    delete: (id) => {
      const index = employees.findIndex(emp => emp.id === id)
      if (index === -1) return null
      
      const deletedEmployee = employees[index]
      employees.splice(index, 1)
      return deletedEmployee
    },
    
    search: (query) => {
      if (!query) return employees
      
      const searchTerm = query.toLowerCase()
      return employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm) ||
        emp.employeeId.toLowerCase().includes(searchTerm)
      )
    },
    
    filter: (filters) => {
      let result = employees
      
      if (filters.department) {
        result = result.filter(emp => emp.department === filters.department)
      }
      
      if (filters.position) {
        result = result.filter(emp => emp.position === filters.position)
      }
      
      if (filters.status) {
        result = result.filter(emp => emp.status === filters.status)
      }
      
      if (filters.hireDate) {
        const filterDate = new Date(filters.hireDate)
        result = result.filter(emp => new Date(emp.hireDate) >= filterDate)
      }
      
      return result
    },
    
    sort: (sortBy, order = 'asc') => {
      return [...employees].sort((a, b) => {
        let aValue = a[sortBy]
        let bValue = b[sortBy]
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
        
        if (order === 'desc') {
          return bValue > aValue ? 1 : -1
        }
        return aValue > bValue ? 1 : -1
      })
    },
    
    paginate: (page = 1, limit = 10) => {
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      
      return {
        data: employees.slice(startIndex, endIndex),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(employees.length / limit),
          totalItems: employees.length,
          hasNext: endIndex < employees.length,
          hasPrev: startIndex > 0,
        }
      }
    },
    
    getDepartments: () => {
      return [...new Set(employees.map(emp => emp.department))]
    },
    
    getPositions: () => {
      return [...new Set(employees.map(emp => emp.position))]
    },
    
    getStats: () => {
      const totalEmployees = employees.length
      const activeEmployees = employees.filter(emp => emp.status === 'active').length
      const departments = [...new Set(employees.map(emp => emp.department))]
      const avgSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees
      
      return {
        totalEmployees,
        activeEmployees,
        departmentCount: departments.length,
        averageSalary: avgSalary,
        recentHires: employees
          .filter(emp => {
            const hireDate = new Date(emp.hireDate)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            return hireDate >= thirtyDaysAgo
          })
          .length
      }
    }
  }
}