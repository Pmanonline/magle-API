import { Request, Response, NextFunction } from "express";
import Invoice from "./Invoice.model";

// ─── GET ALL INVOICES ─────────────────────────────────────────────────────────
export const getInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const invoices = await Invoice.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      results: invoices.length,
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE INVOICE ───────────────────────────────────────────────────────
export const getInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!invoice) {
      const error: any = new Error("Invoice not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", invoice });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE INVOICE ───────────────────────────────────────────────────────────
export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const {
      clientName,
      clientEmail,
      clientAddress,
      amount,
      vat,
      vatAmount,
      total,
      dueDate,
      status,
      description,
    } = req.body;

    if (!clientName || !clientEmail || !amount || !dueDate) {
      const error: any = new Error(
        "clientName, clientEmail, amount and dueDate are required",
      );
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const invoice = await Invoice.create({
      clientName,
      clientEmail,
      clientAddress,
      amount,
      vat: vat || 0,
      vatAmount: vatAmount || 0,
      total: total || amount,
      dueDate,
      status: status || "unpaid",
      description,
      createdBy: userId,
    });

    res.status(201).json({ status: "success", invoice });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE INVOICE ───────────────────────────────────────────────────────────
export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const allowed = [
      "clientName",
      "clientEmail",
      "clientAddress",
      "amount",
      "vat",
      "vatAmount",
      "total",
      "dueDate",
      "status",
      "description",
    ];
    const updates: Record<string, any> = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, createdBy: userId },
      updates,
      { new: true, runValidators: true },
    );

    if (!invoice) {
      const error: any = new Error("Invoice not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", invoice });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE INVOICE ───────────────────────────────────────────────────────────
export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!invoice) {
      const error: any = new Error("Invoice not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", message: "Invoice deleted" });
  } catch (error) {
    next(error);
  }
};

// ─── MARK AS PAID ─────────────────────────────────────────────────────────────
export const markInvoiceAsPaid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, createdBy: userId },
      { status: "paid" },
      { new: true },
    );

    if (!invoice) {
      const error: any = new Error("Invoice not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", invoice });
  } catch (error) {
    next(error);
  }
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
export const getInvoiceStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const invoices = await Invoice.find({ createdBy: userId });

    const stats = {
      totalInvoices: invoices.length,
      totalPaid: invoices
        .filter((i) => i.status === "paid")
        .reduce((s, i) => s + i.total, 0),
      totalPending: invoices
        .filter((i) => i.status !== "paid")
        .reduce((s, i) => s + i.total, 0),
      totalVAT: invoices.reduce((s, i) => s + i.vatAmount, 0),
    };

    res.status(200).json({ status: "success", stats });
  } catch (error) {
    next(error);
  }
};
