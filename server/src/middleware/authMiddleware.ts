import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/jwt';
import { JwtPayload } from "jsonwebtoken";
import logger from '../config/logger';


// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check and validate access token
    let accessToken = req.cookies.access_token;
    if (accessToken) {
      const accessDecoded = verifyAccessToken(accessToken);

      if (accessDecoded) {
        logger.info(`Authentication: OK ${JSON.stringify(accessDecoded)}`)
        req.session = accessDecoded;
        return next();
      }
    }
    // Access token expired or invalid: Refresh access token from refresh token
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      logger.info("Authentication: Refreshing access token")
      const refreshDecoded = verifyRefreshToken(refreshToken);

      if (refreshDecoded) {
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
          logger.info(`Authentication: OK ${JSON.stringify(accessDecoded)}`)
          req.session = accessDecoded;
          return next();
        }
      }
    }
    // No token
    logger.info("Authentication: No token")
    next()
  }
  catch(err){
    next(err)
  }
};