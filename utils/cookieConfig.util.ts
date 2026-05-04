// utils/cookieConfig.util.ts

export const getCookieOptions = (maxAge: number) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.COOKIE_DOMAIN || "";

  const cleanDomain = cookieDomain
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .replace(/\/$/, "");

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    maxAge,
    path: "/",
    ...(isProduction && cleanDomain ? { domain: cleanDomain } : {}),
  };
};

export const clearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.COOKIE_DOMAIN || "";

  const cleanDomain = cookieDomain
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .replace(/\/$/, "");

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge: 0,
    ...(isProduction && cleanDomain ? { domain: cleanDomain } : {}),
  };
};
