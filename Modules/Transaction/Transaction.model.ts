import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  type: "income" | "expense";
  amount: number;
  client: string;
  description?: string;
  status: "completed" | "pending" | "failed";
  wallet?: mongoose.Types.ObjectId;
  invoice?: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    client: {
      type: String,
      required: [true, "Client/description is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema,
);
export default Transaction;
