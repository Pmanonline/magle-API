import { Router } from "express";
import {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
} from "./Wallet.controller";
import { protect } from "../../middlewares/Auth.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet management endpoints
 */

/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: Get all wallets for the user
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wallets
 */
router.get("/", asyncHandler(getWallets));

/**
 * @swagger
 * /api/wallets:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               balance:
 *                 type: number
 *               currency:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wallet created
 */
router.post("/", asyncHandler(createWallet));

router.get("/:id", asyncHandler(getWallet));
router.patch("/:id", asyncHandler(updateWallet));
router.delete("/:id", asyncHandler(deleteWallet));

export default router;
