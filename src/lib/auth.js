import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '7f5a66c5673e5f96d670355fc6d301c9664d18a90c7c8d2dfa0e3d693c1e60d80dcac353c6fd5746cec6b8c5674601b83042a260ece97f2ebe5596be1b809a13');
    return decoded;
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return null;
  }
}
