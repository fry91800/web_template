import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Secret key for signing the JWT
const expiresIn = '1h'; // Expiration time for the token (e.g., 1 hour)

interface JwtPayload {
  sub: string; // User ID (or any unique identifier)
  iat: number; // Issued at time
  roles: string[];
}

// Function to sign a JWT
export const generateToken = (userId: string): string => {
  const payload: JwtPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000), // Current timestamp in seconds
    roles: ["admin"] 
  };

  return jwt.sign(payload, secretKey, { expiresIn });
};

// Function to verify a JWT
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded; // Returns the decoded payload if valid
  } catch (error) {
    return null; // Return null if verification fails
  }
};
