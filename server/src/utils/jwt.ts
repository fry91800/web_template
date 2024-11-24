import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Secret key for signing the JWT
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '1h'; // JWT expiration time
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'; // Cookie maxAge in milliseconds

interface JwtPayload {
  sub: string; // User ID (or any unique identifier)
  iat: number; // Issued at time
  roles: string[];
}

// Function to sign an access token
export const generateAccessToken = (userId: string): string => {
  const payload: JwtPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000), // Current timestamp in seconds
    roles: ["admin"] // Example roles
  };

  return jwt.sign(payload, secretKey, { expiresIn: accessTokenExpiresIn });
};

// Function to sign a refresh token
export const generateRefreshToken = (userId: string): string => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, secretKey, { expiresIn: refreshTokenExpiresIn });
};

// Function to verify an access token
export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Function to verify a refresh token
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
