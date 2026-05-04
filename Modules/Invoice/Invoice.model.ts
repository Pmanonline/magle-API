import mongoose, { Document, Model, Schema } from "mongoose";

export interface IInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  amount: number;
  vat: number;
  vatAmount: number;
  total: number;
  dueDate: Date;
  status: "paid" | "unpaid" | "pending";
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      unique: true,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      lowercase: true,
      trim: true,
    },
    clientAddress: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    vat: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    vatAmount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "pending"],
      default: "unpaid",
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Auto-generate invoice number before saving
invoiceSchema.pre("save", async function () {
  if (this.isNew) {
    const count = await mongoose.model("Invoice").countDocuments();
    this.invoiceNumber = `MGL${String(count + 1).padStart(6, "0")}`;
  }
});

const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);
export default Invoice;
