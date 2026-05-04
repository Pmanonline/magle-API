import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter: nodemailer.Transporter | null = null;

// Create transporter with multiple fallback configurations
export async function createTransporter(): Promise<nodemailer.Transporter> {
  const emailService = process.env.EMAIL_SERVICE || "gmail";

  const configs: Record<string, any[]> = {
    gmail: [
      {
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000,
      },
      {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000,
      },
    ],
    outlook: [
      {
        service: "hotmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    ],
    custom: [
      {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    ],
  };

  const serviceConfigs = configs[emailService] || configs.gmail;

  for (let i = 0; i < serviceConfigs.length; i++) {
    try {
      console.log(
        `Attempting email connection ${i + 1}/${serviceConfigs.length}...`,
      );

      const newTransporter = nodemailer.createTransport(serviceConfigs[i]);

      const verifyPromise = newTransporter.verify();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timeout")), 15000);
      });

      await Promise.race([verifyPromise, timeoutPromise]);

      console.log(`Email service connected successfully (attempt ${i + 1})`);
      return newTransporter;
    } catch (error: any) {
      console.warn(`Connection attempt ${i + 1} failed:`, error.message);
      if (i === serviceConfigs.length - 1) {
        throw error;
      }
    }
  }

  throw new Error(
    "Failed to establish email connection with all configurations",
  );
}

// Initialize transporter
export async function initializeTransporter(): Promise<void> {
  try {
    transporter = await createTransporter();
    console.log("✅ Email transporter initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize email transporter:", error);
  }
}

// Ensure transporter is available
export async function ensureTransporter(): Promise<nodemailer.Transporter> {
  if (!transporter) {
    transporter = await createTransporter();
  }
  return transporter;
}

// Initialize on module load
initializeTransporter();

// ─── Shared styles matching Maglo dashboard ───
const getBaseStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f4f5f7;
      color: #1a1d23;
      padding: 32px 16px;
    }
    .wrapper { max-width: 560px; margin: 0 auto; }

    /* Brand header */
    .header {
      background: #1a1d23;
      border-radius: 12px 12px 0 0;
      padding: 28px 32px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-mark {
      width: 36px; height: 36px;
      background: #b5f23d;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 18px; color: #1a1d23;
      font-style: italic;
    }
    .logo-text {
      font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;
    }
    .logo-dot { color: #b5f23d; }

    /* Body */
    .body {
      background: #ffffff;
      border: 1px solid #e8eaed;
      border-top: none;
      padding: 36px 32px;
    }
    .greeting {
      font-size: 22px; font-weight: 700; color: #1a1d23;
      margin-bottom: 12px; letter-spacing: -0.3px;
    }
    .message {
      font-size: 15px; color: #5a5f6b; line-height: 1.7; margin-bottom: 28px;
    }

    /* CTA Button */
    .btn-wrap { text-align: center; margin: 32px 0; }
    .btn {
      display: inline-block;
      background: #b5f23d;
      color: #1a1d23;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 36px;
      border-radius: 8px;
      letter-spacing: 0.1px;
    }

    /* Cards */
    .card {
      border-radius: 8px;
      padding: 18px 20px;
      margin: 20px 0;
      font-size: 14px;
      line-height: 1.7;
    }
    .card-info { background: #f8fffe; border: 1px solid #d1fae5; color: #065f46; }
    .card-warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
    .card-security { background: #fefce8; border: 1px solid #fef08a; color: #713f12; }
    .card strong { display: block; margin-bottom: 6px; font-weight: 600; }

    /* Link box */
    .link-box {
      background: #f4f5f7;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      padding: 14px 16px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #5a5f6b;
      word-break: break-all;
      margin: 20px 0;
    }
    .link-box span { display: block; font-size: 11px; color: #8a8f9a; margin-bottom: 4px; }

    /* Divider */
    .divider { height: 1px; background: #e8eaed; margin: 24px 0; }

    /* Feature list */
    .feature-list { list-style: none; }
    .feature-list li {
      padding: 7px 0;
      font-size: 14px;
      color: #5a5f6b;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .feature-list li::before {
      content: '';
      width: 6px; height: 6px;
      background: #b5f23d;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Footer */
    .footer {
      background: #f4f5f7;
      border: 1px solid #e8eaed;
      border-top: none;
      border-radius: 0 0 12px 12px;
      padding: 20px 32px;
      text-align: center;
    }
    .footer-links { margin-bottom: 8px; }
    .footer-links a {
      color: #8a8f9a; font-size: 12px; text-decoration: none; margin: 0 8px;
    }
    .footer-copy { font-size: 11px; color: #b0b5bf; }
  </style>
`;

const footerHtml = () => `
  <div class="footer">
    <div class="footer-links">
      <a href="#">Help Center</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
    </div>
    <div class="footer-copy">© ${new Date().getFullYear()} Maglo Financial Management. All rights reserved.</div>
  </div>
`;

const headerHtml = () => `
  <div class="header">
    <div class="logo-mark">m</div>
    <div class="logo-text">Maglo<span class="logo-dot">.</span></div>
  </div>
`;

// ─── VERIFICATION EMAIL ───────────────────────────────────────────────────────
export const sendVerificationEmail = async (
  email: string,
  token: string,
  username?: string,
): Promise<void> => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationUrl = `${frontendURL}/verify-email?token=${token}`;
  const fromEmail =
    process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || "noreply@maglo.com";

  const mailOptions = {
    from: `"Maglo" <${fromEmail}>`,
    to: email,
    subject: "Verify Your Email – Maglo Financial Management",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      ${getBaseStyles()}
      </head><body><div class="wrapper">
      ${headerHtml()}      
      <div class="body">
        <div class="greeting">Welcome to Maglo, ${username || email.split("@")[0]}! 👋</div>
        <div class="message">
          Thanks for signing up! You're one step away from accessing your financial dashboard — just verify your email address to get started.
        </div>
        <div class="btn-wrap">
          <a href="${verificationUrl}" class="btn">Verify Email Address</a>
        </div>
        <div class="card card-info">
          <strong>Why verify?</strong>
          <ul class="feature-list">
            <li>Secure access to your financial dashboard</li>
            <li>Receive invoice and payment notifications</li>
            <li>Track transactions across your wallets</li>
            <li>Manage working capital in real time</li>
          </ul>
        </div>
        <div class="link-box">
          <span>Or copy this link into your browser:</span>
          ${verificationUrl}
        </div>
        <div class="card card-warning">
          ⏰ This link expires in <strong>24 hours</strong>. If you didn't create a Maglo account, you can safely ignore this email.
        </div>
      </div>
      ${footerHtml()}
      </div></body></html>`,
  };

  try {
    const activeTransporter = await ensureTransporter();
    await activeTransporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// ─── WELCOME EMAIL (Stats Bar Removed) ────────────────────────────────────────
export const sendWelcomeEmail = async (
  email: string,
  username?: string,
): Promise<void> => {
  const fromEmail =
    process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || "noreply@maglo.com";
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

  const mailOptions = {
    from: `"Maglo" <${fromEmail}>`,
    to: email,
    subject: "Welcome to Maglo – Your Financial Journey Starts Here 🎉",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      ${getBaseStyles()}
      </head><body><div class="wrapper">
      ${headerHtml()}
      <div class="body">
        <div class="greeting">You're verified, ${username || email.split("@")[0]}! 🎊</div>
        <div class="message">
          Your Maglo account is ready. You now have access to your full financial dashboard — track invoices, manage wallets, and monitor your working capital in real time.
        </div>
        <div class="card card-info">
          <strong>What you can do with Maglo:</strong>
          <ul class="feature-list">
            <li>Track invoices and payment status in real time</li>
            <li>Manage multiple wallets and working capital</li>
            <li>Monitor income vs. expenses with live charts</li>
            <li>Send and receive money instantly</li>
            <li>Get notified on every transaction</li>
          </ul>
        </div>
        <div class="btn-wrap">
          <a href="${frontendURL}/dashboard" class="btn">Go to Dashboard</a>
        </div>
        <div class="divider"></div>
        <p style="font-size:13px;color:#8a8f9a;text-align:center;">
          Complete your profile to unlock higher transaction limits and priority support.
        </p>
      </div>
      ${footerHtml()}
      </div></body></html>`,
  };

  try {
    const activeTransporter = await ensureTransporter();
    await activeTransporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

// ─── FORGOT PASSWORD EMAIL (Stats Bar Removed) ────────────────────────────────
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendURL}/reset-password?token=${token}`;
  const fromEmail =
    process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || "noreply@maglo.com";

  const mailOptions = {
    from: `"Maglo" <${fromEmail}>`,
    to: email,
    subject: "Password Reset Request – Maglo Financial Management",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      ${getBaseStyles()}
      </head><body><div class="wrapper">
      ${headerHtml()}
      <div class="body">
        <div class="greeting">Password Reset Request 🔐</div>
        <div class="message">
          We received a request to reset the password on your Maglo account. Click below to set a new password. This link is valid for <strong>10 minutes</strong>.
        </div>
        <div class="btn-wrap">
          <a href="${resetUrl}" class="btn">Reset My Password</a>
        </div>
        <div class="link-box">
          <span>Or copy this link into your browser:</span>
          ${resetUrl}
        </div>
        <div class="card card-security">
          <strong>⚠️ Important security note</strong>
          <ul class="feature-list">
            <li>This link expires in 10 minutes</li>
            <li>If you didn't request this, you can ignore this email — your password won't change</li>
            <li>Never share this link with anyone</li>
            <li>Maglo will never ask for your password</li>
          </ul>
        </div>
        <div class="card card-info" style="margin-top:16px;">
          Didn't request a reset? Contact us immediately at <strong>security@maglo.com</strong>
        </div>
      </div>
      ${footerHtml()}
      </div></body></html>`,
  };

  try {
    const activeTransporter = await ensureTransporter();
    await activeTransporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// ─── PASSWORD RESET SUCCESS EMAIL (Stats Bar Removed) ──────────────────────────
export const sendPasswordResetSuccessEmail = async (
  email: string,
): Promise<void> => {
  const fromEmail =
    process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || "noreply@maglo.com";
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

  const mailOptions = {
    from: `"Maglo" <${fromEmail}>`,
    to: email,
    subject: "Password Reset Successful – Maglo",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      ${getBaseStyles()}
      </head><body><div class="wrapper">
      ${headerHtml()}
      <div class="body">
        <div class="greeting">Password Updated Successfully! ✅</div>
        <div class="message">
          Your Maglo account password has been changed successfully. You can now log in with your new credentials.
        </div>
        <div class="card card-info">
          <strong>What's next?</strong>
          <ul class="feature-list">
            <li>Log in with your new password</li>
            <li>Review your recent account activity</li>
            <li>Consider enabling two-factor authentication for extra security</li>
          </ul>
        </div>
        <div class="btn-wrap">
          <a href="${frontendURL}/login" class="btn">Log In to Maglo</a>
        </div>
        <div class="card card-warning">
          <strong>⚠️ Didn't make this change?</strong>
          Contact our support team immediately at <strong>support@maglo.com</strong> — your account may be compromised.
        </div>
      </div>
      ${footerHtml()}
      </div></body></html>`,
  };

  try {
    const activeTransporter = await ensureTransporter();
    await activeTransporter.sendMail(mailOptions);
    console.log(`✅ Password reset success email sent to ${email}`);
  } catch (error: any) {
    console.error("Error sending password reset success email:", error);
    throw new Error("Failed to send password reset success email");
  }
};

// ─── TEST EMAIL CONFIGURATION ─────────────────────────────────────────────────
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    console.log("✅ Email configuration is valid");
    return true;
  } catch (error: any) {
    console.error("❌ Email configuration error:", error);
    return false;
  }
};
