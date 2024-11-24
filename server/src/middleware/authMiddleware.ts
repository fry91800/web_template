import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/jwt';
import { JwtPayload } from "jsonwebtoken";


// Middleware to protect routes by checking for a valid JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  let accessToken = req.cookies.access_token;
  if (accessToken) {
    const accessDecoded = verifyAccessToken(accessToken);

    if (accessDecoded) {
      req.session = accessDecoded;
      return next();
    }
    // access token iexpired or invalid
  }
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    console.log("tentative de refresh token")
    const refreshDecoded = verifyAccessToken(refreshToken);

    if (refreshDecoded) {


      // Generate a new access token
      accessToken = generateAccessToken(refreshDecoded.sub);
      // Set the token in an HTTP-only cookie TODO: refactor with the same cookie maker in auth route
      res.cookie('access_token', accessToken, {
        httpOnly: true, // Prevent access via JavaScript
        secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
        sameSite: 'strict', // Prevent cross-site requests
        maxAge: 3600000, // Token expiration in milliseconds (1 hour)
      });
      const accessDecoded = verifyAccessToken(accessToken);
  
      if (accessDecoded) {
        req.session = accessDecoded;
        return next();
      }
    }
  }
  // No tokens
  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: 'No access nor refresh token found' });
  }

};