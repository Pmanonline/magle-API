// utils/signAndVerifyToken.util.ts
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const signJwt = (payload: object, options?: jwt.SignOptions): string => {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return jwt.sign(payload, secret, { expiresIn: "1d", ...options });
};

export const verifyJwt = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET as string;
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
};

export const decodeJwt = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
};
