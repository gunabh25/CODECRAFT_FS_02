import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const hashPassword = async (password) => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const getTokenFromHeaders = (req) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

// Middleware to protect routes
export const requireAuth = (handler) => {
  return async (req, res) => {
    try {
      const token = getTokenFromHeaders(req)
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const decoded = verifyToken(token)
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      req.user = decoded
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' })
    }
  }
}

// Default admin user for demo
export const DEFAULT_ADMIN = {
  id: 'admin-001',
  email: 'admin@company.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hIZzgRG2G', // password123
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
}