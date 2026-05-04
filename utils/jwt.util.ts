import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}

export const signJwt = (payload: object, options?: jwt.SignOptions): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = options?.expiresIn || "1d";

  return jwt.sign(payload, secret, { ...options, expiresIn });
};

export const verifyJwt = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const decodeJwt = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
