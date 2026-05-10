import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }

  // 👇 reusable domain methods (IMPORTANT DESIGN)
  async sendVerificationEmail(email: string, link: string) {
    return this.sendMail(
      email,
      'Verify your email',
      `<p>Click below to verify:</p><a href="${link}">${link}</a>`,
    );
  }

  async sendResetPasswordEmail(email: string, link: string) {
    return this.sendMail(
      email,
      'Reset your password',
      `<p>Click below to reset:</p><a href="${link}">${link}</a>`,
    );
  }
}
