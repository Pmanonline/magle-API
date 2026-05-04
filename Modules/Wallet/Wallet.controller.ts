import { Request, Response, NextFunction } from "express";
import Wallet from "./Wallet.model";

// ─── GET ALL WALLETS ──────────────────────────────────────────────────────────
export const getWallets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const wallets = await Wallet.find({ owner: userId }).sort({ createdAt: 1 });
    res.status(200).json({ status: "success", wallets });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE WALLET ────────────────────────────────────────────────────────
export const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      owner: userId,
    });

    if (!wallet) {
      const error: any = new Error("Wallet not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", wallet });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE WALLET ────────────────────────────────────────────────────────────
export const createWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { name, balance, currency, color } = req.body;

    if (!name) {
      const error: any = new Error("Wallet name is required");
      error.statusCode = 400;
      error.status = "fail";
      return next(error);
    }

    const wallet = await Wallet.create({
      name,
      balance: balance || 0,
      currency: currency || "USD",
      color: color || "bg-green-50",
      owner: userId,
    });

    res.status(201).json({ status: "success", wallet });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE WALLET ────────────────────────────────────────────────────────────
export const updateWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const allowed = ["name", "balance", "currency", "color"];
    const updates: Record<string, any> = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const wallet = await Wallet.findOneAndUpdate(
      { _id: req.params.id, owner: userId },
      updates,
      { new: true, runValidators: true },
    );

    if (!wallet) {
      const error: any = new Error("Wallet not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", wallet });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE WALLET ────────────────────────────────────────────────────────────
export const deleteWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const wallet = await Wallet.findOneAndDelete({
      _id: req.params.id,
      owner: userId,
    });

    if (!wallet) {
      const error: any = new Error("Wallet not found");
      error.statusCode = 404;
      error.status = "fail";
      return next(error);
    }

    res.status(200).json({ status: "success", message: "Wallet deleted" });
  } catch (error) {
    next(error);
  }
};
