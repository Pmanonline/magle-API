// utils/createSessionAndSendToken.util.ts
import { signJwt } from "./signAndVerifyToken.util";

export interface UserData {
  _id: string;
  email: string;
  role: string;
  name?: string;
}

export interface CreateTokensParams {
  user: UserData;
  message?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
  user: UserData;
  status: string;
}

export const createAndSendTokens = async ({
  user,
  message = "Login successful",
}: CreateTokensParams): Promise<TokenResponse> => {
  if (!user.email) {
    throw new Error("User email is required for token creation");
  }

  const accessToken = signJwt(
    { userId: user._id, email: user.email, role: user.role },
    { expiresIn: "1d" },
  );

  const refreshToken = signJwt({ userId: user._id }, { expiresIn: "30d" });

  return {
    accessToken,
    refreshToken,
    message,
    user: { ...user },
    status: "success",
  };
};
