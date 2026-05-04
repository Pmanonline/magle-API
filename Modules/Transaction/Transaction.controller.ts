import { Request, Response, NextFunction } from "express";
import Transaction from "./Transaction.model";

// ─── GET ALL TRANSACTIONS ─────────────────────────────────────────────────────
export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { type, status, limit = 50 } = req.query;

    const filter: Record<string, any> = { owner: userId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("wallet", "name currency")
      .populate("invoice", "invoiceNumber clientName");

    res.status(200).json({ status: "success", transactions });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE TRANSACTION ───────────────────────────────────────────────────────
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { type, amount, client, description, status, wallet, invoice } =
      req.body;

    if (!type || !amount || !client) {
      const error: any = new Error("type, amount, and client are required");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const transaction = await Transaction.create({
      type,
      amount,
      client,
      description,
      status: status || "completed",
      wallet,
      invoice,
      owner: userId,
    });

    res.status(201).json({ status: "success", transaction });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE TRANSACTION ───────────────────────────────────────────────────────
export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const allowed = [
      "type",
      "amount",
      "client",
      "description",
      "status",
      "wallet",
    ];
    const updates: Record<string, any> = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, owner: userId },
      updates,
      { new: true, runValidators: true },
    );

    if (!transaction) {
      const error: any = new Error("Transaction not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", transaction });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE TRANSACTION ───────────────────────────────────────────────────────
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      owner: userId,
    });

    if (!transaction) {
      const error: any = new Error("Transaction not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};
