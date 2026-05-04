// controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "./Auth.model";
import {
  getCookieOptions,
  clearCookieOptions,
} from "../../utils/cookieConfig.util";
import { createAndSendTokens } from "../../utils/createSessionAndSendToken.util";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from "../../utils/email.util";
import crypto from "crypto";

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error: any = new Error("Email and password are required");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const user = await User.findOne({ email }).select(
      "+password +refreshToken",
    );

    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      error.status = "fail";
      return next(error);
    }

    if (!user.email_verified) {
      const error: any = new Error(
        "Please verify your email before logging in",
      );
      error.statusCode = 403;
      error.status = "fail";
      return next(error);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      error.status = "fail";
      return next(error);
    }

    const tokenResult = await createAndSendTokens({
      user: { _id: user._id.toString(), email: user.email, role: user.role },
      message: "Login successful",
    });

    user.refreshToken = tokenResult.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie(
      "access_token",
      tokenResult.accessToken,
      getCookieOptions(24 * 60 * 60 * 1000),
    );
    res.cookie(
      "refresh_token",
      tokenResult.refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000),
    );

    res.status(200).json({
      status: "success",
      message: tokenResult.message,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
      },
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, confirm_password } = req.body;

    if (!email || !password || !confirm_password) {
      const error: any = new Error(
        "Email, password, and confirm_password are required",
      );
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    if (password !== confirm_password) {
      const error: any = new Error("Passwords do not match");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: any = new Error("User with this email already exists");
      error.statusCode = 409;
      error.status = "fail";
      return next(error);
    }

    const user = await User.create({ email, password });

    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      status: "success",
      message:
        "Account created successfully! Verification email sent. Please verify your account to continue.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      const error: any = new Error("Verification token is required");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
        email: string;
      };
    } catch {
      const error: any = new Error("Invalid or expired verification token");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    if (user.email_verified) {
      return res.status(200).json({
        status: "success",
        message: "Email already verified. Please login.",
      });
    }

    user.email_verified = true;
    await user.save({ validateBeforeSave: false });

    await sendWelcomeEmail(user.email);

    res.status(200).json({
      status: "success",
      message: "Email verified successfully! Welcome to Maglo.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── RESEND VERIFICATION ──────────────────────────────────────────────────────
export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error: any = new Error("Email is required");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    if (user.email_verified) {
      const error: any = new Error("Email is already verified");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      status: "success",
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error: any = new Error("Email is required");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error("No account found with that email");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      status: "success",
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.query;
    const { password, confirm_password } = req.body;

    if (!token || typeof token !== "string") {
      const error: any = new Error("Reset token is required");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    if (!password || !confirm_password) {
      const error: any = new Error(
        "Password and confirm_password are required",
      );
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    if (password !== confirm_password) {
      const error: any = new Error("Passwords do not match");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      const error: any = new Error("Invalid or expired reset token");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await sendPasswordResetSuccessEmail(user.email);

    res.status(200).json({
      status: "success",
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.refresh_token || req.body.refreshToken;

    if (!token) {
      const error: any = new Error("Refresh token is required");
      error.statusCode = 401;
      error.status = "fail";
      return next(error);
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };
    } catch {
      const error: any = new Error("Invalid or expired refresh token");
      error.statusCode = 401;
      error.status = "fail";
      return next(error);
    }

    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    if (user.refreshToken !== token) {
      const error: any = new Error("Invalid refresh token");
      error.statusCode = 401;
      error.status = "fail";
      return next(error);
    }

    const tokenResult = await createAndSendTokens({
      user: { _id: user._id.toString(), email: user.email, role: user.role },
      message: "Token refreshed successfully",
    });

    user.refreshToken = tokenResult.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie(
      "access_token",
      tokenResult.accessToken,
      getCookieOptions(24 * 60 * 60 * 1000),
    );
    res.cookie(
      "refresh_token",
      tokenResult.refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000),
    );

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    res.clearCookie("access_token", clearCookieOptions());
    res.clearCookie("refresh_token", clearCookieOptions());

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
