import { Request, Response, NextFunction } from 'express';
import { Failure } from '../types/failure'

// Middleware to check if the user has the required role(s)
const checkRoles = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.session?.roles;
    if (!userRoles) {
        throw new Failure(400, "No roles assigned", { "role": "No role assigned" });
    }

    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
        throw new Failure(400, "insufficient permissions", { "role": "Insufficient permissions" });
    }

    next();
  };
};

export default checkRoles;