import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number; // Window size in milliseconds
  maxRequests: number; // Maximum number of requests per window
}

interface ClientRequestData {
  count: number;
  timestamp: number;
}

const rateLimit = ({ windowMs, maxRequests }: RateLimitOptions) => {
  const clients: Record<string, ClientRequestData> = {};

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || "unknown";
    const currentTime = Date.now();

    const clientData = clients[clientIP] || {
      count: 0,
      timestamp: currentTime,
    };

    if (currentTime - clientData.timestamp > windowMs) {
      clientData.count = 0;
      clientData.timestamp = currentTime;
    }

    clientData.count++;

    if (clientData.count > maxRequests) {
      return res.status(429).json({
        status: "error",
        message: "Too many requests, please try again later.",
      });
    }

    clients[clientIP] = clientData;
    next();
  };
};

export default rateLimit;
