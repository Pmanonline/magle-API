import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to Express's error middleware.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
