// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/signAndVerifyToken.util";

// Extend Express Request to carry user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Try cookie first, then Authorization header
    let token: string | undefined = req.cookies?.access_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      const error: any = new Error(
        "You are not logged in. Please log in to get access.",
      );
      error.statusCode = 401;
      error.status = "fail";
      return next(error);
    }

    // 2. Verify token
    const decoded = verifyJwt(token);
    if (!decoded) {
      const error: any = new Error(
        "Invalid or expired token. Please log in again.",
      );
      error.statusCode = 401;
      error.status = "fail";
      return next(error);
    }

    // 3. Attach user to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error: any = new Error(
        "You do not have permission to perform this action.",
      );
      error.statusCode = 403;
      error.status = "fail";
      return next(error);
    }
    next();
  };
};
