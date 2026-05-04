import mongoose, { Document, Schema } from "mongoose";

export interface IWallet extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  balance: number;
  currency: string;
  color: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    name: {
      type: String,
      required: [true, "Wallet name is required"],
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    color: {
      type: String,
      default: "bg-green-50",
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

const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
export default Wallet;
