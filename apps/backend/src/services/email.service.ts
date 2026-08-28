import { Resend } from "resend";
import { env } from "../config/env.js";

class EmailService {
  private resend: Resend | null = null;

  constructor() {
    if (env.RESEND_API_KEY && env.RESEND_API_KEY !== "re_123456789") {
      this.resend = new Resend(env.RESEND_API_KEY);
    }
  }

  /**
   * Sends an account verification OTP email.
   */
  async sendVerificationOtpEmail(to: string, name: string, otp: string): Promise<boolean> {
    const subject = "Verify Your Account — SIH Platform";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32;">Welcome to SIH Platform, ${name}!</h2>
        <p>Thank you for registering. Please use the following 6-digit One-Time Password (OTP) to verify your account:</p>
        <div style="background-color: #f1f8e9; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1b5e20;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not create this account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} SIH Agricultural Marketplace. All rights reserved.</p>
      </div>
    `;

    return this.sendEmail(to, subject, html, `Your verification code is: ${otp}`);
  }

  /**
   * Sends a password reset email with token/OTP.
   */
  async sendPasswordResetEmail(to: string, name: string, resetToken: string, otp?: string): Promise<boolean> {
    const subject = "Reset Your Password — SIH Platform";
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(to)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #c62828;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. You can reset your password by clicking the button below or using the reset token.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #2e7d32; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        ${
          otp
            ? `<p>Or enter this OTP on the password reset screen: <strong style="font-size: 18px; letter-spacing: 2px;">${otp}</strong></p>`
            : ""
        }
        <p style="color: #666; font-size: 14px;">This link and token are single-use and will expire in 15 minutes. If you did not request this, please secure your account immediately.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} SIH Agricultural Marketplace. All rights reserved.</p>
      </div>
    `;

    return this.sendEmail(to, subject, html, `Reset your password at: ${resetUrl}`);
  }

  /**
   * Internal helper to dispatch email via Resend or log in dev/test environment.
   */
  private async sendEmail(to: string, subject: string, html: string, textFallback: string): Promise<boolean> {
    if (this.resend) {
      try {
        const { error } = await this.resend.emails.send({
          from: env.EMAIL_FROM,
          to,
          subject,
          html,
          text: textFallback,
        });

        if (error) {
          console.error("❌ Resend email dispatch error:", error);
          return false;
        }
        return true;
      } catch (err) {
        console.error("❌ Failed sending email via Resend:", err);
        return false;
      }
    } else {
      // In development or when Resend API key is mock, log clearly to console
      if (env.NODE_ENV !== "test") {
        console.log(`\n📧 [EMAIL MOCK SERVICE - Resend Key not set / Development Mode]`);
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Content: ${textFallback}\n`);
      }
      return true;
    }
  }
}

export const emailService = new EmailService();
