import { Router } from "express";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
  getInvoiceStats,
} from "./Invoice.controller";
import { protect } from "../../middlewares/Auth.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const router = Router();

// All invoice routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management endpoints
 */

/**
 * @swagger
 * /api/invoices/stats:
 *   get:
 *     summary: Get invoice dashboard stats
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats returned
 */
router.get("/stats", asyncHandler(getInvoiceStats));

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices for the authenticated user
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get("/", asyncHandler(getInvoices));

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientName, clientEmail, amount, dueDate]
 *             properties:
 *               clientName:
 *                 type: string
 *               clientEmail:
 *                 type: string
 *               clientAddress:
 *                 type: string
 *               amount:
 *                 type: number
 *               vat:
 *                 type: number
 *               dueDate:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [paid, unpaid, pending]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post("/", asyncHandler(createInvoice));

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get a single invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice data
 *       404:
 *         description: Invoice not found
 */
router.get("/:id", asyncHandler(getInvoice));

/**
 * @swagger
 * /api/invoices/{id}:
 *   patch:
 *     summary: Update an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice updated
 *       404:
 *         description: Invoice not found
 */
router.patch("/:id", asyncHandler(updateInvoice));

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice deleted
 */
router.delete("/:id", asyncHandler(deleteInvoice));

/**
 * @swagger
 * /api/invoices/{id}/mark-paid:
 *   patch:
 *     summary: Mark an invoice as paid
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice marked as paid
 */
router.patch("/:id/mark-paid", asyncHandler(markInvoiceAsPaid));

export default router;
