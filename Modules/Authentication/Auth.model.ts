// Modules/Authentication/Auth.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const emailValidator = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  email_verified: boolean;
  role: string;
  refreshToken?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

export interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: emailValidator,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

// ─── Hash password before saving ──────────────────────────────────────────────
// NOTE: No generic, no typed next — TS6 + Mongoose resolves next correctly this way
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const doc = this as unknown as IUser;
  doc.password = await bcrypt.hash(doc.password, 10);
});

// ─── Track passwordChangedAt ───────────────────────────────────────────────────
userSchema.pre("save", function () {
  const doc = this as unknown as IUser;
  if (!doc.isModified("password") || doc.isNew) return;
  doc.passwordChangedAt = new Date(Date.now() - 1000);
});

// ─── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const doc = this as IUser;
  if (!doc.password) return false;
  return bcrypt.compare(candidatePassword, doc.password);
};

userSchema.methods.createPasswordResetToken = function (): string {
  const doc = this as IUser;
  const resetToken = crypto.randomBytes(32).toString("hex");
  doc.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  doc.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number,
): boolean {
  const doc = this as IUser;
  if (doc.passwordChangedAt) {
    const changedTimestamp = Math.floor(doc.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;
