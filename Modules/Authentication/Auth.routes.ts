// Modules/Authentication/Auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
} from "./Auth.contoller";
import { protect } from "../../middlewares/Auth.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account and send a verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, confirm_password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or passwords don't match
 *       409:
 *         description: User already exists
 */
router.post("/register", asyncHandler(register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return access & refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
router.post("/login", asyncHandler(login));

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify user email
 *     description: Verify user's email address using the token sent via email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
router.get("/verify-email", asyncHandler(verifyEmail));

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Email already verified
 *       404:
 *         description: User not found
 */
router.post("/resend-verification", asyncHandler(resendVerificationEmail));

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", asyncHandler(forgotPassword));

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, confirm_password]
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newpassword123"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or passwords don't match
 */
router.post("/reset-password", asyncHandler(resetPassword));

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", asyncHandler(refreshToken));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/logout", protect, asyncHandler(logout));

export default router;
