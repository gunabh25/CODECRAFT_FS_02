import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[\d\s\-\(\)]+$/, 'Invalid phone number'),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  salary: z.number().min(0, 'Salary must be a positive number'),
  hireDate: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime()) && parsed <= new Date()
  }, 'Invalid hire date'),
  birthDate: z.string().refine((date) => {
    const parsed = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - parsed.getFullYear()
    return !isNaN(parsed.getTime()) && age >= 18 && age <= 100
  }, 'Invalid birth date (must be 18-100 years old)'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().regex(/^[\+]?[\d\s\-\(\)]+$/, 'Invalid emergency contact phone'),
    relationship: z.string().min(2, 'Relationship is required'),
  }),
})

export const updateEmployeeSchema = employeeSchema.partial()

export const validateEmployee = (data) => {
  try {
    return {
      success: true,
      data: employeeSchema.parse(data),
    }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message
        return acc
      }, {}),
    }
  }
}

export const validateLogin = (data) => {
  try {
    return {
      success: true,
      data: loginSchema.parse(data),
    }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {}),
    }
  }
}