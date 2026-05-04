import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./Transaction.controller";
import { protect } from "../../middlewares/Auth.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management endpoints
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions (supports ?type=income|expense&status=completed|pending)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/", asyncHandler(getTransactions));

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount, client]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               client:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [completed, pending, failed]
 *               wallet:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post("/", asyncHandler(createTransaction));
router.patch("/:id", asyncHandler(updateTransaction));
router.delete("/:id", asyncHandler(deleteTransaction));

export default router;
