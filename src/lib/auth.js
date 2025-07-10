import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '7f5a66c5673e5f96d670355fc6d301c9664d18a90c7c8d2dfa0e3d693c1e60d80dcac353c6fd5746cec6b8c5674601b83042a260ece97f2ebe5596be1b809a13';

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}








